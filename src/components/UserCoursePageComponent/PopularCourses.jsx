import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet} from 'react-native';
import {Image, Text, View} from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

const PopularCourses = ({courses, navigation}) => {
  const [allCourses, setAllCourses] = useState(courses);
  const [allCoursesKey, setAllCoursesKey] = useState(Object.keys(courses));

  useEffect(() => {
    // console.log(allCoursesKey, 'regiheorihgerihgoeirngo');
    // console.log(allCourses[allCoursesKey[0]][0], 'regiheorihgerihgoeirngo');
  }, [allCoursesKey]);
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
        {allCoursesKey &&
          allCourses &&
          allCoursesKey.map(key => {
            console.log('isodnfoweif', key);
            return allCourses[key]?.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    navigation.navigate('CourseDetailScreen', {
                      courseData: item,
                    });
                  }}
                  key={index}
                  className="w-[100%] h-[190px] my-2 mr-2 relative rounded-xl overflow-hidden">
                  <Image
                    className=" w-[100%] h-full object-cover rounded-xl"
                    source={{
                      uri: item.coverPicture,
                    }}
                  />
                  <LinearGradient
                    className="absolute h-[100%] w-[100%] rounded-xl"
                    start={{x: 0.5, y: -0.3}}
                    colors={['#e9dcdc78', '#161414a2']}>
                    <View className="absolute h-[100%] w-[100%]  rounded-xl flex flex-col justify-end items-start px-3 pb-3">
                      <Text className="text-white font-semibold text-[22px] mb-2">
                        {item?.alternativeNameOnApp}
                      </Text>
                      <Text className="text-white font-semibold text-[13px] mb-2">
                        {item?.subheading}
                      </Text>
                      <Pressable
                        onPress={() => {
                          navigation.navigate('CourseDetailScreen', {
                            courseData: item,
                          });
                        }}
                        className="bg-blue-400 w-[90px]  py-2 rounded-xl flex justify-center items-center">
                        <Text className="text-white font-semibold text-[12px]">
                          View Course
                        </Text>
                      </Pressable>
                    </View>
                  </LinearGradient>
                </Pressable>
              );
            });
          })}
      </ScrollView>
    </View>
  );
};

export default PopularCourses;
