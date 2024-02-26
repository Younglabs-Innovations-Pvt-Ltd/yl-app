import notifee, {
  TimestampTrigger,
  TriggerType,
  AndroidImportance,
} from '@notifee/react-native';

const createChannelIdForAndroid = async (name, id) => {
  return await notifee.createChannel({
    id,
    name,
  });
};

export const setCountdownTriggerNotification = async (
  cid,
  cname,
  date,
  body,
) => {
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date,
  };

  const channelId = await createChannelIdForAndroid(cname, cid);

  await notifee.createTriggerNotification(
    {
      title: 'Class Reminder',
      body,
      android: {
        sound: 'default',
        channelId,
        autoCancel: false,
        smallIcon: 'ic_small_icon',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'countdown',
          launchActivity: 'default',
        },
      },
    },
    trigger,
  );
};

// All Trigger notification ids
export const getAllTriggerNotificationIds = async () => {
  return await notifee.getTriggerNotificationIds();
};

// Cancel all notifications
export const cancleNotifications = async () => {
  return await notifee.cancelAllNotifications();
};

// Display Reminder notifications
export const displayReminderNotification = async notification => {
  const groupId = await notifee.createChannelGroup({
    id: 'Reminder',
    name: 'Reminder',
  });

  const remindersChannelId = await notifee.createChannel({
    id: 'reminders',
    name: 'reminders',
    sound: 'default',
    groupId: groupId,
    vibration: true,
  });

  let notificationData = notification;
  notificationData.android.channelId = remindersChannelId;

  await notifee.displayNotification({
    ...notificationData,
  });
};

// Display Remarketing notifications
export const displayRemarketingNotification = async notification => {
  const groupId = await notifee.createChannelGroup({
    id: 'Remarketing',
    name: 'Remarketing',
  });

  const remarketingChannelId = await notifee.createChannel({
    id: 'remarketing',
    name: 'remarketing',
    sound: 'default',
    groupId: groupId,
    vibration: true,
  });

  let notificationData = notification;
  notificationData.android.channelId = remarketingChannelId;

  await notifee.displayNotification({
    ...notificationData,
  });
};

const capitalize = text => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

// Display the notification
export const displayNotification = async (
  notification,
  channelId,
  channelName,
) => {
  const groupId = await notifee.createChannelGroup({
    id: capitalize(channelId),
    name: capitalize(channelName),
  });

  const cId = await notifee.createChannel({
    id: channelId.toLowerCase(),
    name: channelName.toLowerCase(),
    sound: 'default',
    groupId: groupId,
    vibration: true,
  });

  let notificationData = notification;
  notificationData.android.channelId = cId;

  await notifee.displayNotification({
    ...notificationData,
  });
};
