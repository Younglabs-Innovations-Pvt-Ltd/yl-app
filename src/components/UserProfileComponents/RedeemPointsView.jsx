import {View, Text, Pressable} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Input from '../CustomInputComponent';
import {TextInput} from 'react-native-gesture-handler';
import Clipboard from '@react-native-clipboard/clipboard';
import {Showtoast} from '../../utils/toast';
import {useToast} from 'react-native-toast-notifications';

const RedeemPointsView = () => {
  const toast = useToast();
  const {bgColor, textColors, colorYlMain, darkMode} = useSelector(
    state => state.appTheme,
  );

  const referralSteps = [
    {
      step: 1,
      icon: 'share-all-outline',
      label: 'Share your referral code',
      color: '#55D400',
    },
    {
      step: 2,
      icon: 'shopping-outline',
      label: 'Your friend buy course with your code',
      color: '#FFA600',
    },
    {
      step: 3,
      icon: 'piggy-bank-outline',
      label: 'You get 10% points of total spent',
      color: '#9f109f',
    },
  ];

  const copyToClipBoard = string => {
    Clipboard.setString(string);
    Showtoast({text: 'Referrel Code Copied Successfully', toast});
  };
  return (
    <View className="flex-1 px-3 w-full pb-6">
      <Text
        className="text-center font-bold text-2xl capitalize"
        style={{color: textColors.textYlMain}}>
        Refer And Earn
      </Text>

      <Text
        className="text-start mt-2 text-[14px]"
        style={{color: textColors.textSecondary}}>
        Refer Your friend And get YL points valued 10% of total spent by your
        friend
      </Text>

      <View
        className={`flex-1 flex-row justify-between w-full mt-8 p-1 rounded-md ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
        {referralSteps?.map((item, index) => {
          return (
            <>
              <View
                className="w-[25%] items-center justify-start"
                key={index}>
                <View className="w-full items-center justify-center">
                  <MIcon name={item.icon} color={item.color} size={55} />
                </View>

                <View className="w-full">
                  <Text
                    className="text-center font-semibold text-base"
                    style={{color: item.color}}>
                    Step {item.step}
                  </Text>
                  <Text
                    className="text-xs text-center w-full"
                    style={{color: textColors.textSecondary}}>
                    {item.label}
                  </Text>
                </View>
              </View>

              {item.step !== 3 && (
                <View className="w-[8%] " key={Math.random()}>
                  <View className="h-[60%] justify-center">
                    <MIcon name="arrow-right-thin" color={'gray'} size={35} />
                  </View>
                </View>
              )}
            </>
          );
        })}
      </View>

      <View className="w-full flex-1 mt-5">
        <Text
          className="text-[14px] font-semibold"
          style={{color: textColors.textSecondary}}>
          Your Total Earned Points : 960
        </Text>

        <View className="relative w-[100%] border border-gray-300 mt-4 rounded-md p-2 flex-row justify-between px-3 items-center">
          <Text
            className="absolute text-[11px] py-1 px-1 -top-3 left-2"
            style={{backgroundColor: bgColor, color: textColors.textSecondary}}>
            Your Referral Code
          </Text>
          <Text className="text-base" style={{color: textColors.textPrimary}}>
            rfr34kdh
          </Text>
          <MIcon
            name="content-copy"
            color={textColors.textSecondary}
            size={25}
            onPress={() => copyToClipBoard('this is Text')}
          />
        </View>
      </View>

      <View className="w-full justify-around flex-row mt-7">
        <Pressable
          className="flex-row rounded-full w-[45%] py-2 px-3 justify-center items-center mt-3 "
          style={{backgroundColor: textColors.textYlMain}}>
          {/* <MIcon name="whatsapp" size={30} color="white" /> */}
          <Text className="text-base font-semibold" style={{color: 'white'}}>
            Use Points
          </Text>
        </Pressable>
        <Pressable
          className="flex-row rounded-full w-[45%] py-2 px-3 justify-center items-center mt-3 "
          style={{backgroundColor: textColors.textYlGreen}}>
          {/* <MIcon name="whatsapp" size={30} color="white" /> */}
          <Text className="text-base font-semibold" style={{color: 'white'}}>
            Share Referrals
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RedeemPointsView;
