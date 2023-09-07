package com.younglabs;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

public class AppVersionModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;

    AppVersionModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AppVersionModule";
    }

    @ReactMethod
    public void getCurrentVersion(Callback callback){
        int versionCode = BuildConfig.VERSION_CODE;
        String versionName = BuildConfig.VERSION_NAME;

        WritableMap data = Arguments.createMap();
        data.putString("versionName", versionName);
        data.putInt("versionCode", versionCode);
        callback.invoke(data);
    }
}
