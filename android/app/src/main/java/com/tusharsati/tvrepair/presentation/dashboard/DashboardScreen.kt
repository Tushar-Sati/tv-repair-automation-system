package com.tusharsati.tvrepair.presentation.dashboard

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.PendingActions
import androidx.compose.material.icons.filled.TrendingUp
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tusharsati.tvrepair.data.model.BrandStat
import androidx.hilt.navigation.compose.hiltViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    viewModel: DashboardViewModel = hiltViewModel()
) {
    val state by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Business Insights", fontWeight = FontWeight.Bold) },
            )
        }
    ) { padding ->
        if (state.isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        } else if (state.stats != null) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                item {
                    val stats = listOf(
                        StatItem("Customers", state.stats!!.totalCustomers.toString(), Icons.Default.Group, Color(0xFF3B82F6)),
                        StatItem("Pending", state.stats!!.pendingMessages.toString(), Icons.Default.PendingActions, Color(0xFFF59E0B)),
                        StatItem("Sent", state.stats!!.sentMessages.toString(), Icons.Default.Message, Color(0xFF10B981)),
                        StatItem("Success Rate", "${state.stats!!.successRate.toInt()}%", Icons.Default.TrendingUp, Color(0xFF8B5CF6))
                    )

                    LazyVerticalGrid(
                        columns = GridCells.Fixed(2),
                        horizontalArrangement = Arrangement.spacedBy(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                        modifier = Modifier
                            .height(280.dp)
                            .fillMaxWidth()
                    ) {
                        items(stats) { item -> StatCard(item) }
                    }
                }

                item {
                    Text("Brand Distribution", fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(16.dp))
                    BrandDistributionChart(state.stats!!.brandDistribution)
                }
            }
        }
    }
}

@Composable
fun BrandDistributionChart(brands: List<BrandStat>) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        val maxVal = brands.maxOfOrNull { it.value }?.toFloat() ?: 1f
        brands.take(5).forEach { brand ->
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(text = brand.name, modifier = Modifier.width(80.dp), fontSize = 12.sp)
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(12.dp)
                        .background(Color.LightGray.copy(alpha = 0.3f), RoundedCornerShape(6.dp))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(brand.value / maxVal)
                            .fillMaxHeight()
                            .background(MaterialTheme.colorScheme.primary, RoundedCornerShape(6.dp))
                    )
                }
                Text(text = brand.value.toString(), modifier = Modifier.padding(start = 8.dp), fontSize = 12.sp)
            }
        }
    }
}

data class StatItem(val label: String, val value: String, val icon: ImageVector, val color: Color)

@Composable
fun StatCard(item: StatItem) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Icon(item.icon, contentDescription = null, tint = item.color)
            Spacer(modifier = Modifier.height(12.dp))
            Text(text = item.value, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Text(text = item.label, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
