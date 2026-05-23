package com.tusharsati.tvrepair.data.remote;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u0000B\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0000\n\u0002\u0018\u0002\n\u0002\b\u0002\n\u0002\u0010$\n\u0002\u0010\u000e\n\u0002\u0018\u0002\n\u0002\b\u0002\bf\u0018\u00002\u00020\u0001J\u0014\u0010\u0002\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00a7@\u00a2\u0006\u0002\u0010\u0005J\u000e\u0010\u0006\u001a\u00020\u0007H\u00a7@\u00a2\u0006\u0002\u0010\u0005J\u0014\u0010\b\u001a\b\u0012\u0004\u0012\u00020\u00040\u0003H\u00a7@\u00a2\u0006\u0002\u0010\u0005J\u0014\u0010\t\u001a\b\u0012\u0004\u0012\u00020\n0\u0003H\u00a7@\u00a2\u0006\u0002\u0010\u0005J\u0018\u0010\u000b\u001a\u00020\f2\b\b\u0001\u0010\r\u001a\u00020\u000eH\u00a7@\u00a2\u0006\u0002\u0010\u000fJ$\u0010\u0010\u001a\u000e\u0012\u0004\u0012\u00020\u0012\u0012\u0004\u0012\u00020\u00120\u00112\b\b\u0001\u0010\r\u001a\u00020\u0013H\u00a7@\u00a2\u0006\u0002\u0010\u0014\u00a8\u0006\u0015"}, d2 = {"Lcom/tusharsati/tvrepair/data/remote/ApiService;", "", "getCustomers", "", "Lcom/tusharsati/tvrepair/data/model/RepairJob;", "(Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "getDashboardStats", "Lcom/tusharsati/tvrepair/data/model/DashboardStats;", "getMessageHistory", "getPendingMessages", "Lcom/tusharsati/tvrepair/data/model/PendingMessage;", "login", "Lcom/tusharsati/tvrepair/data/model/LoginResponse;", "request", "Lcom/tusharsati/tvrepair/data/model/LoginRequest;", "(Lcom/tusharsati/tvrepair/data/model/LoginRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "sendMessage", "", "", "Lcom/tusharsati/tvrepair/data/model/SendMessageRequest;", "(Lcom/tusharsati/tvrepair/data/model/SendMessageRequest;Lkotlin/coroutines/Continuation;)Ljava/lang/Object;", "app_debug"})
public abstract interface ApiService {
    
    @retrofit2.http.POST(value = "api/login")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object login(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.tusharsati.tvrepair.data.model.LoginRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.tusharsati.tvrepair.data.model.LoginResponse> $completion);
    
    @retrofit2.http.GET(value = "api/customers")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getCustomers(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<com.tusharsati.tvrepair.data.model.RepairJob>> $completion);
    
    @retrofit2.http.GET(value = "api/pending-messages")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getPendingMessages(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<com.tusharsati.tvrepair.data.model.PendingMessage>> $completion);
    
    @retrofit2.http.POST(value = "api/send-message")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object sendMessage(@retrofit2.http.Body()
    @org.jetbrains.annotations.NotNull()
    com.tusharsati.tvrepair.data.model.SendMessageRequest request, @org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.Map<java.lang.String, java.lang.String>> $completion);
    
    @retrofit2.http.GET(value = "api/dashboard-stats")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getDashboardStats(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super com.tusharsati.tvrepair.data.model.DashboardStats> $completion);
    
    @retrofit2.http.GET(value = "api/message-history")
    @org.jetbrains.annotations.Nullable()
    public abstract java.lang.Object getMessageHistory(@org.jetbrains.annotations.NotNull()
    kotlin.coroutines.Continuation<? super java.util.List<com.tusharsati.tvrepair.data.model.RepairJob>> $completion);
}