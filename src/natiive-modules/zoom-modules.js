import {NativeModules} from 'react-native';

const {ZoomManager} = NativeModules;

export const initZoomSdk = () => ZoomManager.initZoomSdk();

export const joinClassOnZoom = (meetingId, meetingPassword, displayName) =>
  ZoomManager.joinClass(meetingId, meetingPassword, displayName);
