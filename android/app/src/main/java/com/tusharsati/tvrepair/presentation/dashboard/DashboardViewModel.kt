package com.tusharsati.tvrepair.presentation.dashboard

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tusharsati.tvrepair.data.model.DashboardStats
import com.tusharsati.tvrepair.data.repository.RepairRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class DashboardViewModel @Inject constructor(
    private val repository: RepairRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(DashboardUiState())
    val uiState = _uiState.asStateFlow()

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            try {
                repository.syncJobs()
                val stats = repository.getDashboardStats()
                _uiState.value = DashboardUiState(
                    stats = stats,
                    isLoading = false
                )
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            }
        }
    }

    data class DashboardUiState(
        val stats: DashboardStats? = null,
        val isLoading: Boolean = false,
        val error: String? = null
    )
}
