import React, {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import BottomSheetComponent from '../BottomSheetComponent';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopularCourses from './PopularCourses';

const AddMoreCourse = ({
  addMoreCourseCardbgColor,
  darkMode,
  bgSecondaryColor,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);
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
      <Pressable
        onPress={() => {
          setSheetOpen(true);
        }}
        style={[
          styles.borderStyle,
          styles.innerBorder,
          {backgroundColor: darkMode ? bgSecondaryColor : '#d8d5d5'},
        ]}
        className="w-[95vw] h-[150px] rounded-lg  mt-3 flex justify-center items-center">
        <MIcon name="plus-circle" size={30} color="gray" />
      </Pressable>
      <BottomSheetComponent
        isOpen={sheetOpen}
        Children={PopularCourses}
        onClose={() => setSheetOpen(false)}
        snapPoint={['50%', '75%']}
      />
    </>
  );
};

export default AddMoreCourse;
