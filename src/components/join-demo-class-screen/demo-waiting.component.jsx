import React, {useState} from 'react';
import {Dimensions, View, Text, Pressable} from 'react-native';
import {COLORS} from '../../utils/constants/colors';
import {useSelector} from 'react-redux';
import UploadHandwriting from '../upload-handwriting.component';
import ModalComponent from '../modal.component';
import Email from '../email.component';
import Icon from '../icon.component';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const months = [
  'Jan',
  'Feb',
  'Mar',
  'April',
  'May',
  'June',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const zeroPrefix = time => (time > 9 ? time : `0${time}`);

const DemoWaiting = ({timeLeft}) => {
  const [visibleEmail, setVisibleEmail] = useState(false);
  const {demoData} = useSelector(state => state.joinDemo);

  const onVisibleEmail = () => {
    setVisibleEmail(true);
  };
  const onCloseEmail = () => {
    setVisibleEmail(false);
  };

  if (!demoData) return;

  return (
    <View className="items-center">
      <View className="flex-row items-end p-1">
        <View className="flex-col w-[75%]">
          <Text className="text-xs text-white">
            Your First free dmeo class will start in
          </Text>
          <View className="flex-row mt-1">
            <CountDownTimer timeLeft={timeLeft} />
          </View>
        </View>

        <View className="w-[25%]">
          <UploadHandwriting demoData={demoData} />
        </View>
      </View>

      <View className="w-full p-1">
        <Pressable
          style={({pressed}) => [
            {
              width: '100%',
              backgroundColor: 'white',
              paddingVertical: 8,
              borderRadius: 4,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
            },
            {opacity: pressed ? 0.9 : 1},
          ]}
          onPress={onVisibleEmail}>
          <MIcon name="gmail" size={24} color={COLORS.pblue} />
          <Text style={{color: COLORS.pblue}} className="ml-2 text-base">
            Get link on email
          </Text>
        </Pressable>
      </View>
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
          className="flex-col rounded-md bg-white mr-1 w-[60px] items-center justify-center">
          <Text className="text-gray-700 font-semibold text-[18px] text-center">
            {zeroPrefix(value)}
          </Text>
          <Text className="text-center text-[12px] text-gray-600">
            {updatedLabel}
          </Text>
        </View>
      );
    });
};
