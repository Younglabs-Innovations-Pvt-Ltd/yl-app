import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import {Showtoast} from '../../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import Share from 'react-native-share';
import {authSelector} from '../../store/auth/selector';
import {fetchReferralCode} from '../../store/auth/reducer';

const RedeemPointsView = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const {bgColor, textColors, darkMode} = useSelector(state => state.appTheme);
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
  const [refreshReferralCode, setRefreshReferralCode] = useState({});

  const {user, referralCode, referralCodeGenerationFailed} =
    useSelector(authSelector);

  useEffect(() => {
    if (user?.leadId) {
      dispatch(fetchReferralCode({leadId: user?.leadId}));
    }
  }, [user, refreshReferralCode]);

  const copyToClipBoard = string => {
    Clipboard.setString(string);
    Showtoast({
      text: 'Referrel Code Copied Successfully',
      toast,
      type: 'success',
    });
  };

  const shareToFriends = async () => {
    const message =
      'I Found Younglabs Handwriting and Learning Courses Usefull';
    try {
      await Share.open({
        title: 'Younglabs',
        message: `${message} use my referral code ${referralCode} `,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 px-3 w-full mt-6">
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
        className={`flex-1 flex-row justify-between w-full mt-4 p-1 rounded-md ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
        {referralSteps?.map((item, index) => {
          return (
            <>
              <View className="w-[25%] items-center justify-start" key={index}>
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
        <View className="relative w-[100%] border border-gray-300 mt-4 rounded-md p-2 flex-row justify-between px-3 items-center">
          <Text
            className="absolute text-[11px] py-1 px-1 -top-3 left-2"
            style={{backgroundColor: bgColor, color: textColors.textSecondary}}>
            Your Referral Code
          </Text>
          <Text className="text-base" style={{color: textColors.textPrimary}}>
            {referralCode}
          </Text>
          {referralCodeGenerationFailed ? (
            <MIcon
              name="refresh"
              color={textColors.textSecondary}
              size={25}
              onPress={() => setRefreshReferralCode({})}
            />
          ) : (
            <MIcon
              name="content-copy"
              color={textColors.textSecondary}
              size={25}
              onPress={() => copyToClipBoard(referralCode)}
            />
          )}
        </View>
      </View>

      <View className="w-full justify-around flex-row mt-7">
        <Pressable
          className="flex-row rounded-full w-[100%] py-2 px-3 justify-center items-center mt-3 "
          style={{backgroundColor: textColors.textYlMain}}
          onPress={shareToFriends}>
          <Text className="text-base font-semibold" style={{color: 'white'}}>
            Share With Your Friends
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RedeemPointsView;
