package com.tusharsati.tvrepair.presentation.messenger

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.tusharsati.tvrepair.data.model.RepairJob

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MessengerScreen(
    viewModel: MessengerViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val filteredJobs by viewModel.filteredJobs.collectAsState()

    Scaffold(
        topBar = {
            Column(modifier = Modifier.background(MaterialTheme.colorScheme.background)) {
                TopAppBar(
                    title = { Text("Repair Messenger", fontWeight = FontWeight.Bold) },
                )
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = viewModel::onSearchQueryChanged,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp),
                    placeholder = { Text("Search by name or Job ID") },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                    shape = RoundedCornerShape(12.dp)
                )
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(filteredJobs) { job ->
                JobCard(job, onSend = { viewModel.sendMessage(job.rowNumber) })
            }
        }
    }
}

@Composable
fun JobCard(job: RepairJob, onSend: () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                Column {
                    Text(text = job.customerName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text(text = "Job ID: ${job.jobNumber}", fontSize = 12.sp, color = Color.Gray)
                }
                StatusBadge(job.status)
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = "Brand: ${job.brand}", fontSize = 14.sp)
            Text(text = "Phone: ${job.phoneNumber}", fontSize = 14.sp)
            
            Divider(modifier = Modifier.padding(vertical = 12.dp))
            
            Row(verticalAlignment = Alignment.CenterVertically) {
                MessageStatusIcon(job.messageStatus)
                Spacer(modifier = Modifier.weight(1f))
                if (job.messageStatus != "SENT") {
                    Button(onClick = onSend, contentPadding = PaddingValues(horizontal = 12.dp, vertical = 4.dp)) {
                        Icon(Icons.Default.Send, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Send Update", fontSize = 12.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun StatusBadge(status: String) {
    val color = when (status.uppercase()) {
        "OK" -> Color(0xFF10B981)
        "NR" -> Color(0xFFEF4444)
        else -> Color(0xFFF59E0B)
    }
    Surface(color = color.copy(alpha = 0.1f), shape = RoundedCornerShape(4.dp)) {
        Text(
            text = if (status.isEmpty()) "PENDING" else status,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
            color = color, fontSize = 10.sp, fontWeight = FontWeight.Bold
        )
    }
}

@Composable
fun MessageStatusIcon(status: String) {
    val isSent = status == "SENT"
    Row(verticalAlignment = Alignment.CenterVertically) {
        Box(modifier = Modifier.size(8.dp).background(if (isSent) Color(0xFF3B82F6) else Color.Gray, RoundedCornerShape(4.dp)))
        Spacer(modifier = Modifier.width(8.dp))
        Text(text = if (isSent) "Update Sent" else "Ready to Send", fontSize = 12.sp, color = if (isSent) Color(0xFF3B82F6) else Color.Gray)
    }
}
