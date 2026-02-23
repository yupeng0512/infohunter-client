import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerDevice, getAccessToken } from '@infohunter/shared';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        registerTokenWithBackend(token);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {
        // 在前台收到通知时的处理逻辑（可扩展）
      },
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (_response) => {
        // 用户点击通知后的处理逻辑（可扩展导航）
      },
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { expoPushToken };
}

async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return tokenData.data;
  } catch {
    return null;
  }
}

async function registerTokenWithBackend(pushToken: string) {
  try {
    if (!getAccessToken()) return;

    const deviceId = `${Platform.OS}-${pushToken.slice(-12)}`;
    await registerDevice({
      device_id: deviceId,
      platform: Platform.OS as 'ios' | 'android',
      push_token: pushToken,
      app_version: Constants.expoConfig?.version ?? '0.3.0',
    });
  } catch {
    // 静默失败，下次启动会重试
  }
}
