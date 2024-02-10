import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import BottomSheetComponent from '../BottomSheetComponent';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopularCourses from './PopularCourses';
import {Text, View} from 'react-native-animatable';

const AddMoreCourse = ({
  darkMode,
  bgSecondaryColor,
  openCoursesSheet,
  textColors,
}) => {
  const styles = StyleSheet.create({
    borderStyle: {
      borderColor: '#b6abab',
      borderWidth: 2,
      borderRadius: 10,
      overflow: 'hidden',
    },
    innerBorder: {
      borderColor: '#b6abab',
      borderStyle: 'dashed',
      borderWidth: 2,
      padding: 2,
    },
  });
  return (
    <>
      <View className="h-[90%] ">
        <Pressable
          onPress={openCoursesSheet}
          style={[
            styles.borderStyle,
            styles.innerBorder,
            {backgroundColor: 'b6b6bc4f'},
          ]}
          className="w-[95vw] h-full rounded-lg  mt-3 flex justify-center items-center">
          <MIcon name="plus-circle" size={30} color="gray" />
          <Text
            className="text-gray-600 font-semibold text-base"
            style={{color: textColors.textSecondary}}>
            Add More Courses
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default AddMoreCourse;
