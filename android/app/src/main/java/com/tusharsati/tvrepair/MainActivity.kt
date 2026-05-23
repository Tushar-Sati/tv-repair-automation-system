package com.tusharsati.tvrepair

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Dashboard
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.tusharsati.tvrepair.data.repository.AuthRepository
import com.tusharsati.tvrepair.presentation.dashboard.DashboardScreen
import com.tusharsati.tvrepair.presentation.login.LoginScreen
import com.tusharsati.tvrepair.presentation.messenger.MessengerScreen
import com.tusharsati.tvrepair.presentation.settings.SettingsScreen
import com.tusharsati.tvrepair.ui.theme.TVRepairAutomationTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var authRepository: AuthRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TVRepairAutomationTheme {
                val isLoggedIn by authRepository.isLoggedIn.collectAsState()
                
                if (isLoggedIn) {
                    MainScreen(authRepository)
                } else {
                    LoginScreen(onLoginSuccess = { /* DataStore will trigger recomposition */ })
                }
            }
        }
    }
}

sealed class Screen(val route: String, val label: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Dashboard", Icons.Default.Dashboard)
    object Messenger : Screen("messenger", "Messenger", Icons.Default.Message)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

@Composable
fun MainScreen(authRepository: AuthRepository) {
    val navController = rememberNavController()
    val items = listOf(Screen.Dashboard, Screen.Messenger, Screen.Settings)

    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = null) },
                        label = { Text(screen.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = Screen.Dashboard.route, Modifier.padding(innerPadding)) {
            composable(Screen.Dashboard.route) { DashboardScreen() }
            composable(Screen.Messenger.route) { MessengerScreen() }
            composable(Screen.Settings.route) { 
                SettingsScreen(authRepository, onLogout = { authRepository.logout() })
            }
        }
    }
}
