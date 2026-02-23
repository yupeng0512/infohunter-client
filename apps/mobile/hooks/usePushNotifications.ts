import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerDevice, getAccessToken, setTokenChangeHandler } from '@infohunter/shared';
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
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    registerForPushNotifications().then((token) => {
      if (token) {
        setExpoPushToken(token);
        tokenRef.current = token;
        registerTokenWithBackend(token);
      }
    });

    setTokenChangeHandler((access) => {
      if (access && tokenRef.current) {
        registerTokenWithBackend(tokenRef.current);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(
      (_notification) => {},
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (_response) => {},
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      setTokenChangeHandler(null);
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
