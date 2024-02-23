import {View, Text, ImageBackground, Pressable, Dimensions} from 'react-native';
import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';
import {FONTS} from '../../utils/constants/fonts';

const {width, height} = Dimensions.get('window');

const SwiperSlide = ({item, navigation}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const marginBottom = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animate = () => {
    marginBottom.value = withDelay(500, withSpring(20));
    opacity.value = withDelay(500, withSpring(1));
  };
  useEffect(() => {
    animate();
  }, []);

  const swiperBtnStyle =
    'flex-row rounded-full w-[48%] py-[7px] mr-[6px] px-[6px] justify-center items-center mt-2';
  const swiperBtnTextStyle = 'text-[15px] font-semibold';

  return (
    <View
      style={[tw`h-full flex justify-center  items-center`, {width: width}]}>
      <View style={[tw`rounded-md h-[100%] w-[100%]`, {overflow: 'hidden'}]}>
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
          }}
          style={[
            tw`w-[100%] rounded h-full justify-center items-center`,
            {flex: 1},
          ]}
          resizeMode="cover">
          <LinearGradient
            colors={['#00000014', '#000']}
            className="w-full"
            start={{x: 0.5, y: 0.1}}>
            <View
              style={[
                tw`w-full h-full justify-end items-start p-2
              `,
              ]}>
              <Animated.View
                style={{marginBottom: marginBottom, opacity: opacity}}
                className="w-full">
                <Text
                  className="text-[30px] text-white font-semibold px-2"
                  style={{fontFamily: FONTS.headingFont}}>
                  {item.title}
                </Text>
                <Text
                  className="text-base text-gray-300 px-2"
                  style={{fontFamily: FONTS.primaryFont}}>
                  {item.subheading}
                </Text>
                <View className="w-full items-center">
                  <View className="flex-row mt-3 justify-center flex-wrap w-[95%]">
                    <Pressable
                      className={`${swiperBtnStyle}`}
                      style={{
                        borderWidth: 1,
                        borderColor: textColors.textYlMain,
                        backgroundColor: textColors.textYlMain,
                      }}
                      onPress={() =>
                        navigation.navigate('CourseDetailScreen', {
                          courseData: item,
                          subScreenToShow: 'courseDetails',
                        })
                      }>
                      {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                      <Text
                        className={`${swiperBtnTextStyle} font-semibold`}
                        style={{
                          color: "white",
                          // color: textColors.textYlMain,
                          fontFamily: FONTS.primaryFont,
                        }}>
                        Course Details
                      </Text>
                    </Pressable>
                    {item?.courseAvailable && (
                      <Pressable
                        className={`${swiperBtnStyle}`}
                        style={{
                          borderWidth: 1,
                          borderColor: textColors.textYlMain,
                          backgroundColor:textColors?.textYlMain
                        }}
                        onPress={() =>
                          navigation.navigate('CourseDetailScreen', {
                            courseData: item,
                            subScreenToShow: 'payAndEnroll',
                          })
                        }>
                        {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                        <Text
                          className={`${swiperBtnTextStyle} font-semibold`}
                          style={{
                            color: "white",
                            fontFamily: FONTS.primaryFont,
                          }}>
                          Pay and Enroll
                        </Text>
                      </Pressable>
                    )}
                  </View>

                  <View className="mt-3 w-[95%] items-center">
                    {item?.demoAvailable && (
                      <Pressable
                        className={`${swiperBtnStyle} w-[100%]`}
                        style={{
                          borderWidth: 1,
                          borderColor: textColors.textYlMain,
                          backgroundColor: textColors.textYlMain,
                        }}
                        onPress={() =>
                          navigation.navigate('CourseDetailScreen', {
                            courseData: item,
                            subScreenToShow: 'bookFreeClass',
                          })
                        }>
                        {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                        <Text
                          className={`${swiperBtnTextStyle} text-[18px]`}
                          style={{
                            color: 'white',
                            fontFamily: FONTS.primaryFont,
                          }}>
                          Book Free Class
                        </Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Animated.View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    </View>
  );
};

export default SwiperSlide;
