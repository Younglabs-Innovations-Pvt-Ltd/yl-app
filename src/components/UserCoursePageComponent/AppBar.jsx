import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../../store/app-theme/appThemeReducer';
import {ActivityIndicator, Image, Pressable, StyleSheet, Switch} from 'react-native';
import {Text, View} from 'react-native-animatable';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {authSelector} from '../../store/auth/selector';
import {FONTS} from '../../utils/constants/fonts';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {userSelector} from '../../store/user/selector';
import Snackbar from 'react-native-snackbar';
import {COLORS} from '../../utils/constants/colors';
import {navigate} from '../../navigationRef';
import {bookDemoSelector} from '../../store/book-demo/book-demo.selector';

const AppBar = ({
  bgSecondaryColor,
  darkMode,
  textColors,
  userName,
  changeChildsheetOpen,
  navigation,
}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const {userFetchLoading, userFetchFailed} = useSelector(authSelector);
  const dispatch = useDispatch();
  const {currentChild, children} = useSelector(userSelector);
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    dispatch(setDarkMode(!isSwitchOn));
  };
  const {ipData} = useSelector(bookDemoSelector);
  const styles = StyleSheet.create({
    myView: {
      backgroundColor: textColors?.textYlMain,
      padding: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 10,
    },
  });

  const childSheetOpenClick = () => {
    if (!children || children?.length === 0) {
      Snackbar.show({
        text: 'Please Add Child',
        textColor: COLORS.white,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'Add One',
          textColor: COLORS.white,
          onPress: () => navigation.navigate('MainWelcomeScreen'),
        },
      });
      return;
    }
    changeChildsheetOpen();
  };

  return (
    <View
      style={styles.myView}
      className="flex w-[100%] py-2 px-3 flex-row justify-between items-center">
      <View>
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
          <View className="pr-2 flex-row justify-end items-center">
            {/* <View
              style={[
                {
                  borderRadius: 50,
                  padding: 4,
                  backgroundColor: textColors.textYlMain,
                },
              ]}>
              <MIcon name="account" size={25} color="white" />
            </View> */}
            {ipData && (
              <Image
                source={{uri: ipData.country_flag}}
                style={{
                  width: 25,
                  height: 25,
                  borderRadius: 20,
                  marginRight: 2,
                }}
              />
            )}

            <View>
              <Text
                style={[
                  {
                    color: 'white',
                    fontFamily: FONTS.headingFont,
                  },
                ]}
                className={`font-semibold text-white text-base ml-1`}>
                Welcome{' '}
                {currentChild?.name && currentChild?.name?.length > 10
                  ? currentChild?.name.slice(0, 8) + '..'
                  : currentChild?.name || 'to Younglabs'}
              </Text>
            </View>
          </View>
        )}
      </View>

      <Pressable
        className={` flex-row items-center justify-center rounded-full py-1 px-[6px]`}
        onPress={childSheetOpenClick}
        style={{backgroundColor: COLORS.white}}>
        <MIcon name="account-switch" size={20} color={COLORS.black} />
        <Text
          className="text-xs"
          style={{
            fontFamily: FONTS.primaryFont,
            color: COLORS.black,
          }}>
          Select child
        </Text>
      </Pressable>

      {/* <Text
        style={{
          color: textColors?.textPrimary,
        }}
        className="font-semibold text-[20px] text-black">
        My Courses
      </Text> */}
    </View>
  );
};

export default AppBar;
