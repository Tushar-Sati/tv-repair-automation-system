package com.tusharsati.tvrepair.data.model;

@kotlin.Metadata(mv = {1, 9, 0}, k = 1, xi = 48, d1 = {"\u00002\n\u0002\u0018\u0002\n\u0002\u0010\u0000\n\u0000\n\u0002\u0010\b\n\u0002\b\u0004\n\u0002\u0010\u0006\n\u0000\n\u0002\u0010 \n\u0002\u0018\u0002\n\u0002\b\u0012\n\u0002\u0010\u000b\n\u0002\b\u0003\n\u0002\u0010\u000e\n\u0000\b\u0086\b\u0018\u00002\u00020\u0001B;\u0012\u0006\u0010\u0002\u001a\u00020\u0003\u0012\u0006\u0010\u0004\u001a\u00020\u0003\u0012\u0006\u0010\u0005\u001a\u00020\u0003\u0012\u0006\u0010\u0006\u001a\u00020\u0003\u0012\u0006\u0010\u0007\u001a\u00020\b\u0012\f\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\n\u00a2\u0006\u0002\u0010\fJ\t\u0010\u0016\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0017\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0018\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u0019\u001a\u00020\u0003H\u00c6\u0003J\t\u0010\u001a\u001a\u00020\bH\u00c6\u0003J\u000f\u0010\u001b\u001a\b\u0012\u0004\u0012\u00020\u000b0\nH\u00c6\u0003JK\u0010\u001c\u001a\u00020\u00002\b\b\u0002\u0010\u0002\u001a\u00020\u00032\b\b\u0002\u0010\u0004\u001a\u00020\u00032\b\b\u0002\u0010\u0005\u001a\u00020\u00032\b\b\u0002\u0010\u0006\u001a\u00020\u00032\b\b\u0002\u0010\u0007\u001a\u00020\b2\u000e\b\u0002\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\nH\u00c6\u0001J\u0013\u0010\u001d\u001a\u00020\u001e2\b\u0010\u001f\u001a\u0004\u0018\u00010\u0001H\u00d6\u0003J\t\u0010 \u001a\u00020\u0003H\u00d6\u0001J\t\u0010!\u001a\u00020\"H\u00d6\u0001R\u001c\u0010\t\u001a\b\u0012\u0004\u0012\u00020\u000b0\n8\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\r\u0010\u000eR\u0016\u0010\u0006\u001a\u00020\u00038\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u000f\u0010\u0010R\u0016\u0010\u0004\u001a\u00020\u00038\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0011\u0010\u0010R\u0016\u0010\u0005\u001a\u00020\u00038\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0012\u0010\u0010R\u0016\u0010\u0007\u001a\u00020\b8\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0013\u0010\u0014R\u0016\u0010\u0002\u001a\u00020\u00038\u0006X\u0087\u0004\u00a2\u0006\b\n\u0000\u001a\u0004\b\u0015\u0010\u0010\u00a8\u0006#"}, d2 = {"Lcom/tusharsati/tvrepair/data/model/DashboardStats;", "", "totalCustomers", "", "pendingMessages", "sentMessages", "deliveredJobs", "successRate", "", "brandDistribution", "", "Lcom/tusharsati/tvrepair/data/model/BrandStat;", "(IIIIDLjava/util/List;)V", "getBrandDistribution", "()Ljava/util/List;", "getDeliveredJobs", "()I", "getPendingMessages", "getSentMessages", "getSuccessRate", "()D", "getTotalCustomers", "component1", "component2", "component3", "component4", "component5", "component6", "copy", "equals", "", "other", "hashCode", "toString", "", "app_debug"})
public final class DashboardStats {
    @com.google.gson.annotations.SerializedName(value = "total_customers")
    private final int totalCustomers = 0;
    @com.google.gson.annotations.SerializedName(value = "pending_messages")
    private final int pendingMessages = 0;
    @com.google.gson.annotations.SerializedName(value = "sent_messages")
    private final int sentMessages = 0;
    @com.google.gson.annotations.SerializedName(value = "delivered_jobs")
    private final int deliveredJobs = 0;
    @com.google.gson.annotations.SerializedName(value = "success_rate")
    private final double successRate = 0.0;
    @com.google.gson.annotations.SerializedName(value = "brand_distribution")
    @org.jetbrains.annotations.NotNull()
    private final java.util.List<com.tusharsati.tvrepair.data.model.BrandStat> brandDistribution = null;
    
    public DashboardStats(int totalCustomers, int pendingMessages, int sentMessages, int deliveredJobs, double successRate, @org.jetbrains.annotations.NotNull()
    java.util.List<com.tusharsati.tvrepair.data.model.BrandStat> brandDistribution) {
        super();
    }
    
    public final int getTotalCustomers() {
        return 0;
    }
    
    public final int getPendingMessages() {
        return 0;
    }
    
    public final int getSentMessages() {
        return 0;
    }
    
    public final int getDeliveredJobs() {
        return 0;
    }
    
    public final double getSuccessRate() {
        return 0.0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.tusharsati.tvrepair.data.model.BrandStat> getBrandDistribution() {
        return null;
    }
    
    public final int component1() {
        return 0;
    }
    
    public final int component2() {
        return 0;
    }
    
    public final int component3() {
        return 0;
    }
    
    public final int component4() {
        return 0;
    }
    
    public final double component5() {
        return 0.0;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final java.util.List<com.tusharsati.tvrepair.data.model.BrandStat> component6() {
        return null;
    }
    
    @org.jetbrains.annotations.NotNull()
    public final com.tusharsati.tvrepair.data.model.DashboardStats copy(int totalCustomers, int pendingMessages, int sentMessages, int deliveredJobs, double successRate, @org.jetbrains.annotations.NotNull()
    java.util.List<com.tusharsati.tvrepair.data.model.BrandStat> brandDistribution) {
        return null;
    }
    
    @java.lang.Override()
    public boolean equals(@org.jetbrains.annotations.Nullable()
    java.lang.Object other) {
        return false;
    }
    
    @java.lang.Override()
    public int hashCode() {
        return 0;
    }
    
    @java.lang.Override()
    @org.jetbrains.annotations.NotNull()
    public java.lang.String toString() {
        return null;
    }
}