package com.tusharsati.tvrepair.data.model

import com.google.gson.annotations.SerializedName

data class RepairJob(
    val id: String,
    @SerializedName("row_number") val rowNumber: Int,
    @SerializedName("date_received") val dateReceived: String,
    @SerializedName("customer_name") val customerName: String,
    @SerializedName("job_number") val jobNumber: String,
    @SerializedName("phone_number") val phoneNumber: String,
    val brand: String,
    @SerializedName("model_no") val modelNo: String,
    @SerializedName("serial_no") val serialNo: String,
    val symptoms: String,
    @SerializedName("part_replacement") val partReplacement: String,
    val status: String,
    val deliver: String,
    @SerializedName("message_status") val messageStatus: String,
    val payment: String,
    @SerializedName("days_pending") val daysPending: Int
)

data class JobUpdate(
    val status: String? = null,
    val deliver: String? = null,
    val payment: String? = null
)
