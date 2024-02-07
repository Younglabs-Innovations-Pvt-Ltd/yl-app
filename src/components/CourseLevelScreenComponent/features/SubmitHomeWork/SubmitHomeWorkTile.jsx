import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Text, View} from 'react-native-animatable';
import BottomSheetComponent from '../../../BottomSheetComponent';
import ViewUploadedHomeWork from './ViewUploadedHomeWork';

const SubmitHomeWorkTile = ({
  classData,
  selectedClass,
  setSelectedClass,
  setViewUploadedHomwWork,
  setEditHomeWork,
}) => {
  const [startDate, setStartDate] = useState(null);
  useEffect(() => {
    const {_seconds, _nanoseconds} = classData?.classDate;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    const date = moment(dateObject).format('MM/DD/YYYY');
    setStartDate(date);
  }, [classData]);
  const ifClassInFuture = () => {
    const {_seconds, _nanoseconds} = classData?.classDate;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    const classDate = moment(dateObject);
    const currentDate = new Date();
    if (classDate > currentDate) {
      return true;
    } else {
      return false;
    }
  };
  const getEvaluatedOrNot = () => {
    if (classData.hasOwnProperty('evaluatedUrls')) {
      return true;
    } else {
      return false;
    }
  };
  const getUploadedOrNot = () => {
    if (
      classData.hasOwnProperty('homeworkUrls') &&
      classData.homeworkUrls.length > 0
    ) {
      return true;
    }
    return false;
  };
  const isChecked = getEvaluatedOrNot();
  const isUploaded = getUploadedOrNot();
  const isInFuture = ifClassInFuture();
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
    <View
      style={[styles.borderStyle, styles.innerBorder]}
      className="w-[100%] h-[120px] bg-[#b6b6bc4f] border-2 border-gray-300 rounded-md mt-3">
      <View className="w-[100%] h-[50%] flex flex-row justify-between items-start px-3 pt-2 ">
        <Text className="text-black text-[20px] font-semibold">
          Class {classData?.classNumber}
        </Text>
        <Text className="text-black text-[20px] font-semibold">
          Held on : {startDate}
        </Text>
      </View>
      <View className="w-[100%] h-[50%] flex flex-row justify-between items-end px-3 pb-2 ">
        {!isInFuture ? (
          isChecked ? (
            <Pressable
              onPress={() => {
                setSelectedClass(classData);
                setViewUploadedHomwWork(true);
                setEditHomeWork(false);
              }}
              className="w-[100%] flex flex-row justify-center items-center rounded-md py-2 bg-blue-400">
              <Text className="text-white text-[20px] font-semibold">
                View Checked
              </Text>
            </Pressable>
          ) : (
            <View className="flex flex-row justify-center items-center w-[100%]">
              {isUploaded && (
                <Pressable
                  onPress={() => {
                    setSelectedClass(classData);
                    setViewUploadedHomwWork(true);
                    setEditHomeWork(true);
                  }}
                  className="w-[50%] mr-1 flex flex-row justify-center items-center rounded-md py-2 bg-blue-400">
                  <Text className="text-white text-[20px] font-semibold">
                    View Uploaded
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={() => setSelectedClass(classData)}
                className={`${
                  !isUploaded ? 'w-[100%]' : 'w-[50%]'
                } flex flex-row justify-center items-center rounded-md py-2 bg-blue-400`}>
                <Text className="text-white text-[20px] font-semibold">
                  Upload
                </Text>
              </Pressable>
            </View>
          )
        ) : (
          <Pressable
            disabled={true}
            className={`${
              !isUploaded ? 'w-[100%]' : 'w-[50%]'
            } flex flex-row justify-center items-center rounded-md py-2 bg-blue-200`}>
            <Text className="text-white text-[20px] font-semibold">Upload</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SubmitHomeWorkTile;
