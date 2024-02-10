import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../../store/app-theme/appThemeReducer';
import {ActivityIndicator, StyleSheet, Switch} from 'react-native';
import {Text, View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {authSelector} from '../../store/auth/selector';
import {FONTS} from '../../utils/constants/fonts';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {userSelector} from '../../store/user/selector';

const AppBar = ({bgSecondaryColor, darkMode, textColors, userName , changeChildsheetOpen}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const {userFetchLoading, userFetchFailed} = useSelector(authSelector);
  const dispatch = useDispatch();
  const {currentChild} = useSelector(userSelector);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    dispatch(setDarkMode(!isSwitchOn));
  };
  const styles = StyleSheet.create({
    myView: {
      backgroundColor: darkMode ? bgSecondaryColor : 'white',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 10,
    },
  });

  return (
    <View
      style={styles.myView}
      className="flex w-[100%]  h-[60px] px-3 flex-row justify-between items-center">
      <TouchableOpacity onPress={changeChildsheetOpen}>
        {userFetchLoading ? (
          <ActivityIndicator />
        ) : userFetchFailed ? (
          <View>
            <Text
              className="text-[12px]"
              style={{
                color: textColors.textSecondary,
                fontFamily: FONTS.primaryFont,
              }}>
              Error in Fetcing Data
            </Text>
            <Text
              className="text-[10px]"
              style={{
                color: textColors.textYlMain,
                fontFamily: FONTS.primaryFont,
              }}>
              Try Again
            </Text>
          </View>
        ) : (
          <View className="pr-2 flex-row gap-2 justify-end items-center">
            <View
              style={[
                {
                  borderRadius: 50,
                  padding: 4,
                  backgroundColor: textColors.textYlMain,
                },
              ]}>
              <MIcon name="account" size={25} color="white" />
            </View>

            <View>
              <Text
                style={[
                  {
                    color: darkMode ? textColors.textSecondary : '#448BD6',
                    fontFamily: FONTS.headingFont,
                  },
                ]}
                className={`font-semibold`}>
                Welcome, {currentChild?.name || 'To Younglabs'}
              </Text>

              <Text
                style={{
                  color: darkMode ? textColors.textSecondary : '#448BD6',
                }}
                className={`text-[10px] font-semibold `}>
                {} points
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>

      <Text
        style={{
          color: textColors?.textPrimary,
        }}
        className="font-semibold text-[20px] text-black">
        My Course
      </Text>
    </View>
  );
};

export default AppBar;
