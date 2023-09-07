package com.younglabs;


import android.content.Context;

import androidx.lifecycle.ViewModel;

import com.azure.android.communication.common.CommunicationTokenCredential;
import com.azure.android.communication.common.CommunicationTokenRefreshOptions;
import com.azure.android.communication.ui.calling.CallComposite;
import com.azure.android.communication.ui.calling.CallCompositeBuilder;
import com.azure.android.communication.ui.calling.models.CallCompositeCallHistoryRecord;
import com.azure.android.communication.ui.calling.models.CallCompositeGroupCallLocator;
import com.azure.android.communication.ui.calling.models.CallCompositeJoinLocator;
import com.azure.android.communication.ui.calling.models.CallCompositeRemoteOptions;
import com.azure.android.communication.ui.calling.models.CallCompositeTeamsMeetingLinkLocator;

import java.util.List;
import java.util.UUID;

public class CallLauncherViewModel extends ViewModel {

    public void launch(
            Context context,
            String acsToken,
            String displayName,
            UUID groupId,
            String meetingLink
    ) {
        CallComposite callComposite = createCallComposite(context);
        callComposite.addOnErrorEventHandler(new CallLauncherActivityErrorHandler(context, callComposite));

        CommunicationTokenRefreshOptions communicationTokenRefreshOptions =
                new CommunicationTokenRefreshOptions(() -> acsToken, true);
        CommunicationTokenCredential communicationTokenCredential =
                new CommunicationTokenCredential(communicationTokenRefreshOptions);

        CallCompositeJoinLocator locator;
        if (groupId != null) {
            locator = new CallCompositeGroupCallLocator(groupId);
        } else {
            locator = new CallCompositeTeamsMeetingLinkLocator(meetingLink);
        }

        CallCompositeRemoteOptions remoteOptions =
                new CallCompositeRemoteOptions(locator, communicationTokenCredential, displayName);

        callComposite.launch(context, remoteOptions, null);
    }

    public List<CallCompositeCallHistoryRecord> getCallHistory(Context context) {
        return (callComposite != null) ? callComposite.getDebugInfo(context).getCallHistoryRecords() : null;
    }

    private CallComposite createCallComposite(Context context) {
        CallCompositeBuilder callCompositeBuilder = new CallCompositeBuilder();
        CallComposite callComposite = callCompositeBuilder.build();

        // For test purposes, we will keep a static reference to CallComposite
        CallLauncherViewModel.callComposite = callComposite;
        return callComposite;
    }

    public static CallComposite callComposite;
}