import {NativeModules} from 'react-native';

const {TeamModule} = NativeModules;

/**
 * @author Shobhit
 * @since 20/09/2023
 * @param displayName Display name (child name) to join demo class
 * @param link Team link to join class
 * @param token ACS token
 * @description Register timer notification on notification panel on mobiles
 */
export const startCallComposite = (displayName, link, token) =>
  TeamModule.launch(displayName, link, token);
