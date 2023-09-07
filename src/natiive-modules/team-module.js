import {NativeModules} from 'react-native';

const {TeamModule} = NativeModules;

export const startCallComposite = (displayName, link, token) =>
  TeamModule.launch(displayName, link, token);
