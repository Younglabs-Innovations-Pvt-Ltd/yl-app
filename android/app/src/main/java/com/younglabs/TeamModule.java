package com.younglabs;

import androidx.annotation.NonNull;
import androidx.lifecycle.ViewModelProvider;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.UUID;

public class TeamModule extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    private CallLauncherViewModel callLauncherViewModel;
    TeamModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        callLauncherViewModel = new ViewModelProvider(new ViewModelStoreOwner()).get(CallLauncherViewModel.class);
    }

    @ReactMethod
    public void launch(String displayName, String link, String token) {
        UUID groupId = null;
        callLauncherViewModel.launch(getCurrentActivity(), token, displayName, groupId, link);
    }

    @NonNull
    @Override
    public String getName() {
        return "TeamModule";
    }
}
