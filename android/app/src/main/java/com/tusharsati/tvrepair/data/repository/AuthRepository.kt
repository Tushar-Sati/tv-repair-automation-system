package com.tusharsati.tvrepair.data.repository

import com.tusharsati.tvrepair.data.local.TokenManager
import com.tusharsati.tvrepair.data.model.LoginRequest
import com.tusharsati.tvrepair.data.remote.ApiService
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepository @Inject constructor(
    private val apiService: ApiService,
    private val tokenManager: TokenManager
) {
    private val _isLoggedIn = MutableStateFlow(tokenManager.getToken() != null)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn

    fun getToken(): String? = tokenManager.getToken()

    suspend fun login(username: String, password: String): Result<Unit> {
        return try {
            val response = apiService.login(LoginRequest(username, password))
            if (response.success) {
                tokenManager.saveToken(response.token)
                _isLoggedIn.value = true
                Result.success(Unit)
            } else {
                Result.failure(Exception("Login failed: Success flag was false"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun logout() {
        tokenManager.deleteToken()
        _isLoggedIn.value = false
    }
}
