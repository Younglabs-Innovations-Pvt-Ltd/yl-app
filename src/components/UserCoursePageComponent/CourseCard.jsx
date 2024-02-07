import React, {useEffect, useState} from 'react';
import {ImageBackground, Pressable} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import ServiceRequestCard from './ServiceRequestCard';

const CourseCard = ({course, navigation}) => {
  return (
    <View className="h-fit w-[96vw] rounded-xl shadow-xl bg-gray-300 mt-[6px] px-2 py-5">
      <View className="w-full h-fit flex flex-row justify-between items-center mb-2">
        <Text className="text-[16px] text-black font-semibold">
          {course?.courseId}
        </Text>
        <Text className="text-[16px] text-black font-semibold">
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
