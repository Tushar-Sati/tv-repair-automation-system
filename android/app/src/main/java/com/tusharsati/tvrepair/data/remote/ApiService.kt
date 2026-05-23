package com.tusharsati.tvrepair.data.remote

import com.tusharsati.tvrepair.data.model.*
import retrofit2.http.*

interface ApiService {
    @POST("api/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @GET("api/customers")
    suspend fun getCustomers(): List<RepairJob>

    @GET("api/pending-messages")
    suspend fun getPendingMessages(): List<PendingMessage>

    @POST("api/send-message")
    suspend fun sendMessage(@Body request: SendMessageRequest): Map<String, String>

    @GET("api/dashboard-stats")
    suspend fun getDashboardStats(): DashboardStats

    @GET("api/message-history")
    suspend fun getMessageHistory(): List<RepairJob>
}
