export const mongoSt = Object.freeze({
  CONNECTED: 'Connected',
  FAIL: '!Fail',
  CONNECTING: 'Connecting...',
  OFF: 'Off',
});

export const sysStatus = {
  api_status: 'Running',
  mongodb_status: mongoSt.OFF,
};
