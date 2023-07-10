package com.younglabs;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import us.zoom.sdk.JoinMeetingOptions;
import us.zoom.sdk.JoinMeetingParams;
import us.zoom.sdk.MeetingError;
import us.zoom.sdk.MeetingParameter;
import us.zoom.sdk.MeetingService;
import us.zoom.sdk.MeetingServiceListener;
import us.zoom.sdk.MeetingStatus;
import us.zoom.sdk.ZoomError;
import us.zoom.sdk.ZoomSDK;
import us.zoom.sdk.ZoomSDKInitParams;
import us.zoom.sdk.ZoomSDKInitializeListener;

public class ZoomManager extends ReactContextBaseJavaModule implements ZoomSDKInitializeListener, MeetingServiceListener {
    private ReactApplicationContext reactContext;

    private Promise initPromise;

    private Promise meetingPromise;

    ZoomManager(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ZoomManager";
    }

    @ReactMethod
    public void initZoomSdk(Promise promise) {
        this.getReactApplicationContext().getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                initPromise = promise;
                ZoomSDK zoomSDK = ZoomSDK.getInstance();

                if (!zoomSDK.isInitialized()) {
                    ZoomSDKInitParams params = new ZoomSDKInitParams();
                    params.jwtToken = AuthConstant.JWT_TOKEN;
                    params.domain = AuthConstant.WEB_DOMAIN;
                    params.enableLog = true;
                    params.enableGenerateDump = true;
                    zoomSDK.initialize(reactContext, ZoomManager.this, params);
                }else {
                    Log.d("ZoomManager", "Zoom Initialized already.");
                }
            }
        });
    }

    @Override
    public void onZoomSDKInitializeResult(int errorCode, int internalErrorCode) {
        Log.d(this.getName(), "errorCode=" + errorCode + " " + "internalErrorCode=" + internalErrorCode );

        if (errorCode == ZoomError.ZOOM_ERROR_SUCCESS) {
            ZoomSDK mZoomSdk = ZoomSDK.getInstance();
            MeetingService meetingService = mZoomSdk.getMeetingService();
            if (meetingService != null) {
                meetingService.addListener(this);
                initPromise.resolve("zoom initialized.");
                Log.d(this.getName(), "Added meeting service listener");
            }
        }
    }

    @ReactMethod
    public void joinClass(String meetingId, String password, String displayName, Promise promise) {
        this.getReactApplicationContext().getCurrentActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {
                ZoomSDK zoomSDK = ZoomSDK.getInstance();
                MeetingService meetingService = zoomSDK.getMeetingService();
                if (meetingService == null) {
                    Log.d("ZoomManager", "Meeting service not available.");
                    promise.resolve("Meeting service not available.");
                }else {
                    JoinMeetingOptions options = new JoinMeetingOptions();
                    JoinMeetingParams params = new JoinMeetingParams();
                    params.displayName = displayName;
                    params.meetingNo = meetingId;
                    params.password = password;

                    int result = meetingService.joinMeetingWithParams(reactContext, params, options);
                    if (result == MeetingError.MEETING_ERROR_SUCCESS) {
                        meetingPromise = promise;
                    }
                }
            }
        });
    }

    @Override
    public void onZoomAuthIdentityExpired() {

    }

    @Override
    public void onMeetingStatusChanged(MeetingStatus meetingStatus, int errorCode, int internalErrorCode) {
        Log.i(this.getName(), "onMeetingStatusChanged, meetingStatus=" + meetingStatus + ", errorCode=" + errorCode
                + ", internalErrorCode=" + internalErrorCode);

        if(meetingStatus == MeetingStatus.MEETING_STATUS_FAILED && errorCode == MeetingError.MEETING_ERROR_CLIENT_INCOMPATIBLE) {
            Log.d(this.getName(), "Version of ZoomSDK is too low!");
        }

        if (meetingStatus == MeetingStatus.MEETING_STATUS_INMEETING) {
            Log.d(this.getName(), "Class joined successfully.");
            meetingPromise.resolve("class joined.");
        }

        if (meetingStatus == MeetingStatus.MEETING_STATUS_DISCONNECTING) {
            Log.d(this.getName(), "Class leaving.");
            meetingPromise.resolve("class leaved.");
        }
    }

    @Override
    public void onMeetingParameterNotification(MeetingParameter meetingParameter) {

    }
}
