import {View, Text, Pressable} from 'react-native';
import React, {useMemo} from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadHandwriting from './upload-handwriting.component';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {TouchableOpacity} from 'react-native-gesture-handler';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const TapeTimer = ({timeLeft, isTimeover}) => {
  const {darkMode, bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const {
    demoData,
    bookingDetails,
    bookingTime,
    showJoinButton,
    teamUrl,
    message,
  } = useSelector(joinDemoSelector);

  const SHOW_TIMER = useMemo(() => {
    if (!bookingTime) return null;

    return new Date(bookingTime).getTime() > Date.now();
  }, [bookingTime]);

  const SHOW_JOIN_BUTTON = useMemo(() => {
    return isTimeover && showJoinButton;
  }, [isTimeover, showJoinButton]);

  const handleJoinClass = async () => {
    dispatch(joinFreeClass({bookingDetails, childName, teamUrl}));
  };

  return (
    <View
      className="my-1 w-[99%] rounded flex-row justify-between"
      style={{backgroundColor: colorYlMain}}>
      {SHOW_TIMER && (
        <>
          <View className="w-[70%] justify-center p-1 px-3">
            <Text className="text-white text-[11px]">
              Your free handwriting class will start in
            </Text>
            <View className="flex-row mt-1">
              <CountDownTimer timeLeft={timeLeft} />
            </View>
          </View>

          <View className="w-[30%] justify-center px-1">
            <UploadHandwriting demoData={demoData} />
          </View>
        </>
      )}

      {
      SHOW_JOIN_BUTTON && (
        <View className="w-full p-1 px-3">
          <Text className="text-white font-semibold text-base ml-3 ">
            Your free handwriting class is going on
          </Text>
          <View className="w-full">
            <Pressable
              className="p-2 w-full rounded-full bg-white mt-2"
              onPress={() => console.log('TeamsUrl', teamUrl)}>
              <Text className="text-base font-semibold text-gray-700 text-center">
                Enter Class
              </Text>
            </Pressable>
          </View>
        </View>
      )
      }

      {/* {
        SHOW_JOIN_BUTTON && <JoinDemoView/>
      } */}
    </View>
  );
};

const CountDownTimer = ({timeLeft}) => {
  const {darkMode, bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  return Object.entries(timeLeft)
    .filter(entry => entry[0] !== 'remainingTime')
    .map(time => {
      const label = time[0];
      const value = time[1];
      const updatedLabel = label.slice(0, 1).toUpperCase() + label.slice(1);

      return (
        <View
          key={label}
          style={[]}
          className="flex-col rounded-md bg-white mr-1 w-[60px]">
          <Text className="text-gray-700 font-semibold text-[18px] text-center">
            {zeroPrefix(value)}
          </Text>
          <Text className="text-center text-[12px]">{updatedLabel}</Text>
        </View>
      );
    });
};

export default TapeTimer;
