import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
} from '@react-navigation/native';

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

export function resetNavigation() {
  if (navigationRef.isReady()) {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{name: 'Welcome'}],
    });
    navigationRef.dispatch(resetAction);
  }
}
