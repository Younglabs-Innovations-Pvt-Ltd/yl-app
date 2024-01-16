import React, {useState} from 'react';
import {StyleSheet, View, Pressable, Image} from 'react-native';
import TextWrapper from './text-wrapper.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../utils/constants/colors';
import CustomerSupportActions from './customer-support-actions';
import Icon from './icon.component';
import Share from 'react-native-share';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useSelector} from 'react-redux';

const Icons = (name, focused) => {
  switch (name) {
    case 'Drawer':
      return (
        <Image
          source={require('../assets/images/spinner.png')}
          style={{width: 36, height: 36, objectFit: 'contain'}}
        />
      );
    case 'Account':
      return (
        <MIcon
          name="account-circle"
          size={28}
          color={focused ? COLORS.pblue : '#222'}
        />
      );
    default:
      return;
  }
};

const shareApp = async () => {
  const message =
    'I really liked Younglabs handwriting improvement App. You can try it as well.';
  const url = 'https://play.google.com/store/apps/details?id=com.younglabs';
  try {
    await Share.open({
      title: 'Younglabs',
      message: `${message} \n Download app now: ${url}`,
    });
  } catch (error) {
    console.log(error);
  }
};

function Tabbar({state, descriptors, navigation}) {
  const [currentTab, setCurrentTab] = useState('drawer');
  const [actions, setActions] = useState(false);
  const {bgColor, bgSecondaryColor, textColors, darkMode, colorYlMain} =
    useSelector(state => state.appTheme);

  const ScreenIcon = ({name, focused}) => {
    const icon = Icons(name, focused);
    return icon;
  };

  const handleActions = () => {
    setCurrentTab('contact');
    setActions(true);
  };

  const goOnCourse = () => {
    navigation.navigate(SCREEN_NAMES.COURSE_DETAILS);
  };

  return (
    <>
      {/* <View style={styles.tabbar}> */}
      <View
        className="flex-row justify-center items-center px-2"
        style={{backgroundColor: darkMode ? "#020e21" :"#e6e9f0"}}
        >
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

          if (route.name === 'Course') {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={goOnCourse}
                style={{flex: 1, alignItems: 'center'}}>
                <Icon
                  name="book-outline"
                  size={24}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}
                />
                <TextWrapper
                  fw="600"
                  fs={14}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}>
                  {label}
                </TextWrapper>
              </Pressable>
            );
          }

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
                <MIcon
                  name="headset"
                  size={24}
                  color={isFocused ? COLORS.pblue : textColors.textPrimary}
                />
                <TextWrapper
                  fw="600"
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
                onPress={shareApp}
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
                color={isFocused ? COLORS.pblue : textColors.textPrimary}>
                {label}
              </TextWrapper>
            </Pressable>
          );
        })}
      </View>
      <CustomerSupportActions
        visible={actions}
        onClose={() => setActions(false)}
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
