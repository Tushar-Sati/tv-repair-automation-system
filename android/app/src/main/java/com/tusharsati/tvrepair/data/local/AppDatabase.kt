package com.tusharsati.tvrepair.data.local

import androidx.room.*
import com.tusharsati.tvrepair.data.model.RepairJob

@Entity(tableName = "jobs")
data class JobEntity(
    @PrimaryKey val id: String,
    val customerName: String,
    val phoneNumber: String,
    val brand: String,
    val status: String,
    val deliver: String,
    val messageStatus: String,
    val dateReceived: String,
    val jobNumber: String
)

@Dao
interface JobDao {
    @Query("SELECT * FROM jobs")
    fun getAllJobs(): kotlinx.coroutines.flow.Flow<List<JobEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertAll(jobs: List<JobEntity>)

    @Query("DELETE FROM jobs")
    suspend fun deleteAll()
}

@Database(entities = [JobEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun jobDao(): JobDao
}
