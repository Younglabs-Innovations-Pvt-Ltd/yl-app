import {View, Text, Pressable} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import { authSelector } from '../store/auth/selector';


const HeaderComponent = ({navigation, setShowAddChildView}) => {
  const handleShowDrawer = () => navigation.openDrawer();
  const dispatch = useDispatch();
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );

  const {childName , childAge , credits} = useSelector(authSelector);

  const changeDarkMode = payload => {
    console.log('changing dark mode to ', payload);
    dispatch(setDarkMode(payload));
  };



  return (
    <>
      <View
        style={tw`flex flex-row justify-between w-[100%] px-2 py-1 bg-[${bgSecondaryColor}]
          }`}>
        <View className="flex-row items-center">
          <View className="px-2 justify-center">
            {darkMode ? (
              <MIcon
                name="brightness-4"
                color="white"
                size={28}
                onPress={() => changeDarkMode(false)}
              />
            ) : (
              <MIcon
                name="brightness-6"
                color="orange"
                size={28}
                onPress={() => changeDarkMode(true)}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileScreen')}>
            <View style={tw` pr-2 flex-row gap-2 justify-end items-center`}>
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

              <View style={tw`gap-0`}>
                <Text
                  style={tw`${
                    darkMode
                      ? `text-[${textColors.textPrimary}]`
                      : 'text-blue-500'
                  } text-[14px] font-semibold`}>
                  Welcome, {childName}
                </Text>
                <Text
                  style={tw`text-[${textColors.textSecondary}] text-[10px] font-semibold `}>
                  {credits} points
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View>
            <Pressable
              className={`${
                darkMode ? 'bg-gray-500' : 'bg-gray-200'
              } rounded-full p-1`}
              onPress={() => setShowAddChildView(true)}>
              <MIcon name="plus" size={25} color={textColors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={tw`w-[20%]  flex-row gap-2 items-center justify-end`}>
          <MIcon
            name="menu"
            size={30}
            color={textColors.textYlMain}
            onPress={handleShowDrawer}
          />
        </View>
      </View>
    </>
  );
};



export default HeaderComponent;
