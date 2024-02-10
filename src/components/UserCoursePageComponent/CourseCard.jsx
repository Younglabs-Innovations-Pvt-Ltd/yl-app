import React, {useEffect, useState} from 'react';
import {ImageBackground, Pressable} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import ServiceRequestCard from './ServiceRequestCard';
import {useSelector} from 'react-redux';

const CourseCard = ({course, navigation}) => {
  const {
    bgColor,
    bgSecondaryColor,
    textColors,
    colorYlMain,
    darkMode,
    addMoreCourseCardbgColor,
  } = useSelector(state => state.appTheme);
  return (
    <View
      key={course?.level}
      style={{backgroundColor: bgSecondaryColor}}
      className="h-fit w-[96vw] rounded-xl shadow-xl mt-[6px] px-2 py-5">
      <View className="w-full h-fit flex flex-row justify-between items-center mb-2">
        <Text
          style={{color: textColors?.textPrimary}}
          className="text-[16px] font-semibold">
          {course?.courseId}
        </Text>
        <Text
          style={{color: textColors?.textPrimary}}
          className="text-[16px] font-semibold">
          Student : {course?.childName}
        </Text>
      </View>
      {course?.serviceRequests?.map(data => {
        return <ServiceRequestCard course={data} navigation={navigation} />;
      })}
    </View>
  );
};

export default CourseCard;
