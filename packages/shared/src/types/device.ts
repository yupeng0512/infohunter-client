export interface DeviceRegistration {
  device_id: string;
  platform: 'ios' | 'android';
  push_token: string;
  app_version?: string;
}

export interface DeviceResponse {
  device_id: string;
  platform: string;
  push_token: string;
}

export interface DeviceListResponse {
  devices: DeviceResponse[];
  total: number;
}
