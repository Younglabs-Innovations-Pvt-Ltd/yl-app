import {View, Text, ImageBackground, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import Level2 from '../../assets/images/redRank.png';
import Level1 from '../../assets/images/blueRank.png';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import {Image} from 'react-native-animatable';

const ServiceRequestCard = ({course, navigation}) => {
  const [startDate, setStartDate] = useState(null);
  useEffect(() => {
    console.log(course?.serviceRequestId);
  }, [course]);

  // useEffect(() => {
  //   // console.log('check service request', course);
  //   const {_seconds, _nanoseconds} = course?.promisedStartDate;
  //   const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
  //   const dateObject = new Date(milliseconds);
  //   console.log('before', dateObject);
  //   const date = moment(dateObject).format('dddd, MMM D');
  //   setStartDate(date);
  // }, [course]);

  return (
    <View className="overflow-hidden rounded-xl relative mt-[6px] border border-solid border-gray-200">
      <ImageBackground
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
        }}>
        <LinearGradient
          start={{x: 0.5, y: -0.3}}
          colors={['#e9dcdc78', '#161414a2']}>
          <Pressable
            onPress={() => {
              // console.log('navigate to course page', course?.serviceRequestId);
              navigation.navigate(SCREEN_NAMES.COURSE_LEVEL_PAGE, {
                serviceRequestId: course?.serviceRequestId,
              });
            }}
            className="w-[92vw] h-[160px] rounded-lg shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] flex flex-row justify-between items-center mt-2 pl-3">
            <View className="flex flex-row justify-between items-center w-[100%]">
              <View className="w-[70%] py-2 h-[160px] flex flex-col justify-end items-start mr-2">
                <View className="flex flex-col justify-center items-start">
                  <Text className="text-[25px] text-white font-semibold">
                    {course.level == 1 ? 'Foundation' : 'Advanced'}
                  </Text>
                  <Text className="text-[25px] text-white font-semibold">
                    {course?.courseId}
                  </Text>

                  <Text className="text-[25px] text-white font-semibold">
                    {/* {startDate} */} 09-02-2024
                  </Text>
                  <Text className="text-[25px] text-white font-semibold">
                    Sessions : {course?.classCount}
                  </Text>
                </View>
              </View>

              {course?.level && course?.level == 1 ? (
                <View className="flex flex-col justify-center items-center min-h-[100%] w-[30%] pr-3">
                  <View
                    className={`border-2 border-[#e9dcdc78] h-fit w-fit px-3  mb-2  py-2 flex flex-row items-center justify-center rounded-md text-white ${
                      course?.level == 1 ? 'bg-cyan-600' : 'bg-red-500'
                    }`}>
                    <Text className="font-semibold text-[16px]">Level 1</Text>
                  </View>
                  <Image source={Level1} style={{height: 90, width: 90}} />
                </View>
              ) : (
                <View className="flex flex-col justify-center items-center min-h-[100%] w-[30%] pr-3">
                  <View
                    className={`border-2 border-[#e9dcdc78] h-fit w-fit px-3 py-2 mb-2 flex flex-row items-center justify-center rounded-md text-white ${
                      course?.level == 1 ? 'bg-cyan-600' : 'bg-red-500'
                    }`}>
                    <Text className="font-semibold text-[16px]">Level 2</Text>
                  </View>
                  <Image source={Level2} style={{height: 90, width: 90}} />
                </View>
              )}
            </View>
          </Pressable>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

export default ServiceRequestCard;
