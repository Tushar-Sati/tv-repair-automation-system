package com.tusharsati.tvrepair.data.repository;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000.\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0000\n\u0002\u0010\u0002\n\u0000\n\u0002\u0010\b\n\u0002\b\u0003\bf\u0018\u00002\u00020\u0001J\u000e\u0010\u0002\u001a\u00020\u0003H\u00a6@\u00a2\u0006\u0002\u0010\u0004J\u0014\u0010\u0005\u001a\u000e\u0012\n\u0012\b\u0012\u0004\u0012\u00020\b0\u00070\u0006H&J\u0016\u0010\t\u001a\u00020\n2\u0006\u0010\u000b\u001a\u00020\fH\u00a6@\u00a2\u0006\u0002\u0010\rJ\u000e\u0010\u000e\u001a\u00020\nH\u00a6@\u00a2\u0006\u0002\u0010\u0004\u00a8\u0006\u000f"}, d2 = {"Lcom/tusharsati/tvrepair/data/repository/RepairRepository;", "", "getDashboardStats", "Lcom/tusharsati/tvrepair/data/model/DashboardStats;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getJobs", "Lkotlinx/coroutines/flow/Flow;", "", "Lcom/tusharsati/tvrepair/data/model/RepairJob;", "sendMessage", "", "rowNumber", "", "(ILkotlin/coroutines/Continuation;)Ljava/lang/Object;", "syncJobs", "app_debug"})
public abstract interface RepairRepository {
    
    @org.jetbrains.annotations.NotNull()
    public abstract kotlinx.coroutines.flow.Flow<java.util.List<com.tusharsati.tvrepair.data.model.RepairJob>> getJobs();
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object syncJobs(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object sendMessage(int rowNumber, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super kotlin.Unit> $completion);
    
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getDashboardStats(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.tusharsati.tvrepair.data.model.DashboardStats> $completion);
}