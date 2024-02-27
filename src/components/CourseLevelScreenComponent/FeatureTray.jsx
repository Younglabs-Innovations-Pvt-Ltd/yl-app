import React, {useEffect} from 'react';
import {Animated, FlatList, Pressable} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import SubmitHomework from '../../assets/CourseFeatureImages/SubmitHomework.jpeg';
import PlayRecording from '../../assets/CourseFeatureImages/PlayRecording.jpeg';
import DownloadWorksheets from '../../assets/CourseFeatureImages/DownloadWorksheets.jpeg';
import DownloadCertificate from '../../assets/CourseFeatureImages/DownloadCertificate.jpeg';
import ClassViewHomeWork from '../../assets/CourseFeatureImages/ClassWiseHomeWork.jpeg';
import CUstomerSupport from '../../assets/CourseFeatureImages/CustomerSupport.jpeg';
import {BANNER_H} from './features/constants';
import {FONTS} from '../../utils/constants/fonts';

const FeatureTray = ({
  scrollA,
  bgSecondaryColor,
  darkMode,
  enabledFeatures,
  features,
  setFeatures,
  setSheetOpen,
  setDisplayFeature,
}) => {
  const styles = {
    banner: scrollA => ({
      height: BANNER_H,
      width: '200%',
      transform: [
        {
          translateY: scrollA.interpolate({
            inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
            outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
          }),
        },
        {
          scale: scrollA.interpolate({
            inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
            outputRange: [2, 1, 0.5, 0.5],
          }),
        },
      ],
    }),
  };
  const featuresNew = [
    {
      featureName: 'Submit/HomeWork',
      icon: SubmitHomework,
      feature: 'submit_homework',
      index: 1,
    },
    {
      featureName: 'Play/Recording',
      icon: PlayRecording,
      feature: 'request_recording',
      index: 2,
    },
    {
      featureName: 'Download/Worksheets',
      icon: DownloadWorksheets,
      feature: 'download_worksheets',
      index: 3,
    },
    {
      featureName: 'Download/Certificate',
      icon: DownloadCertificate,
      feature: 'course_certificate',
      index: 4,
    },
    {
      featureName: 'Class Wise/HomeWork',
      icon: ClassViewHomeWork,
      feature: 'view_class_wise_homework',
      index: 5,
    },
    {
      featureName: 'Customer/Support',
      icon: CUstomerSupport,
      feature: 'customer_support',
      index: 6,
    },
  ];
  useEffect(() => {
    if (enabledFeatures) {
      const newFeatures = featuresNew?.filter(item => {
        if (enabledFeatures?.includes(item?.feature)) {
          return item;
        }
      });
      setFeatures(newFeatures);
    }
  }, [enabledFeatures]);
  return (
    <Animated.View
      style={styles.banner(scrollA)}
      className="flex justify-center items-center">
      <FlatList
        className="w-[96vw] h-[100%] mx-auto mt-6"
        data={features}
        horizontal
        keyExtractor={item => item.index.toString()}
        renderItem={item => {
          return (
            <Pressable
              key={item?.item?.index}
              onPress={() => {
                setDisplayFeature(item.item?.feature);
                setSheetOpen(true);
              }}
              style={{backgroundColor: darkMode ? bgSecondaryColor : 'white'}}
              className=" mt-2 mr-6 h-[150px] relative rounded-md">
              <View>
                <Image
                  className="rounded-t-md"
                  style={[styles?.icon, {width: 120, height: 100}]}
                  source={item?.item?.icon}
                />
                <View className="flex flex-col justify-end items-end h-[48px]">
                  <Text
                    style={{
                      fontFamily: FONTS.signika_medium,
                      color: darkMode ? 'white' : 'black',
                    }}
                    className="px-4 text-[16px] leading-[18px] w-[100%] text-center">
                    {item.item?.featureName.split('/')[0]}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.signika_medium,
                      color: darkMode ? 'white' : 'black',
                    }}
                    className="px-4 text-[16px] leading-[18px] w-[100%] text-center">
                    {item.item?.featureName.split('/')[1]}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </Animated.View>
  );
};

export default FeatureTray;
