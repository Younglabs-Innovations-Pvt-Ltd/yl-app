import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';
import {SCREEN_NAMES} from './utils/constants/screen-names';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function replace(...props) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(...props));
  }
}

export function resetNavigation(route = 'Welcome', params = {}) {
  if (navigationRef.isReady()) {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: route, params}],
    });
    navigationRef.dispatch(resetAction);
  }
}
