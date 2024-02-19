import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Dimensions, Pressable} from 'react-native';
import {Text, View} from 'react-native-animatable';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import {Image} from 'react-native-animatable';
import {
  SetHomeWorkSubmit,
  startSubmittingClasseHomeWork,
} from '../../../../store/homework-submit/reducer';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../../../../store/auth/selector';
import {handleClassesHomeWork} from '../../../../store/homework-submit/selector';
import {startFetchServiceRequestClasses} from '../../../../store/handleCourse/reducer';

const SubmitHomeWork = ({
  setSelectedClass,
  selectedClass,
  setSheetOpen,
  serviceRequestId,
  serviceReqClassesLoading,
}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(authSelector);
  const {textColors} = useSelector(state => state.appTheme);
  const [selecteImages, setSelectedImages] = useState([]);
  const [imgSrcUpload, setImgSrcUpload] = useState(null);
  const {
    ClassesHomeWorkSubmitLoading,
    ClassesHomeWorkSubmitData,
    ClassesHomeWorkHomeWorkFailed,
  } = useSelector(handleClassesHomeWork);

  const handleSubmitHomeWorkClick = () => {
    const leadId = user.leadId;
    dispatch(
      startSubmittingClasseHomeWork({
        classId: selectedClass?.classId,
        leadId,
        type: 'homework',
        allImages: selecteImages,
        serviceRequestId,
      }),
    );
  };

  useEffect(() => {
    if (serviceReqClassesLoading) {
      setSelectedClass(null);
    }
  }, [serviceReqClassesLoading]);

  const pickFile = async () => {
    try {
      setSelectedImages([]);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.3,
        selectionLimit: 15,
      });
      console.log(result);
      result.assets?.length > 0 &&
        result.assets?.map(img => {
          setSelectedImages(pre => [...pre, img]);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const width = Dimensions.get('window').width;

  return (
    <View className="flex flex-col justify-between items-center w-[100%] h-[57vh]">
      <View className="flex flex-row justify-start items-center w-[100%] mt-6 mx-auto">
        <Pressable onPress={() => setSelectedClass(null)}>
          <MIcon
            name="arrow-left-bold-circle"
            className="mt-2"
            size={35}
            color="gray"
          />
        </Pressable>
        <Text
          style={{color: textColors?.textPrimary}}
          className="text-black text-[20px] ml-3 font-semibold">
          Submit homework for class {selectedClass?.classNumber}
        </Text>
      </View>
      {selecteImages?.length > 0 && (
        <View className="rounded-lg w-[100%] h-[60%] bg-black overflow-hidden">
          <Carousel
            loop
            width={width}
            height="100%"
            data={selecteImages}
            scrollAnimationDuration={1000}
            renderItem={({item}) => {
              console.log('check item in carousel...', item);
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
                      uri: item.uri,
                    }}
                  />
                  <Pressable
                    onPress={() => {
                      const newImages = selecteImages.filter(value => {
                        return value.uri !== item.uri;
                      });
                      setSelectedImages(newImages);
                    }}
                    className="bg-red-500 rounded-lg px-3 py-2 w-[100px] h-fit absolute top-0 right-0 flex flex-row mr-[15px] justify-center items-center">
                    <Text className="text-white font-semibold text-[16px]">
                      Delete
                    </Text>
                  </Pressable>
                </View>
              );
            }}
          />
        </View>
      )}
      <View className="flex flex-col justify-center items-center w-[100%]">
        <Text className="text-blue-400 text-[18px]">
          Only .jpg, .jpeg, .png files are allowed
        </Text>
        <Text className="text-red-500 text-[18px]">
          Please DO NOT upload PDF
        </Text>
      </View>
      {selecteImages?.length > 0 ? (
        <Pressable
          onPress={() => {
            handleSubmitHomeWorkClick();
          }}
          disabled={ClassesHomeWorkSubmitLoading}
          style={{backgroundColor: textColors?.textYlMain}}
          className="flex flex-row justify-center items-center w-[90%] py-2 rounded-md mx-auto ">
          <MIcon
            name="image-multiple"
            className="mt-2"
            size={35}
            color="white"
          />
          <Text className="text-white font-semibold text-[20px] ml-2">
            Submit
          </Text>
          {(ClassesHomeWorkSubmitLoading || serviceReqClassesLoading) && (
            <ActivityIndicator color={'white'} style={{width: 40}} />
          )}
        </Pressable>
      ) : (
        <Pressable
          onPress={pickFile}
          style={{backgroundColor: textColors?.textYlMain}}
          className="flex flex-row justify-center items-center w-[90%] py-2 rounded-md mx-auto ">
          <MIcon
            name="image-multiple"
            className="mt-2"
            size={35}
            color="white"
          />
          <Text className="text-white font-semibold text-[20px] ml-2">
            Select images to upload
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default SubmitHomeWork;
