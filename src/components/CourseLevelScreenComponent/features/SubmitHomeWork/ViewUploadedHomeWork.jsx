import {
  View,
  Text,
  Dimensions,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {Image} from 'react-native-animatable';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {authSelector} from '../../../../store/auth/selector';
import {BASE_URL} from '@env';
import auth from '@react-native-firebase/auth';
import Snackbar from 'react-native-snackbar';
import {startFetchServiceRequestClasses} from '../../../../store/handleCourse/reducer';

const ViewUploadedHomeWork = ({
  selectedClass,
  setSelectedClass,
  setViewUploadedHomwWork,
  editHomeWork,
  setEditHomeWork,
  serviceRequestId,
}) => {
  //   useEffect(() => {
  //     console.log('check all urls', selectedClass?.homeworkUrls);
  //   }, [selectedClass]);
  const width = Dimensions.get('window').width;
  const {user} = useSelector(authSelector);
  const [homeWorkUrls, setHomeWorkUrls] = useState(selectedClass?.homeworkUrls);
  const dispatch = useDispatch();
  const sendHwLink = async ({classId, homeworkUrls}) => {
    const body = {
      leadId: user?.leadId,
      classId: classId,
      homeworkUrls,
    };
    const token = await auth().currentUser.getIdToken();
    return fetch(`${BASE_URL}/app/mycourse/savehomework`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(body),
    })
      .then(response => {
        if (response.status == 200) {
          Snackbar.show({
            text: 'Homework deleted successfully',
            textColor: 'white',
            duration: Snackbar.LENGTH_LONG,
          });
          dispatch(
            startFetchServiceRequestClasses({
              leadId: user?.leadId,
              serviceRequestId,
            }),
          );
        } else {
          Snackbar.show({
            text: 'Somwthing went wrong',
            textColor: 'white',
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .then(() => {
        if (homeworkUrls.length <= 0) {
          setViewUploadedHomwWork(null);
          setSelectedClass(null);
          setEditHomeWork(null);
        }
      });
  };

  return (
    <View className="w-[100%] h-[55vh] rounded-md overflow-hidden">
      <Pressable
        onPress={() => {
          setViewUploadedHomwWork(null);
          setSelectedClass(null);
          setEditHomeWork(null);
        }}>
        <MIcon
          name="arrow-left-bold-circle"
          className="mt-2"
          size={35}
          color="gray"
        />
      </Pressable>
      <View className="rounded-lg w-[100%] h-full overflow-hidden">
        <Carousel
          loop
          width={width}
          className="h-[100%] w-[100%]"
          height="100%"
          data={homeWorkUrls}
          scrollAnimationDuration={1000}
          renderItem={({item}) => {
            return (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: 'center',
                }}
                className="relative">
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 10}}
                  resizeMode="cover"
                  source={{
                    uri: `${item}`,
                  }}
                />
                {/* {editHomeWork && (
                  <Pressable
                    onPress={() => {
                      const newImages = homeWorkUrls.filter(value => {
                        return value !== item;
                      });
                      sendHwLink({
                        classId: selectedClass?.classId,
                        homeworkUrls: newImages,
                      });
                      setHomeWorkUrls(newImages);
                    }}
                    className="bg-red-500 rounded-lg px-3 py-2 w-[100px] h-fit absolute top-0 right-0 flex flex-row mr-[15px] justify-center items-center">
                    <Text className="text-white font-semibold text-[16px]">
                      Delete
                    </Text>
                  </Pressable>
                )} */}
              </View>
            );
          }}
        />
      </View>
    </View>
  );
};

export default ViewUploadedHomeWork;
