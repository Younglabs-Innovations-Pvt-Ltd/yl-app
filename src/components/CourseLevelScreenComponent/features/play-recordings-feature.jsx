import {View, Text, FlatList, ScrollView, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import ClassesDummyData from '../../../screens/classesDummyData.json';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecordingPlay from '../../../assets/images/recordingPlay.png';
import {Image} from 'react-native-animatable';
import { SCREEN_NAMES } from '../../../utils/constants/screen-names';

const PlayRecordingFeature = ({navigation}) => {
  const [classesData, setClassesData] = useState();
  useEffect(() => {
    console.log('check ioefneof', ClassesDummyData);
    if (ClassesDummyData?.classes?.length > 0) {
      setClassesData(ClassesDummyData?.classes);
    }
  }, [ClassesDummyData]);
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View className="w-[100%] py-2">
      {classesData?.map(classData => {
        return <RecordingsTile classData={classData} navigation={navigation} />;
      })}
    </View>
  );
};

export default PlayRecordingFeature;

export const RecordingsTile = ({classData, navigation}) => {
  const [daysToGo, setDaysToGo] = useState(null);
  useEffect(() => {
    const findDaysToGo = () => {
      const today = new Date();

      const {_seconds, _nanoseconds} = classData?.recordingRequestedAt;
      const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
      const recordingRequestedAt = new Date(milliseconds);
      const diff = Math.abs(today - recordingRequestedAt);
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      const daysTillValid = recordingRequestedAt.getDate() + 7;
      const daysToGo = daysTillValid - today.getDate();
      if (daysToGo > 0) {
        setDaysToGo(daysToGo);
      } else {
        setDaysToGo(0);
      }
    };
    if (classData?.recordingRequestedAt) {
      findDaysToGo();
    }
  }, [classData]);
  const handleRequestRecording = async () => {
    // if (classData?.classStatus === 'Attended') {
    //   toast.error('You have already attended this class')
    //   return
    // }
    // console.log(classData?.classStatus, classData.recordingRequested, 'before requesting')
    const API_URL = `${process.env.BASE_URL}/app/mycourse/requestRecording`;
    const body = {
      leadId: userData?.leadId,
      classId: classData?.classId,
    };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user?.accessToken,
        'Metadata-Flavor': 'Google',
      },
      body: JSON.stringify({
        leadId: userData?.leadId,
        classId: classData?.classId,
      }),
    });
    // const data = await response.json()
    // console.log(response)

    setClickedRequest(prev => !prev);
    // console.log(clickedRequest, 'clicked')
    if (response.status === 200) {
      // setRefetch({})
      setCurrentModal('Play Recording');
    } else {
      toast.error('Recording can be requested after the class is over');
      return;
    }
    queryClient.invalidateQueries('classData');
    setClicked({});
    // console.log(classData?.classStatus, classData.recordingRequested, 'after requesting')
  };
  return (
    <View className="w-[100%] flex flex-row justify-between items-center mt-2 px-2 h-[60px] bg-blue-300 border-2 border-gray-300 border-solid rounded-md">
      <Text className="text-black font-semibold text-[20px]">
        Class {classData?.classNumber}
      </Text>
      {!classData?.hasOwnProperty('recordingRequested') ||
      classData?.classStatus === 'Upcoming' ? (
        <Pressable
          onPress={() => {}}
          className="w-fit h-[70%] flex flex-row justify-center items-center px-2 py-1 bg-[#55D400]  rounded-md">
          <Text className="font-semibold text-white">Request Recording</Text>
        </Pressable>
      ) : classData.videoUrl !== 'expired' ? (
        <Pressable
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.COURSE_CONDUCT_PAGE, {
              videoUrl: classData?.videoUrl,
            });
          }}
          className="w-fit h-[70%] flex flex-row justify-center items-center px-2 py-1  rounded-md">
          {classData?.recordingRequestedAt && (
            <Text className="text-black">{daysToGo} days left</Text>
          )}
          <Image source={RecordingPlay} className="h-[45px] w-[45px] ml-3" />
        </Pressable>
      ) : (
        <View>
          <Text>Recording Expired</Text>
        </View>
      )}
    </View>
  );
};
