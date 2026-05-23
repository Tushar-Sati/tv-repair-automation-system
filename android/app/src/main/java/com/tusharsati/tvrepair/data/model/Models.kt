package com.tusharsati.tvrepair.data.model

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val username: String,
    val password: String
)

data class UserResponse(
    val name: String
)

data class LoginResponse(
    val success: Boolean,
    val token: String,
    val user: UserResponse
)

data class PendingMessage(
    @SerializedName("row_number") val rowNumber: Int,
    @SerializedName("customer_name") val customerName: String,
    @SerializedName("job_number") val jobNumber: String,
    @SerializedName("phone_number") val phoneNumber: String,
    val brand: String,
    val status: String
)

data class SendMessageRequest(
    @SerializedName("row_number") val rowNumber: Int,
    val status: String = "SENT"
)

data class BrandStat(
    val name: String,
    val value: Int
)

data class DashboardStats(
    @SerializedName("total_customers") val totalCustomers: Int,
    @SerializedName("pending_messages") val pendingMessages: Int,
    @SerializedName("sent_messages") val sentMessages: Int,
    @SerializedName("delivered_jobs") val deliveredJobs: Int,
    @SerializedName("success_rate") val successRate: Double,
    @SerializedName("brand_distribution") val brandDistribution: List<BrandStat>
)
