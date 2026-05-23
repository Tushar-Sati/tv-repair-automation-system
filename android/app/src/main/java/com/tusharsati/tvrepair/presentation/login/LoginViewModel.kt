package com.tusharsati.tvrepair.presentation.login

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tusharsati.tvrepair.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class LoginViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState = _uiState.asStateFlow()

    private val _eventFlow = MutableSharedFlow<LoginEvent>()
    val eventFlow = _eventFlow.asSharedFlow()

    fun onUsernameChanged(username: String) {
        _uiState.value = _uiState.value.copy(username = username)
    }

    fun onPasswordChanged(password: String) {
        _uiState.value = _uiState.value.copy(password = password)
    }

    fun login() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = authRepository.login(_uiState.value.username.trim(), _uiState.value.password.trim())
            if (result.isSuccess) {
                _eventFlow.emit(LoginEvent.LoginSuccess)
            } else {
                val errorMsg = result.exceptionOrNull()?.let { e ->
                    when (e) {
                        is retrofit2.HttpException -> "Server Error ${e.code()}: ${e.message()}"
                        is java.io.IOException -> "Network Error: Check your internet connection"
                        else -> e.message ?: "Unknown error"
                    }
                } ?: "Unknown error"
                
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = errorMsg
                )
            }
        }
    }

    data class LoginUiState(
        val username: String = "",
        val password: String = "",
        val isLoading: Boolean = false,
        val error: String? = null
    )

    sealed class LoginEvent {
        object LoginSuccess : LoginEvent()
    }
}
