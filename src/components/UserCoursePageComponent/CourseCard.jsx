import React, {useEffect, useState} from 'react';
import {ImageBackground, Pressable} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Level2 from '../../assets/images/redRank.png';
import Level1 from '../../assets/images/blueRank.png';
import moment from 'moment';
import { SCREEN_NAMES } from '../../utils/constants/screen-names';

const CourseCard = ({course, navigation}) => {
  const [startDate, setStartDate] = useState(null);
  useEffect(() => {
    // console.log(course);
    // console.log(course?.serviceRequests[0]?.promisedStartDate);
    const {_seconds, _nanoseconds} =
      course?.serviceRequests[0]?.promisedStartDate;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    console.log('before', dateObject);
    const date = moment(dateObject).format('dddd, MMM D');
    // console.log('check converted Date', date);
    setStartDate(date);
  }, [course]);
  return (
    <View className="overflow-hidden rounded-xl relative mt-[6px]">
      <ImageBackground
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
        }}>
        <LinearGradient
          start={{x: 0.5, y: -0.3}}
          colors={['#e9dcdc78', '#161414a2']}>
          <Pressable
            onPress={() => {
              // console.log('navigate to course page');
              navigation.navigate(SCREEN_NAMES.COURSE_LEVEL_PAGE);
            }}
            className="w-[96vw] h-[160px] rounded-lg shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-row justify-between items-center mt-2 pl-3">
            <View className="flex flex-row justify-between items-center w-[100%]">
              <View className="w-[70%] py-2 h-[160px] flex flex-col justify-end items-start mr-2">
                <View className="flex flex-col justify-center items-start">
                  <Text className="text-[25px] text-white font-semibold">
                    {course?.serviceRequests[0]?.level == 1
                      ? 'Foundation'
                      : 'Advanced'}
                  </Text>
                  <Text
                    // style={{fontFamily: FONTS.signika_medium}}
                    className="text-[25px] text-white font-semibold">
                    {course?.courseId}
                  </Text>

                  <Text className="text-[25px] text-white font-semibold">
                    {startDate}
                  </Text>
                  <Text className="text-[25px] text-white font-semibold">
                    Sessions : {course?.serviceRequests[0]?.classCount}
                  </Text>
                </View>
              </View>

              {course?.serviceRequests[0]?.level === 1 ? (
                <View className="flex flex-col justify-center items-center min-h-[100%] w-[30%] pr-3">
                  <View
                    className={`border-2 border-[#e9dcdc78] h-fit w-fit px-3  mb-2  py-2 flex flex-row items-center justify-center rounded-md text-white ${
                      course?.serviceRequests[0]?.level == 1
                        ? 'bg-cyan-600'
                        : 'bg-red-500'
                    }`}>
                    <Text className="font-semibold text-[16px]">Level 1</Text>
                  </View>
                  <Image source={Level1} style={{height: 90, width: 90}} />
                </View>
              ) : (
                <View className="flex flex-col justify-center items-center min-h-[100%] w-[30%] pr-3">
                  <View
                    className={`border-2 border-[#e9dcdc78] h-fit w-fit px-3 py-2 mb-2 flex flex-row items-center justify-center rounded-md text-white ${
                      course?.serviceRequests[0]?.level == 1
                        ? 'bg-cyan-600'
                        : 'bg-red-500'
                    }`}>
                    <Text className="font-semibold text-[16px]">Level 2</Text>
                  </View>
                  <Image source={Level2} style={{height: 90, width: 90}} />
                </View>
              )}
            </View>
          </Pressable>
        </LinearGradient>
        {/* <View className="absolute h-[100%] w-[100%] bg-[#00000038]"></View> */}
      </ImageBackground>
    </View>
  );
};

export default CourseCard;
