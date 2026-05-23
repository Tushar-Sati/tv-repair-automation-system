package com.tusharsati.tvrepair.di

import com.tusharsati.tvrepair.data.repository.RepairRepository
import com.tusharsati.tvrepair.data.repository.RepairRepositoryImpl
import dagger.Binds
import dagger.Module
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    @Singleton
    abstract fun bindRepairRepository(
        repairRepositoryImpl: RepairRepositoryImpl
    ): RepairRepository
}
