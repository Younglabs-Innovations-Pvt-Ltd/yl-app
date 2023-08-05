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
      title: 'Younglabs',
      body,
      android: {
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

export const getAllTriggerNotificationIds = async () => {
  return await notifee.getTriggerNotificationIds();
};

export const cancleNotifications = async () => {
  return await notifee.cancelAllNotifications();
};
