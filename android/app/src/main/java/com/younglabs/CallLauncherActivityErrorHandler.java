package com.younglabs;

import android.app.Activity;
import android.content.Context;

import androidx.appcompat.app.AlertDialog;

import com.azure.android.communication.ui.calling.CallComposite;
import com.azure.android.communication.ui.calling.CallCompositeEventHandler;
import com.azure.android.communication.ui.calling.models.CallCompositeDebugInfo;
import com.azure.android.communication.ui.calling.models.CallCompositeErrorEvent;

import java.lang.ref.WeakReference;

public class CallLauncherActivityErrorHandler implements CallCompositeEventHandler<CallCompositeErrorEvent> {

    private WeakReference<Context> activityWr;
    private CallComposite callComposite;

    public CallLauncherActivityErrorHandler(Context context, CallComposite callComposite) {
        this.activityWr = new WeakReference<>(context);
        this.callComposite = callComposite;
    }

    @Override
    public void handle(CallCompositeErrorEvent event) {
        Context context = activityWr.get();
        if (context != null) {
            CallCompositeDebugInfo debugInfo = callComposite.getDebugInfo(context);
            String lastCallId = null;
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.N) {
                lastCallId = debugInfo.getCallHistoryRecords()
                        .stream()
                        .reduce((first, second) -> second)
                        .map(record -> record.getCallIds().get(record.getCallIds().size() - 1))
                        .orElse("");
            }

            System.out.println("================= application is logging exception =================");
            System.out.println("call id: " + lastCallId);
            System.out.println(event.getErrorCode());
            System.out.println(event.getErrorCode());

            Activity activity = (Activity) context;
            String finalLastCallId = lastCallId;
            activity.runOnUiThread(() -> {
                AlertDialog.Builder builder = new AlertDialog.Builder(context);
                builder.setMessage(event.getErrorCode() + " " + event.getErrorCode() + ". Call id: " + finalLastCallId);
                builder.setTitle("Alert");
                builder.setPositiveButton("OK", (dialog, which) -> {});
                builder.show();
            });

            System.out.println("====================================================================");
        }
    }
}