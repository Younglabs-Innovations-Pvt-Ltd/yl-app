import React from 'react';
import {View, Text, Pressable, Dimensions, ImageBackground} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import {ScrollView} from 'react-native-gesture-handler';
import RedeemPointsView from '../components/UserProfileComponents/RedeemPointsView';
import {authSelector} from '../store/auth/selector';
import {userSelector} from '../store/user/selector';
import {logout} from '../store/auth/reducer';
import {FONTS} from '../utils/constants/fonts';
import {localStorage} from '../utils/storage/storage-provider';
import {CommonActions} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const UserProfile = ({navigation}) => {
  const {currentChild} = useSelector(userSelector);
  const {user} = useSelector(authSelector);
  const {customer} = useSelector(authSelector);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();

  const changeDarkMode = payload => {
    localStorage.set('darkModeEnabled', payload);
    dispatch(setDarkMode(payload));
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
                Dark mode
              </Text>
              <MIcon
                name="brightness-4"
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
                Light mode
              </Text>
              <MIcon
                name="brightness-6"
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
            const resetAction = CommonActions.reset({
              index: 0,
              routes: [{name: 'Welcome'}],
            });

            navigation.dispatch(resetAction);
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
            <View
              className="w-full p-1 rounded-md mt-4 flex-row"
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
                    style={[{flex: 1, resizeMode: 'cover'}]}></ImageBackground>
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
                      Student Name:
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
                      Student Age:
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

            <View className="w-full items-center mt-4">
              <View
                className="w-[100%] p-2 rounded"
                style={{backgroundColor: bgSecondaryColor}}>
                <View className="flex-row items-center">
                  <Text
                    className="text-[15px] font-semibold"
                    style={{color: textColors.textYlOrange}}>
                    Earned Credits:
                  </Text>
                  <Text
                    className="text-16px ml-2"
                    style={{color: textColors.textYlOrange}}>
                    {user?.credits}
                  </Text>
                </View>
              </View>
            </View>

            <RedeemPointsView />
          </ScrollView>
        </>
      ) : (
        <NotACustomerProfilePage />
      )}
    </>
  );
};

const NotACustomerProfilePage = () => {
  const {bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const {user} = useSelector(authSelector);
  const {currentChild} = useSelector(userSelector);

  return (
    <>
      <View className="flex-1 items-center" style={{backgroundColor: bgColor}}>
        <View
          className="w-[95%] px-2 py-5 mt-3 rounded-md flex-row justify-between"
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
      </View>
    </>
  );
};

export default UserProfile;
