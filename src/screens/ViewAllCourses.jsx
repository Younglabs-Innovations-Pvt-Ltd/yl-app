import {View, Text, ImageBackground, Pressable} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {ScrollView} from 'react-native-gesture-handler';

const ViewAllCourses = ({route, navigation}) => {
  const {darkMode, bgColor, textColors} = useSelector(state => state.appTheme);
  const {courses} = route.params;
  return (
    <ScrollView>
      <View className="flex-1 items-center" style={{backgroundColor: bgColor}}>
        <View className="w-[90%] items-center pb-4">
          {courses?.map((item, index) => {
            return (
              <CourseItemShow data={item} key={index} navigation={navigation} />
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

const CourseItemShow = ({data, navigation}) => {
  //   console.log('we have data', data);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );

  const marginLeft = useSharedValue(10);
  const opacity = useSharedValue(0);

  const animate = () => {
    marginLeft.value = withDelay(500, withSpring(0));
    opacity.value = withDelay(500, withSpring(1));
  };
  animate();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('CourseDetailScreen', {
          courseData: data,
        });
      }}
      className="w-full">
      <View
        className="w-full overflow-hidden mt-3 h-[200px] rounded-xl"
        style={{backgroundColor: bgSecondaryColor, elevation: 4}}>
        <ImageBackground
          source={{
            uri: data.thumbnailUrl,
          }}
          className="w-[100%] rounded h-full justify-center items-center"
          style={{flex: 1}}
          resizeMode="cover">
          <LinearGradient
            colors={['#00000014', '#000000']}
            className="w-full h-full"
            start={{x: 0.5, y: -0.3}}
          >
            <View className="flex-1 items-start justify-end">
              <Animated.View
                className="p-2 items-start  w-full mb-2"
                style={{marginLeft: marginLeft, opacity: opacity}}>
                <Text className="text-white text-[24px] font-bold " style={{}}>
                  {data.name}
                </Text>
                {data.description && (
                  <Text className="text-gray-200">{data.description}</Text>
                )}
                <Pressable
                  className="flex-row rounded-full py-2 px-4 justify-center items-center mt-1"
                  style={{backgroundColor: textColors.textYlMain}}>
                  {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                  <Text className="text-[12px] font-semibold text-white">
                    View Course
                  </Text>
                </Pressable>
              </Animated.View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

export default ViewAllCourses;
