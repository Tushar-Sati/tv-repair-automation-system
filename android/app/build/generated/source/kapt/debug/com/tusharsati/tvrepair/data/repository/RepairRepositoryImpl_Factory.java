package com.tusharsati.tvrepair.data.repository;

import com.tusharsati.tvrepair.data.local.JobDao;
import com.tusharsati.tvrepair.data.remote.ApiService;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata("javax.inject.Singleton")
@QualifierMetadata
@DaggerGenerated
@Generated(
    value = "dagger.internal.codegen.ComponentProcessor",
    comments = "https://dagger.dev"
)
@SuppressWarnings({
    "unchecked",
    "rawtypes",
    "KotlinInternal",
    "KotlinInternalInJava",
    "cast"
})
public final class RepairRepositoryImpl_Factory implements Factory<RepairRepositoryImpl> {
  private final Provider<ApiService> apiServiceProvider;

  private final Provider<JobDao> jobDaoProvider;

  public RepairRepositoryImpl_Factory(Provider<ApiService> apiServiceProvider,
      Provider<JobDao> jobDaoProvider) {
    this.apiServiceProvider = apiServiceProvider;
    this.jobDaoProvider = jobDaoProvider;
  }

  @Override
  public RepairRepositoryImpl get() {
    return newInstance(apiServiceProvider.get(), jobDaoProvider.get());
  }

  public static RepairRepositoryImpl_Factory create(Provider<ApiService> apiServiceProvider,
      Provider<JobDao> jobDaoProvider) {
    return new RepairRepositoryImpl_Factory(apiServiceProvider, jobDaoProvider);
  }

  public static RepairRepositoryImpl newInstance(ApiService apiService, JobDao jobDao) {
    return new RepairRepositoryImpl(apiService, jobDao);
  }
}
