import notifee, {TimestampTrigger, TriggerType} from '@notifee/react-native';

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
        pressAction: {
          id: 'countdown',
          launchActivity: 'default',
        },
      },
    },
    trigger,
  );
};
