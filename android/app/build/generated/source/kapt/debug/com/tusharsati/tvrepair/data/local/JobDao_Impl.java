package com.tusharsati.tvrepair.data.local;

import android.database.Cursor;
import androidx.annotation.NonNull;
import androidx.room.CoroutinesRoom;
import androidx.room.EntityInsertionAdapter;
import androidx.room.RoomDatabase;
import androidx.room.RoomSQLiteQuery;
import androidx.room.SharedSQLiteStatement;
import androidx.room.util.CursorUtil;
import androidx.room.util.DBUtil;
import androidx.sqlite.db.SupportSQLiteStatement;
import java.lang.Class;
import java.lang.Exception;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Callable;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;
import kotlinx.coroutines.flow.Flow;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation"})
public final class JobDao_Impl implements JobDao {
  private final RoomDatabase __db;

  private final EntityInsertionAdapter<JobEntity> __insertionAdapterOfJobEntity;

  private final SharedSQLiteStatement __preparedStmtOfDeleteAll;

  public JobDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertionAdapterOfJobEntity = new EntityInsertionAdapter<JobEntity>(__db) {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `jobs` (`id`,`customerName`,`phoneNumber`,`brand`,`status`,`deliver`,`messageStatus`,`dateReceived`,`jobNumber`) VALUES (?,?,?,?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SupportSQLiteStatement statement,
          @NonNull final JobEntity entity) {
        if (entity.getId() == null) {
          statement.bindNull(1);
        } else {
          statement.bindString(1, entity.getId());
        }
        if (entity.getCustomerName() == null) {
          statement.bindNull(2);
        } else {
          statement.bindString(2, entity.getCustomerName());
        }
        if (entity.getPhoneNumber() == null) {
          statement.bindNull(3);
        } else {
          statement.bindString(3, entity.getPhoneNumber());
        }
        if (entity.getBrand() == null) {
          statement.bindNull(4);
        } else {
          statement.bindString(4, entity.getBrand());
        }
        if (entity.getStatus() == null) {
          statement.bindNull(5);
        } else {
          statement.bindString(5, entity.getStatus());
        }
        if (entity.getDeliver() == null) {
          statement.bindNull(6);
        } else {
          statement.bindString(6, entity.getDeliver());
        }
        if (entity.getMessageStatus() == null) {
          statement.bindNull(7);
        } else {
          statement.bindString(7, entity.getMessageStatus());
        }
        if (entity.getDateReceived() == null) {
          statement.bindNull(8);
        } else {
          statement.bindString(8, entity.getDateReceived());
        }
        if (entity.getJobNumber() == null) {
          statement.bindNull(9);
        } else {
          statement.bindString(9, entity.getJobNumber());
        }
      }
    };
    this.__preparedStmtOfDeleteAll = new SharedSQLiteStatement(__db) {
      @Override
      @NonNull
      public String createQuery() {
        final String _query = "DELETE FROM jobs";
        return _query;
      }
    };
  }

  @Override
  public Object insertAll(final List<JobEntity> jobs,
      final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        __db.beginTransaction();
        try {
          __insertionAdapterOfJobEntity.insert(jobs);
          __db.setTransactionSuccessful();
          return Unit.INSTANCE;
        } finally {
          __db.endTransaction();
        }
      }
    }, $completion);
  }

  @Override
  public Object deleteAll(final Continuation<? super Unit> $completion) {
    return CoroutinesRoom.execute(__db, true, new Callable<Unit>() {
      @Override
      @NonNull
      public Unit call() throws Exception {
        final SupportSQLiteStatement _stmt = __preparedStmtOfDeleteAll.acquire();
        try {
          __db.beginTransaction();
          try {
            _stmt.executeUpdateDelete();
            __db.setTransactionSuccessful();
            return Unit.INSTANCE;
          } finally {
            __db.endTransaction();
          }
        } finally {
          __preparedStmtOfDeleteAll.release(_stmt);
        }
      }
    }, $completion);
  }

  @Override
  public Flow<List<JobEntity>> getAllJobs() {
    final String _sql = "SELECT * FROM jobs";
    final RoomSQLiteQuery _statement = RoomSQLiteQuery.acquire(_sql, 0);
    return CoroutinesRoom.createFlow(__db, false, new String[] {"jobs"}, new Callable<List<JobEntity>>() {
      @Override
      @NonNull
      public List<JobEntity> call() throws Exception {
        final Cursor _cursor = DBUtil.query(__db, _statement, false, null);
        try {
          final int _cursorIndexOfId = CursorUtil.getColumnIndexOrThrow(_cursor, "id");
          final int _cursorIndexOfCustomerName = CursorUtil.getColumnIndexOrThrow(_cursor, "customerName");
          final int _cursorIndexOfPhoneNumber = CursorUtil.getColumnIndexOrThrow(_cursor, "phoneNumber");
          final int _cursorIndexOfBrand = CursorUtil.getColumnIndexOrThrow(_cursor, "brand");
          final int _cursorIndexOfStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "status");
          final int _cursorIndexOfDeliver = CursorUtil.getColumnIndexOrThrow(_cursor, "deliver");
          final int _cursorIndexOfMessageStatus = CursorUtil.getColumnIndexOrThrow(_cursor, "messageStatus");
          final int _cursorIndexOfDateReceived = CursorUtil.getColumnIndexOrThrow(_cursor, "dateReceived");
          final int _cursorIndexOfJobNumber = CursorUtil.getColumnIndexOrThrow(_cursor, "jobNumber");
          final List<JobEntity> _result = new ArrayList<JobEntity>(_cursor.getCount());
          while (_cursor.moveToNext()) {
            final JobEntity _item;
            final String _tmpId;
            if (_cursor.isNull(_cursorIndexOfId)) {
              _tmpId = null;
            } else {
              _tmpId = _cursor.getString(_cursorIndexOfId);
            }
            final String _tmpCustomerName;
            if (_cursor.isNull(_cursorIndexOfCustomerName)) {
              _tmpCustomerName = null;
            } else {
              _tmpCustomerName = _cursor.getString(_cursorIndexOfCustomerName);
            }
            final String _tmpPhoneNumber;
            if (_cursor.isNull(_cursorIndexOfPhoneNumber)) {
              _tmpPhoneNumber = null;
            } else {
              _tmpPhoneNumber = _cursor.getString(_cursorIndexOfPhoneNumber);
            }
            final String _tmpBrand;
            if (_cursor.isNull(_cursorIndexOfBrand)) {
              _tmpBrand = null;
            } else {
              _tmpBrand = _cursor.getString(_cursorIndexOfBrand);
            }
            final String _tmpStatus;
            if (_cursor.isNull(_cursorIndexOfStatus)) {
              _tmpStatus = null;
            } else {
              _tmpStatus = _cursor.getString(_cursorIndexOfStatus);
            }
            final String _tmpDeliver;
            if (_cursor.isNull(_cursorIndexOfDeliver)) {
              _tmpDeliver = null;
            } else {
              _tmpDeliver = _cursor.getString(_cursorIndexOfDeliver);
            }
            final String _tmpMessageStatus;
            if (_cursor.isNull(_cursorIndexOfMessageStatus)) {
              _tmpMessageStatus = null;
            } else {
              _tmpMessageStatus = _cursor.getString(_cursorIndexOfMessageStatus);
            }
            final String _tmpDateReceived;
            if (_cursor.isNull(_cursorIndexOfDateReceived)) {
              _tmpDateReceived = null;
            } else {
              _tmpDateReceived = _cursor.getString(_cursorIndexOfDateReceived);
            }
            final String _tmpJobNumber;
            if (_cursor.isNull(_cursorIndexOfJobNumber)) {
              _tmpJobNumber = null;
            } else {
              _tmpJobNumber = _cursor.getString(_cursorIndexOfJobNumber);
            }
            _item = new JobEntity(_tmpId,_tmpCustomerName,_tmpPhoneNumber,_tmpBrand,_tmpStatus,_tmpDeliver,_tmpMessageStatus,_tmpDateReceived,_tmpJobNumber);
            _result.add(_item);
          }
          return _result;
        } finally {
          _cursor.close();
        }
      }

      @Override
      protected void finalize() {
        _statement.release();
      }
    });
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
