package com.tusharsati.tvrepair.data.repository

import com.tusharsati.tvrepair.data.local.JobDao
import com.tusharsati.tvrepair.data.local.JobEntity
import com.tusharsati.tvrepair.data.model.*
import com.tusharsati.tvrepair.data.remote.ApiService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

interface RepairRepository {
    fun getJobs(): Flow<List<RepairJob>>
    suspend fun syncJobs()
    suspend fun sendMessage(rowNumber: Int)
    suspend fun getDashboardStats(): DashboardStats
}

@Singleton
class RepairRepositoryImpl @Inject constructor(
    private val apiService: ApiService,
    private val jobDao: JobDao
) : RepairRepository {

    override fun getJobs(): Flow<List<RepairJob>> {
        return jobDao.getAllJobs().map { entities ->
            entities.map { it.toDomain() }
        }
    }

    override suspend fun syncJobs() {
        try {
            val remoteJobs = apiService.getCustomers()
            jobDao.deleteAll() // Clear old data to ensure sync is fresh
            jobDao.insertAll(remoteJobs.map { it.toEntity() })
        } catch (e: Exception) {
            android.util.Log.e("RepairRepository", "Sync failed: ${e.message}", e)
        }
    }

    override suspend fun sendMessage(rowNumber: Int) {
        apiService.sendMessage(SendMessageRequest(rowNumber))
        syncJobs()
    }

    override suspend fun getDashboardStats(): DashboardStats {
        return apiService.getDashboardStats()
    }
}

// Mappers
fun RepairJob.toEntity() = JobEntity(
    id = id,
    customerName = customerName,
    phoneNumber = phoneNumber,
    brand = brand,
    status = status,
    deliver = deliver,
    messageStatus = messageStatus,
    dateReceived = dateReceived,
    jobNumber = jobNumber
)

fun JobEntity.toDomain() = RepairJob(
    id = id,
    rowNumber = 0,
    dateReceived = dateReceived,
    customerName = customerName,
    jobNumber = jobNumber,
    phoneNumber = phoneNumber,
    brand = brand,
    modelNo = "",
    serialNo = "",
    symptoms = "",
    partReplacement = "",
    status = status,
    deliver = deliver,
    messageStatus = messageStatus,
    payment = "",
    daysPending = 0
)
