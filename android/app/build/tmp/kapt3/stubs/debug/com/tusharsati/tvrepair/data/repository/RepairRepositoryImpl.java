package com.tusharsati.tvrepair.data.repository;

@javax.inject.Singleton()
@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000<\n\u0002\u0018\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\b\u0007\u0018\u00002\u00020\u0001B\u0017\b\u0007\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0005\u00a2\u0006\u0002\u0010\u0006J\u000e\u0010\u0007\u001a\u00020\bH\u0096@\u00a2\u0006\u0002\u0010\tJ\u0014\u0010\n\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\r0\f0\u000bH\u0016J\u0016\u0010\u000e\u001a\u00020\u000f2\u0006\u0010\u0010\u001a\u00020\u0011H\u0096@\u00a2\u0006\u0002\u0010\u0012J\u000e\u0010\u0013\u001a\u00020\u000fH\u0096@\u00a2\u0006\u0002\u0010\tR\u000e\u0010\u0002\u001a\u00020\u0003X\u0082\u0004\u00a2\u0006\u0002\n\u0000R\u000e\u0010\u0004\u001a\u00020\u0005X\u0082\u0004\u00a2\u0006\u0002\n\u0000\u00a8\u0006\u0014"}, d2 = {"Lcom/tusharsati/tvrepair/data/repository/RepairRepositoryImpl;", "Lcom/tusharsati/tvrepair/data/repository/RepairRepository;", "apiService", "Lcom/tusharsati/tvrepair/data/remote/ApiService;", "jobDao", "Lcom/tusharsati/tvrepair/data/local/JobDao;", "(Lcom/tusharsati/tvrepair/data/remote/ApiService;Lcom/tusharsati/tvrepair/data/local/JobDao;)V", "getDashboardStats", "Lcom/tusharsati/tvrepair/data/model/DashboardStats;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getJobs", "Lkotlinx/coroutines/flow/Flow;", "", "Lcom/tusharsati/tvrepair/data/model/RepairJob;", "sendMessage", "", "rowNumber", "", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "syncJobs", "app_debug"})
public final class RepairRepositoryImpl implements com.tusharsati.tvrepair.data.repository.RepairRepository {
    @org.jetbrains.annotations.NotNull()
    private final com.tusharsati.tvrepair.data.remote.ApiService apiService = null;
    @org.jetbrains.annotations.NotNull()
    private final com.tusharsati.tvrepair.data.local.JobDao jobDao = null;
    
    @javax.inject.Inject()
    public RepairRepositoryImpl(@org.jetbrains.annotations.NotNull()
    com.tusharsati.tvrepair.data.remote.ApiService apiService, @org.jetbrains.annotations.NotNull()
    com.tusharsati.tvrepair.data.local.JobDao jobDao) {
        super();
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public kotlinx.coroutines.flow.Flow<java.util.List<com.tusharsati.tvrepair.data.model.RepairJob>> getJobs() {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object syncJobs(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object sendMessage(int rowNumber, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion) {
        return null;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.Nullable()
    public java.lang.Object getDashboardStats(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.tusharsati.tvrepair.data.model.DashboardStats> $completion) {
        return null;
    }
}