import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable, Image} from 'react-native';
import TextWrapper from './text-wrapper.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/constants/colors';
import CustomerSupportActions from './customer-support-actions';
import Icon from './icon.component';
import Share from 'react-native-share';
import {useSelector} from 'react-redux';
import {FONTS} from '../utils/constants/fonts';
import {authSelector} from '../store/auth/selector';
import BottomSheetComponent from './BottomSheetComponent';
import CustomerSupportFeature from './CourseLevelScreenComponent/features/customer-support-feature';

const shareApp = async (customer, referralCode) => {
  console.log('in tababr comp', referralCode, customer);

  let message;
  if (customer === 'yes') {
    message = `I really liked Younglabs courses for my child.\n\nAdding you as a referral. You will get 15% off on Younglabs courses when you buy on their app Or website using the code: ${referralCode}\n\nWebsite: www.younglabs.in`;
  } else {
    message = `I really liked Younglabs handwriting improvement App. You can try it as well.`;
  }
  const url = 'https://play.google.com/store/apps/details?id=com.younglabs';
  try {
    await Share.open({
      title: 'Younglabs',
      message: `${message} \nDownload app now: ${url}`,
    });
  } catch (error) {
    console.log(error);
  }
};

function Tabbar({state, descriptors, navigation}) {
  const [currentTab, setCurrentTab] = useState('drawer');
  const [actions, setActions] = useState(false);
  const [visible, setVisible] = useState(false);
  const {textColors, darkMode, colorYlMain} = useSelector(
    state => state.appTheme,
  );

  const {user, customer} = useSelector(authSelector);

  const Icons = (name, focused) => {
    switch (name) {
      case 'Drawer':
        return (
          <Image
            source={require('../assets/images/spinner.png')}
            style={{width: 28, height: 28, objectFit: 'contain'}}
          />
        );
      case 'Account':
        return (
          <MIcon
            name="account"
            size={26}
            color={focused ? COLORS.pblue : textColors.textPrimary}
          />
        );
      case 'Course':
        return (
          <Icon
            name="book-outline"
            size={26}
            color={focused ? COLORS.pblue : textColors.textPrimary}
          />
        );
      default:
        return;
    }
  };

  useEffect(() => {
    const currentRoute = state.routes[state.index];
    setCurrentTab(currentRoute.name.toLowerCase());
  }, [state]);

  const ScreenIcon = ({name, focused}) => {
    const icon = Icons(name, focused);
    return icon;
  };

  const handleActions = () => {
    setCurrentTab('contact');

    if (customer === 'no') {
      setActions(true);
    } else {
      setVisible(true);
    }
  };

  const redirectToLastTab = () => {
    const lastRoute = state.history.reverse()[0];
    const route = state.routes.find(r => r.key === lastRoute.key);
    navigation.navigate(route.name);
  };

  const closeActions = () => {
    setActions(false);
    redirectToLastTab();
  };

  const onCloseBottomSheet = () => {
    redirectToLastTab();
    setVisible(false);
  };

  return (
    <>
      {/* <View style={styles.tabbar}> */}
      <View
        className="flex-row justify-center items-center px-2 py-1"
        style={{backgroundColor: darkMode ? '#020e21' : '#e6e9f0'}}>
        {state.routes.map(route => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          // const isFocused = state.index === index;
          const isFocused = currentTab === route.name.toLowerCase();

          const onPress = name => {
            setCurrentTab(name.toLowerCase());
            navigation.navigate(name);
          };

          if (route.name === 'Contact') {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={handleActions}
                style={{flex: 1, alignItems: 'center'}}>
                {isFocused && (
                  <View
                    className="w-[70%] top-0 right-0 p-[2px] rounded-full"
                    style={{backgroundColor: colorYlMain}}></View>
                )}
                <MIcon
                  name="headset"
                  size={24}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}
                />
                <TextWrapper
                  // fw="600"
                  ff={FONTS.headingFont}
                  fs={14}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}>
                  {label}
                </TextWrapper>
              </Pressable>
            );
          }

          if (route.name === 'Share') {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={() => shareApp(customer, user?.referralCode)}
                style={{flex: 1, alignItems: 'center'}}>
                <Icon
                  key={route.key}
                  name="share-social-outline"
                  size={24}
                  color={textColors.textPrimary}
                />
                <TextWrapper
                  fw="600"
                  fs={14}
                  ff={FONTS.headingFont}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}>
                  {label}
                </TextWrapper>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={() => onPress(route.name)}
              style={{flex: 1, alignItems: 'center'}}
              className={`relative`}>
              {isFocused && (
                <View
                  className="w-[70%] top-0 right-0 p-[2px] rounded-full"
                  style={{backgroundColor: colorYlMain}}></View>
              )}
              <ScreenIcon name={route.name} focused={isFocused} />
              <TextWrapper
                fw="600"
                fs={14}
                ff={FONTS.headingFont}
                color={isFocused ? COLORS.pblue : textColors.textPrimary}>
                {label}
              </TextWrapper>
            </Pressable>
          );
        })}
      </View>
      <CustomerSupportActions visible={actions} onClose={closeActions} />
      <BottomSheetComponent
        isOpen={visible}
        Children={
          <CustomerSupportFeature
            setSheetOpen={setVisible}
            source="userProfile"
          />
        }
        onClose={onCloseBottomSheet}
        snapPoint={['40%', '55%']}
      />
    </>
  );
}

export default Tabbar;

const styles = StyleSheet.create({
  tabbar: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
