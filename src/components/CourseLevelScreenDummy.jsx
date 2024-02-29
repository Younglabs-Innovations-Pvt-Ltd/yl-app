import React, {useRef} from 'react';
import {
  View,
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useToast} from 'react-native-toast-notifications';
import {Showtoast} from '../utils/toast';
import SubmitHomework from '../assets/CourseFeatureImages/SubmitHomework.jpeg';
import PlayRecording from '../assets/CourseFeatureImages/PlayRecording.jpeg';
import DownloadWorksheets from '../assets/CourseFeatureImages/DownloadWorksheets.jpeg';
import DownloadCertificate from '../assets/CourseFeatureImages/DownloadCertificate.jpeg';
import ClassViewHomeWork from '../assets/CourseFeatureImages/ClassWiseHomeWork.jpeg';
import CUstomerSupport from '../assets/CourseFeatureImages/CustomerSupport.jpeg';
import {BANNER_H} from './CourseLevelScreenComponent/features/constants';
import {FONTS} from '../utils/constants/fonts';
import {Image, Text} from 'react-native-animatable';
import RoadMapBG from '../assets/images/roadMapBackground.jpeg';
import RoadMapBGDark from '../assets/images/roadMapBackgroundDark.jpeg';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const CourseLevelScreenDummy = ({
  setCoursesSheetOpen,
  setBottomSheetSource,
}) => {
  const {bgColor, bgSecondaryColor, darkMode, textColors} = useSelector(
    state => state.appTheme,
  );
  const scrollA = useRef(new Animated.Value(0)).current;
  const introduceCourse = () => {
    Showtoast({
      text: 'Buy Course',
      toast,
      type: 'success',
    });
  };

  return (
    <>
      <View
        className="w-[100%] h-[100%]"
        style={{backgroundColor: darkMode ? bgColor : '#76C8F2'}}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}>
          <View style={styles.bannerContainer}>
            <FeatureTrayDummy
              scrollA={scrollA}
              darkMode={darkMode}
              introduceCourse={introduceCourse}
              setCoursesSheetOpen={setCoursesSheetOpen}
              setBottomSheetSource={setBottomSheetSource}
              bgSecondaryColor={bgSecondaryColor}
            />
          </View>

          <View className="h-[100%] relative">
            <SnakeLevelDummy
              darkMode={darkMode}
              introduceCourse={introduceCourse}
              setCoursesSheetOpen={setCoursesSheetOpen}
              setBottomSheetSource={setBottomSheetSource}
            />
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
};

export default CourseLevelScreenDummy;

const styles = {
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
};

const FeatureTrayDummy = ({
  scrollA,
  darkMode,
  introduceCourse,
  setCoursesSheetOpen,
  setBottomSheetSource,
  bgSecondaryColor,
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
  return (
    <Animated.View
      style={styles.banner(scrollA)}
      className="flex justify-center items-center">
      <FlatList
        className="w-[96vw] h-[100%] mx-auto mt-6"
        data={featuresNew}
        horizontal
        keyExtractor={item => item.index.toString()}
        renderItem={item => {
          return (
            <Pressable
              onPress={() => {
                setCoursesSheetOpen(true);
                setBottomSheetSource('noCourse');
              }}
              key={item?.item?.index}
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

const SnakeLevelDummy = ({
  darkMode,
  introduceCourse,
  setCoursesSheetOpen,
  setBottomSheetSource,
}) => {
  const toast = useToast();
  const allClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const marginleftcustom = [100, 150, 200, 190, 150, 100];
  const styles = StyleSheet.create({
    backgroundImage: {
      resizeMode: 'cover',
      justifyContent: 'start',
    },
    myView: {
      // backgroundColor: darkMode ? bgSecondaryColor : 'white',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 10,
    },
  });

  let count = -1;

  return (
    <View className="h-[100%] w-[100%] bg-white rounded-t-xl overflow-hidden mb-11">
      <Pressable
        onPress={() => {
          setCoursesSheetOpen(true);
          setBottomSheetSource('noCourse');
        }}>
        <ImageBackground
          className="rounded-t-xl"
          style={styles.backgroundImage}
          source={darkMode ? RoadMapBGDark : RoadMapBG}>
          {allClasses &&
            allClasses?.map((level, index) => {
              console.log(level, 'level');
              count = count >= marginleftcustom.length - 1 ? 0 : count + 1;
              return (
                <View key={index} className="w-[100%] my-3 bg-transparent">
                  <View
                    style={[
                      {marginLeft: marginleftcustom[count]},
                      styles.myView,
                    ]}
                    className={`h-[80px] w-[80px] top-[30px] absolute bg-[#6d6ded]   rounded-full`}></View>
                  <Pressable
                    onPress={() => {
                      setBottomSheetSource('noCourse');
                      setCoursesSheetOpen(true);
                    }}
                    style={[
                      {marginLeft: marginleftcustom[count]},
                      styles.myView,
                    ]}
                    className={`p-4
                    bg-blue-500

                  h-[80px] w-[80px] mt-6 rounded-full flex justify-center items-center relative`}>
                    <MIcon name={'lock'} size={30} color={'white'} />
                  </Pressable>
                </View>
              );
            })}
        </ImageBackground>
      </Pressable>
    </View>
  );
};
