import React, {useEffect, useState} from 'react';
import {Dimensions, View, Text, Pressable, Image} from 'react-native';
import {COLORS} from '../../utils/constants/colors';
import {useSelector} from 'react-redux';
import UploadHandwriting from '../upload-handwriting.component';
import ModalComponent from '../modal.component';
import Email from '../email.component';
import Icon from '../icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const DemoWaiting = ({timeLeft}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [visibleEmail, setVisibleEmail] = useState(false);
  const {demoData, bookingDetails} = useSelector(state => state.joinDemo);

  const onVisibleEmail = () => {
    setVisibleEmail(true);
  };
  const onCloseEmail = () => {
    setVisibleEmail(false);
  };

  if (!demoData) return;

  const collapsibleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View className="relative">
      {isCollapsed && (
        <View className="py-1 px-2 flex-row">
          <ShortTape timeLeft={timeLeft} setIsCollapsed={setIsCollapsed} />
        </View>
      )}

      {!isCollapsed && (
        <LongTape
          timeLeft={timeLeft}
          demoData={demoData}
          onVisibleEmail={onVisibleEmail}
          setIsCollapsed={setIsCollapsed}
          courseName={bookingDetails?.courseName}
        />
      )}

      <ModalComponent visible={visibleEmail}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            paddingHorizontal: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View className="bg-white p-6 rounded">
            <View style={{}}></View>
            <View style={{}}>
              <Email demoData={demoData} />
              <Icon
                name="close"
                size={26}
                color={COLORS.black}
                style={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                }}
                onPress={onCloseEmail}
              />
            </View>
            <View style={{}}></View>
          </View>
        </View>
      </ModalComponent>
    </View>
  );
};

export default DemoWaiting;

const LongTape = ({timeLeft, courseName, onVisibleEmail, setIsCollapsed}) => {
  const gmailIcon = require('../../assets/icons/gmailIcon.png');

  const marginBottom = useSharedValue(-30);
  const opacity = useSharedValue(0);

  const animate = () => {
    marginBottom.value = withDelay(400, withSpring(0));
    opacity.value = withDelay(400, withSpring(1));
  };
  useEffect(() => {
    animate();
  }, []);
  return (
    <Animated.View
      style={{
        marginBottom: marginBottom,
        opacity: opacity,
      }}>
      <View className="flex-row items-center justify-between py-1 px-1">
        <View className="flex-col">
          <Text className="text-xs text-white">{`Your free ${
            courseName || ''
          } class starts in`}</Text>
          <View className="flex-row mt-1">
            <CountDownTimer timeLeft={timeLeft} />
          </View>
        </View>

        <View className="flex-row px-1 items-center justify-center">
          {/* <View className="">
            <UploadHandwriting demoData={demoData} />
          </View> */}
          <View className="justify-center">
            <Pressable
              style={({pressed}) => [
                {
                  alignItems: 'center',
                  justifyContent: 'end',
                },
                {opacity: pressed ? 0.9 : 1},
              ]}
              className="flex-col items-center justify-end"
              onPress={onVisibleEmail}>
              <Image
                source={gmailIcon}
                style={{
                  width: 24,
                  height: 24,
                  resizeMode: 'cover',
                }}
              />
              {/* <View className="items-center mt-1">
                <Text
                  style={{color: COLORS.white}}
                  className="text-[12px] leading-[12px]">
                  Email
                </Text>
                <Text
                  style={{color: COLORS.white}}
                  className="text-[12px] leading-[12px]">
                  link
                </Text>
              </View> */}
            </Pressable>
          </View>

          <View className="items-center justify-start h-full ml-2">
            <MIcon
              name="chevron-up"
              size={28}
              color="white"
              onPress={() => setIsCollapsed(true)}
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const CountDownTimer = ({timeLeft}) => {
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
          className="flex-col rounded-md bg-white mr-1 px-2 py-1 items-center justify-center">
          <Text className="text-gray-700 font-semibold text-[15px] text-center leading-[16px]">
            {zeroPrefix(value)}
          </Text>
          <Text className="text-center text-[10px] text-gray-600 leading-[11px]">
            {updatedLabel}
          </Text>
        </View>
      );
    });
};

const CountDownTimer2 = ({timeLeft}) => {
  return Object.entries(timeLeft)
    .filter(entry => entry[0] !== 'remainingTime')
    .map(time => {
      const label = time[0];
      const value = time[1];
      const updatedLabel = label.slice(0, 1).toUpperCase() + label.slice(1);

      return (
        <View
          className="flex-row rounded-md mr-1 items-end justify-center"
          key={label}>
          <Text className="text-white font-semibold text-[15px] text-center leading-[16px]">
            {zeroPrefix(value)}
          </Text>
          {updatedLabel?.toLowerCase() !== 'seconds' && (
            <Text className="text-white font-semibold text-[15px] text-center leading-[16px ml-[2px]">
              :
            </Text>
          )}
        </View>
      );
    });
};

const ShortTape = ({timeLeft, setIsCollapsed}) => {
  const marginBottom = useSharedValue(-10);
  const opacity = useSharedValue(0);

  const animate = () => {
    marginBottom.value = withDelay(100, withSpring(0));
    opacity.value = withDelay(100, withSpring(1));
  };
  useEffect(() => {
    animate();
  }, []);

  return (
    <Animated.View
      style={{
        marginBottom: marginBottom,
        flex: 1,
        opacity: opacity,
        flexDirection: 'row',
      }}>
      <Pressable
        className="flex-row w-full items-center justify-between"
        onPress={() => {
          setIsCollapsed(false);
        }}>
        <View className="flex-row">
          <Text className="text-white font-semibold mr-2">
            Class Starts in:
          </Text>
          <CountDownTimer2 timeLeft={timeLeft} />
        </View>
        <Icon name="chevron-down" size={24} color="white" />
      </Pressable>
    </Animated.View>
  );
};
