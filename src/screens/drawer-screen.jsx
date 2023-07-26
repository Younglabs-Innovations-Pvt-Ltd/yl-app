import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import {View, StyleSheet, useWindowDimensions, Pressable} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

// Screens
import HomeScreen from './home-screen';

import {useDispatch, useSelector} from 'react-redux';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {setToInitialState} from '../store/join-demo/join-demo.reducer';

import TextWrapper from '../components/text-wrapper.component';
import Icon from '../components/icon.component';
import {COLORS} from '../assets/theme/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({navigation, ...props}) => {
  const dispatch = useDispatch();
  const {demoPhoneNumber, demoData} = useSelector(joinDemoSelector);
  const windowDimensions = useWindowDimensions();

  useEffect(() => {
    if (!demoData && !demoPhoneNumber) {
      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{name: 'Welcome'}],
      });

      console.log('hit');
      navigation.dispatch(resetAction);
    }
  }, [demoData, demoPhoneNumber]);

  const handleChangeNumber = async () => {
    try {
      await AsyncStorage.removeItem('phone');
      await AsyncStorage.removeItem('countdown_notification');
      dispatch(setToInitialState());
    } catch (error) {
      console.log('CHANGE_NUMBER_ERROR', error);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={[
          styles.parentContainer,
          {height: windowDimensions.height - 94},
        ]}>
        <View style={{flex: 2}}>
          <View style={{padding: 12}}>
            <TextWrapper fs={28}>Welcome guest</TextWrapper>
            <TextWrapper>{demoPhoneNumber}</TextWrapper>
          </View>
        </View>
        <View style={{flex: 0.5, justifyContent: 'flex-end'}}>
          <Pressable
            style={({pressed}) => [
              styles.btnChangeNumber,
              {backgroundColor: pressed ? '#eee' : 'transparent'},
            ]}
            onPress={handleChangeNumber}>
            <TextWrapper>Change number</TextWrapper>
            <Icon name="log-out-outline" size={24} color={COLORS.black} />
          </Pressable>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerScreen = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
        headerShown: false,
        drawerType: 'front',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  btnChangeNumber: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 4,
  },
});
