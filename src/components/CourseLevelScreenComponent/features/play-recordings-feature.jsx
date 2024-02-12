import {
  View,
  Text,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RecordingPlay from '../../../assets/images/recordingPlay.png';
import {Image} from 'react-native-animatable';
import {SCREEN_NAMES} from '../../../utils/constants/screen-names';
import {handleCourseSelector} from '../../../store/handleCourse/selector';
import {useSelector, useDispatch} from 'react-redux';
import {authSelector} from '../../../store/auth/selector';
import {handleRequestRecording} from '../../../store/request-recording/selector';
import {startRecordingRequest} from '../../../store/request-recording/reducer';
import moment from 'moment';
import {navigate} from '../../../navigationRef';

const PlayRecordingFeature = ({navigation}) => {
  const {user} = useSelector(authSelector);
  const {ClasseRecordingRequestLoading} = useSelector(handleRequestRecording);
  const [classRecordingData, setClassRecordingData] = useState();

  const {
    serviceReqClassesLoading,
    serviceReqClassesData,
    serviceReqClassesDataFailed,
  } = useSelector(handleCourseSelector);

  useEffect(() => {
    if (serviceReqClassesData?.classes?.length > 0) {
      setClassRecordingData(serviceReqClassesData?.classes);
    }
  }, [serviceReqClassesData]);
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View className="w-[100%] py-2">
      {classRecordingData?.map(classData => {
        return (
          <RecordingsTile
            user={user}
            classData={classData}
            navigation={navigation}
            ClasseRecordingRequestLoading={ClasseRecordingRequestLoading}
            serviceReqClassesLoading={serviceReqClassesLoading}
          />
        );
      })}
    </View>
  );
};

export default PlayRecordingFeature;

export const RecordingsTile = ({
  classData,
  ClasseRecordingRequestLoading,
  navigation,
  user,
  serviceReqClassesLoading,
}) => {
  const [daysToGo, setDaysToGo] = useState(null);
  const dispatch = useDispatch();
  const {bgSecondaryColor, textColors} = useSelector(state => state.appTheme);
  const [clicked, setClicked] = useState(false);
  const [classDateForRecoeding, setClassDateForRecording] = useState(null);

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

  useEffect(() => {
    const {_seconds, _nanoseconds} = classData?.classDate;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    setClassDateForRecording(moment(dateObject).isBefore(moment()));
  }, []);

  return (
    <View
      key={classData?.classNumber}
      style={{backgroundColor: bgSecondaryColor}}
      className="w-[100%] flex flex-row justify-between items-center mt-2 px-2 h-[60px] bg-blue-300 border-2 border-gray-300 border-solid rounded-md">
      <Text
        style={{color: textColors?.textPrimary}}
        className=" font-semibold text-[20px]">
        Class {classData?.classNumber}
      </Text>
      {classDateForRecoeding ? (
        !classData?.hasOwnProperty('recordingRequested') ||
        classData?.classStatus === 'Upcoming' ? (
          <Pressable
            disabled={ClasseRecordingRequestLoading}
            onPress={() => {
              setClicked(true);
              dispatch(
                startRecordingRequest({
                  leadId: user?.leadId,
                  classId: classData?.classId,
                }),
              );
            }}
            className="w-fit h-[70%] flex flex-row justify-center items-center px-2 py-1 bg-[#55D400]  rounded-md">
            <Text className="font-semibold text-white">Request Recording</Text>
            {(ClasseRecordingRequestLoading || serviceReqClassesLoading) &&
              clicked && (
                <ActivityIndicator color={'white'} style={{width: 40}} />
              )}
          </Pressable>
        ) : classData.videoUrl !== 'expired' ? (
          <Pressable
            onPress={() => {
              navigate(SCREEN_NAMES.COURSE_CONDUCT_PAGE, {
                videoUrl: classData?.videoUrl,
              });
              // navigation.navigate(SCREEN_NAMES.COURSE_CONDUCT_PAGE, {
              //   videoUrl: classData?.videoUrl,
              // });
            }}
            className="w-fit h-[70%] flex flex-row justify-center items-center px-2 py-1  rounded-md">
            {classData?.recordingRequestedAt && (
              <Text style={{color: textColors?.textSecondary}}>
                {daysToGo} days left
              </Text>
            )}
            <Image source={RecordingPlay} className="h-[45px] w-[45px] ml-3" />
          </Pressable>
        ) : (
          <View>
            <Text>Recording Expired</Text>
          </View>
        )
      ) : (
        <Pressable
          disabled={true}
          className="w-fit h-[70%] flex flex-row justify-center items-center px-2 py-1 bg-[#85e94271]  rounded-md">
          <Text className="font-semibold text-white">Request Recording</Text>
        </Pressable>
      )}
    </View>
  );
};
