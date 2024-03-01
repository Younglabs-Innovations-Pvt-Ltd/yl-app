import React, {useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Dimensions,
  ImageBackground,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import {ScrollView} from 'react-native-gesture-handler';
import {authSelector} from '../store/auth/selector';
import {userSelector} from '../store/user/selector';
import {logout} from '../store/auth/reducer';
import {FONTS} from '../utils/constants/fonts';
import TextWrapper from '../components/text-wrapper.component';
import {navigate} from '../navigationRef';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import GiftBoxIcon from '../assets/icons/giftbox.png';
import {COLORS} from '../utils/constants/colors';
import Spacer from '../components/spacer.component';
import Icon from '../components/icon.component';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {redirectToCourse} from '../utils/redirectToCourse';
import SocialMediaIconsTray from '../components/social-media-icon-tray';

const {width, height} = Dimensions.get('window');

const WEBSITE_URL = 'https://www.younglabs.in/';

const UserProfile = ({navigation}) => {
  const {currentChild} = useSelector(userSelector);
  const {user, customer} = useSelector(authSelector);
  const {courses} = useSelector(welcomeScreenSelector);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();

  const changeDarkMode = payload => {
    dispatch(setDarkMode(payload));
  };

  const goToReferral = () => {
    navigate(SCREEN_NAMES.REFERRAL, {referralCode: user?.referralCode});
  };

  const goToMyCoures = () => {
    navigation.navigate('Course');
  };

  const redirectToWebsite = async () => {
    try {
      await Linking.openURL(WEBSITE_URL);
    } catch (error) {
      console.log('OPEN_ABOUT_US_URL_ERROR', error);
    }
  };

  const redirectToBookFreeClass = () => {
    redirectToCourse({
      navigate: navigation.navigate,
      courseId: 'Eng_Hw',
      courses,
      subScreen: 'bookFreeClass',
    });
  };

  const goToMyTickets = () => {
    navigate(SCREEN_NAMES.MYTICKETS);
  };

  return (
    <>
      <View
        className="justify-end w-full py-2 px-4 flex-row"
        style={{backgroundColor: bgColor}}>
        <View className="px-2 justify-center">
          {darkMode ? (
            <Pressable
              onPress={() => changeDarkMode(false)}
              className="flex-row items-center py-1 px-3 border rounded-full border-gray-300">
              <Text
                className="text-xs mr-1"
                style={{
                  fontFamily: FONTS.primaryFont,
                  color: textColors.textSecondary,
                }}>
                Switch to light mode
              </Text>
              <MIcon
                name="brightness-6"
                color="white"
                size={20}
                onPress={() => changeDarkMode(true)}
              />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => changeDarkMode(true)}
              className="flex-row items-center py-1 px-3 border rounded-full border-gray-300">
              <Text
                className="text-xs mr-1"
                style={{
                  fontFamily: FONTS.primaryFont,
                  color: textColors.textSecondary,
                }}>
                Switch to dark mode
              </Text>
              <MIcon
                name="brightness-4"
                color="orange"
                size={20}
                onPress={() => changeDarkMode(true)}
              />
            </Pressable>
          )}
        </View>

        <Pressable
          className="flex-row items-center px-3 py-1  border rounded-full"
          style={{borderColor: textColors?.textYlMain}}
          onPress={() => {
            dispatch(logout());
          }}>
          <MIcon name="logout" size={20} color={textColors.textYlMain} />
          <Text className="text-[14px]" style={{color: textColors?.textYlMain}}>
            Signout
          </Text>
        </Pressable>
      </View>

      {customer === 'yes' ? (
        <>
          <ScrollView
            className="flex-1 px-2"
            style={{backgroundColor: bgColor}}>
            {currentChild && (
              <View
                className="w-full p-1 rounded-md mt-2 flex-row"
                style={{backgroundColor: bgSecondaryColor, height: height / 5}}>
                <View className="w-[35%] h-full items-center justify-center flex-col">
                  <View
                    className="h-[72%] w-[85%] bg-gray-400 overflow-hidden"
                    style={{borderRadius: 100}}>
                    <ImageBackground
                      source={{
                        uri: 'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
                      }}
                      className="w-[100%] rounded h-full justify-center items-center"
                      style={[
                        {flex: 1, resizeMode: 'cover'},
                      ]}></ImageBackground>
                  </View>
                </View>

                <View className="w-[65%] h-full p-2 px-2 items-start justify-center">
                  <View className="w-full">
                    <View className="w-full flex-row">
                      <Text
                        className="text-base font-semibold"
                        style={{color: textColors.textYlMain}}>
                        Parent Name:
                      </Text>
                      <Text
                        className="className text-base flex-wrap ml-1 capitalize"
                        style={{color: textColors.textSecondary}}>
                        {user?.fullName || 'Unknown'}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full">
                    <View className="w-full flex-row">
                      <Text
                        className="text-base font-semibold"
                        style={{color: textColors.textYlMain}}>
                        Child Name:
                      </Text>
                      <Text
                        className="className text-base flex-wrap ml-1 capitalize"
                        style={{color: textColors.textSecondary}}>
                        {currentChild?.name}
                      </Text>
                    </View>
                  </View>

                  <View className="w-full">
                    <View className="w-full flex-row">
                      <Text
                        className="text-base font-semibold"
                        style={{color: textColors.textYlMain}}>
                        Child Age:
                      </Text>
                      <Text
                        className="className text-base flex-wrap ml-1 capitalize"
                        style={{color: textColors.textSecondary}}>
                        {currentChild?.age}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={{marginTop: 16}}>
              <View
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 14,
                  borderRadius: 8,
                  backgroundColor: bgSecondaryColor,
                }}>
                <View style={{flex: 1, flexDirection: 'row', gap: 8}}>
                  <View style={{flex: 1}}>
                    <TextWrapper
                      fs={20}
                      color={textColors.textPrimary}
                      ff={FONTS.headingFont}>
                      Refer and earn credits
                    </TextWrapper>
                    <TextWrapper
                      fs={15}
                      color={textColors.textSecondary}
                      styles={{lineHeight: 22}}
                      ff={FONTS.primaryFont}>
                      Invite your friends to join Younglabs courses and earn
                      credits
                    </TextWrapper>
                    <Spacer space={4} />
                    <Pressable
                      style={({pressed}) => [
                        styles.btnRefer,
                        {opacity: pressed ? 0.8 : 1},
                      ]}
                      onPress={goToReferral}>
                      <TextWrapper color={COLORS.white} ff={FONTS.primaryFont}>
                        Refer
                      </TextWrapper>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={GiftBoxIcon} style={styles.giftBoxIcon} />
                    {user?.credits && (
                      <React.Fragment>
                        <Text
                          style={{
                            color: textColors.textSecondary,
                            marginTop: 4,
                            fontSize: 12.5,
                          }}
                          className={`text-[10px] font-semibold `}>
                          Earned credits
                        </Text>
                        <Text
                          style={{
                            color: COLORS.pblue,
                            fontWeight: 'bold',
                            fontSize: 20,
                          }}
                          className={`text-[10px] font-semibold `}>
                          {user?.credits}
                        </Text>
                      </React.Fragment>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <Spacer space={6} />
            <Pressable
              style={({pressed}) => [
                styles.btnActions,
                {backgroundColor: pressed ? '#f5f5f5' : 'transparent'},
              ]}
              onPress={goToMyCoures}>
              <Icon
                name="book-outline"
                size={26}
                color={textColors.textSecondary}
              />
              <TextWrapper
                color={textColors.textSecondary}
                ff={FONTS.primaryFont}>
                My courses
              </TextWrapper>
            </Pressable>
            <Pressable
              style={({pressed}) => [
                styles.btnActions,
                {backgroundColor: pressed ? '#f5f5f5' : 'transparent'},
              ]}
              onPress={goToMyTickets}>
              <Icon
                name="ticket-outline"
                size={26}
                color={textColors.textSecondary}
              />
              <TextWrapper
                color={textColors.textSecondary}
                ff={FONTS.primaryFont}>
                My Tickets
              </TextWrapper>
            </Pressable>
            <CommonActions
              textColors={textColors}
              redirectToWebsite={redirectToWebsite}
              redirectToBookFreeClass={redirectToBookFreeClass}
            />
          </ScrollView>
        </>
      ) : (
        <NotACustomerProfilePage
          redirectToWebsite={redirectToWebsite}
          redirectToBookFreeClass={redirectToBookFreeClass}
        />
      )}
    </>
  );
};

const CommonActions = ({
  textColors,
  redirectToWebsite,
  redirectToBookFreeClass,
}) => {
  return (
    <React.Fragment>
      <Pressable
        style={({pressed}) => [
          styles.btnActions,
          {backgroundColor: pressed ? '#f5f5f5' : 'transparent'},
        ]}
        onPress={redirectToWebsite}>
        <MIcon name="web" size={24} color={textColors.textSecondary} />
        <TextWrapper color={textColors.textSecondary} ff={FONTS.primaryFont}>
          Visit website
        </TextWrapper>
      </Pressable>
      <Pressable
        style={({pressed}) => [
          styles.btnActions,
          {backgroundColor: pressed ? '#f5f5f5' : 'transparent'},
        ]}
        onPress={redirectToBookFreeClass}>
        <MIcon name="pencil" size={24} color={textColors.textSecondary} />
        <TextWrapper color={textColors.textSecondary} ff={FONTS.primaryFont}>
          Book free handwriting class
        </TextWrapper>
      </Pressable>
      <SocialMediaIconsTray />
    </React.Fragment>
  );
};

const NotACustomerProfilePage = ({
  redirectToWebsite,
  redirectToBookFreeClass,
}) => {
  const {bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const {user} = useSelector(authSelector);
  const {currentChild} = useSelector(userSelector);

  return (
    <>
      <View className="flex-1 px-2" style={{backgroundColor: bgColor}}>
        {currentChild && (
          <View
            className="px-2 py-5 rounded-md flex-row justify-between"
            style={{backgroundColor: bgSecondaryColor}}>
            <View className="w-[35%] items-center justify-center">
              <View className="h-[110px] w-[110px] rounded-full bg-white justify-center items-center overflow-hidden">
                <Text
                  className="text-6xl font-semibold"
                  style={{color: textColors.textYlMain}}>
                  {currentChild?.name?.charAt(0)}
                </Text>
              </View>
            </View>
            <View className="w-[60%] items-start justify-center">
              <View className="w-full flex-row">
                <Text
                  className="font-semibold"
                  style={{color: textColors.textSecondary}}>
                  Name :
                </Text>
                <Text
                  className="capitalize ml-[2px]"
                  style={{color: textColors.textYlMain}}>
                  {currentChild?.name || 'not set'}
                </Text>
              </View>
              <View className="w-full flex-row mt-1">
                <Text
                  className="font-semibold"
                  style={{color: textColors.textSecondary}}>
                  Age :
                </Text>
                <Text
                  className="capitalize ml-[2px]"
                  style={{color: textColors.textYlMain}}>
                  {currentChild?.age || user?.childAge}
                </Text>
              </View>
              <View className="w-full flex-row mt-1">
                <Text
                  className="font-semibold"
                  style={{color: textColors.textSecondary}}>
                  Parent Name :
                </Text>
                <Text
                  className="capitalize ml-[2px]"
                  style={{color: textColors.textYlMain}}>
                  {user?.fullName}
                </Text>
              </View>
            </View>
          </View>
        )}
        <Spacer />
        <CommonActions
          textColors={textColors}
          redirectToWebsite={redirectToWebsite}
          redirectToBookFreeClass={redirectToBookFreeClass}
        />
      </View>
    </>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  giftBoxIcon: {
    width: 58,
    height: 58,
  },
  btnRefer: {
    width: 120,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: COLORS.pblue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnActions: {
    paddingLeft: 6,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 6,
  },
});
