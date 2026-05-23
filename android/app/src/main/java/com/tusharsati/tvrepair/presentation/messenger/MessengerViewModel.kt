package com.tusharsati.tvrepair.presentation.messenger

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tusharsati.tvrepair.data.model.RepairJob
import com.tusharsati.tvrepair.data.repository.RepairRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MessengerViewModel @Inject constructor(
    private val repository: RepairRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(MessengerUiState())
    val uiState = _uiState.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery = _searchQuery.asStateFlow()

    init {
        loadJobs()
    }

    fun loadJobs() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            repository.syncJobs()
            repository.getJobs()
                .catch { e -> _uiState.update { it.copy(isLoading = false, error = e.message) } }
                .collect { jobs ->
                    _uiState.update { it.copy(isLoading = false, jobs = jobs) }
                }
        }
    }

    fun onSearchQueryChanged(query: String) {
        _searchQuery.value = query
    }

    fun sendMessage(rowNumber: Int) {
        viewModelScope.launch {
            try {
                repository.sendMessage(rowNumber)
                // Refresh is handled by Flow emission
            } catch (e: Exception) {
                // Show error
            }
        }
    }

    val filteredJobs = combine(_uiState, _searchQuery) { state, query ->
        if (query.isBlank()) {
            state.jobs
        } else {
            state.jobs.filter {
                it.customerName.contains(query, ignoreCase = true) ||
                it.jobNumber.contains(query, ignoreCase = true)
            }
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    data class MessengerUiState(
        val jobs: List<RepairJob> = emptyList(),
        val isLoading: Boolean = false,
        val error: String? = null
    )
}
