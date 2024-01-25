import React from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const PopularCourses = () => {
  const moreCourse = [
    {
      name: 'English Cursive',
      index: 1,
      courseId: 'Eng_Hw',
      icon: 'alpha-e',
      showBookDemoScreen: true,
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
      thumbnailUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
    },
    {
      name: 'English Print',
      index: 2,
      icon: 'pinterest',
      courseId: 'English_PrintHW',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
      thumbnailUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEnglish_PrintHW%2FthimbnailUrl.webp?alt=media&token=b81a6eb1-e4bf-4e0c-af96-4659c0106422',
    },
    {
      name: 'Hindi Handwriting',
      index: 3,
      icon: 'abugida-devanagari',
      courseId: 'Maths_Learning',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
      thumbnailUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/course%20cover%20pictures%2Freading.webp?alt=media&token=34617f04-1c15-4bff-a75e-8a6668ad373a',
    },
    {
      name: 'English Cursive2',
      index: 4,
      icon: 'abjad-arabic',
      courseId: 'Science_Learning',
      description:
        'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
      thumbnailUrl:
        'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2Ftuition_homework%2FthimbnailUrl.png?alt=media&token=19d07140-4a86-4671-88c2-c50003868795',
    },
  ];
  var styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
    },
    buttonText: {
      fontSize: 18,
      fontFamily: 'Gill Sans',
      textAlign: 'center',
      margin: 10,
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  });
  return (
    <View>
      <ScrollView className="w-[96vw] mx-auto">
        {moreCourse?.map(item => {
          return (
            <View
              key={item.index}
              className="w-[100%] h-[190px] my-2 mr-2 relative rounded-xl overflow-hidden">
              <Image
                className=" w-[100%] h-full object-cover rounded-xl"
                source={{
                  uri: item.thumbnailUrl,
                }}
              />
              <LinearGradient
                className="absolute h-[100%] w-[100%] rounded-xl"
                start={{x: 0.5, y: -0.3}}
                colors={['#e9dcdc78', '#161414a2']}>
                <View className="absolute h-[100%] w-[100%]  rounded-xl flex flex-col justify-end items-start px-3 pb-3">
                  <Text className="text-white font-semibold text-[22px] mb-2">
                    {item?.name}
                  </Text>
                  <Text className="text-white font-semibold text-[13px] mb-2">
                    {item?.description}
                  </Text>
                  <Pressable className="bg-blue-400 w-[90px]  py-2 rounded-xl flex justify-center items-center">
                    <Text className="text-white font-semibold text-[12px]">
                      View Course
                    </Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default PopularCourses;
