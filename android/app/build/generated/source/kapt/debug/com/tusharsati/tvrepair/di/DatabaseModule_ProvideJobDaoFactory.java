package com.tusharsati.tvrepair.di;

import com.tusharsati.tvrepair.data.local.AppDatabase;
import com.tusharsati.tvrepair.data.local.JobDao;
import dagger.internal.DaggerGenerated;
import dagger.internal.Factory;
import dagger.internal.Preconditions;
import dagger.internal.QualifierMetadata;
import dagger.internal.ScopeMetadata;
import javax.annotation.processing.Generated;
import javax.inject.Provider;

@ScopeMetadata
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
public final class DatabaseModule_ProvideJobDaoFactory implements Factory<JobDao> {
  private final Provider<AppDatabase> databaseProvider;

  public DatabaseModule_ProvideJobDaoFactory(Provider<AppDatabase> databaseProvider) {
    this.databaseProvider = databaseProvider;
  }

  @Override
  public JobDao get() {
    return provideJobDao(databaseProvider.get());
  }

  public static DatabaseModule_ProvideJobDaoFactory create(Provider<AppDatabase> databaseProvider) {
    return new DatabaseModule_ProvideJobDaoFactory(databaseProvider);
  }

  public static JobDao provideJobDao(AppDatabase database) {
    return Preconditions.checkNotNullFromProvides(DatabaseModule.INSTANCE.provideJobDao(database));
  }
}
