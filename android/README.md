# TV Repair Automation — Android App

Production-ready native Android application built with Jetpack Compose and modern Android architecture.

## 🚀 Tech Stack
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose
- **Architecture**: MVVM + Clean Architecture
- **Dependency Injection**: Hilt
- **Networking**: Retrofit + OkHttp
- **Database**: Room (Offline Caching)
- **Concurrency**: Coroutines + Flow
- **Background Tasks**: WorkManager
- **Persistence**: DataStore (Auth Session)
- **Design**: Material Design 3

## 📦 Project Structure
- `data/`: Repositories, API interfaces, Room DB, and Workers.
- `presentation/`: Compose screens, ViewModels, and UI state.
- `di/`: Hilt modules for dependency injection.
- `ui/theme/`: Material 3 theme configuration.

## ⚙️ Setup Instructions
1. Open the `android` folder in **Android Studio (Hedgehog or newer)**.
2. Sync the project with Gradle files.
3. Update the `BASE_URL` in `NetworkModule.kt` to point to your backend API.
4. Ensure your backend is running and accessible from the device/emulator.
5. Build and run on an Android device (API 24+).

## 🔐 Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 🛠️ Features
- **Secure Login**: Admin-only access with persistent sessions.
- **Dashboard**: Real-time business analytics and quick stats.
- **Messenger**: Track customer jobs, filter by status, and view message states.
- **Offline Support**: View cached customer data without internet.
- **Auto-Sync**: Background synchronization of repair jobs.
- **Material 3 UI**: Clean, modern interface with Dark Mode support.
