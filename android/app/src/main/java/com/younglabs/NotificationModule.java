package com.younglabs;

import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class NotificationModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    NotificationModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "NotificationModule";
    }

    @ReactMethod
    public void startNotificationTimer(double countdownDurationMillis) {
        long durationInMillis = (long) countdownDurationMillis;

        final boolean isForegroundRunning = foregroundServiceRunning();
        Log.d(this.getName(), String.valueOf(isForegroundRunning));

        if (!foregroundServiceRunning()) {
            Intent serviceIntent = new Intent(this.reactContext, NotificationTimerService.class);
            serviceIntent.putExtra("countdown_time", durationInMillis);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                this.reactContext.startForegroundService(serviceIntent);
            }else {
                this.reactContext.startService(serviceIntent);
            }

        }
    }

    @ReactMethod
    public void stopForegroundService() {
        if (foregroundServiceRunning()) {
            Intent serviceIntent = new Intent(this.reactContext, NotificationTimerService.class);
            this.reactContext.stopService(serviceIntent);
        }
    }

    public boolean foregroundServiceRunning() {
        ActivityManager activityManager = (ActivityManager) this.reactContext.getSystemService(Context.ACTIVITY_SERVICE);
        for (ActivityManager.RunningServiceInfo service: activityManager.getRunningServices(Integer.MAX_VALUE)) {
            if (NotificationTimerService.class.getName().equals(service.service.getClassName())) {
                return true;
            }
        }
        return false;
    }
}

