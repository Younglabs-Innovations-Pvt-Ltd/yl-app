import {View, Text, ImageBackground, Pressable, Dimensions} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import tw from 'twrnc';

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
  animate();

  //   {
  //     name: 'Banner 1',
  //     coverImage: 'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
  //     type: 'course',
  //     screenRedirectButton: '',
  //     age_max: 14,
  //     age_min: 5,
  //     alternativeNameOnApp: 'English Handwriting',
  //     courseAvailable: true,
  //     courseAvailableType: 'both',
  //     coverPicture:
  //       'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
  //     demoAvailable: true,
  //     demoAvailableType: 'both',
  //     duration_minutes: 60,
  //     id: 'Eng_Hw',
  //     live_classes: 24,
  //     subheading:
  //       'Handwriting improvement tutoring and fine motor skills practice for children who face problems with handwriting.',
  //     title: 'English Cursive Handwriting Course',
  //   },

  return (
    <View
      style={[tw`h-full flex justify-center  items-center`, {width: width}]}>
      <View style={[tw`rounded-md h-[100%] w-[95%]`, , {overflow: 'hidden'}]}>
        <ImageBackground
          source={{
            uri: item.coverImage,
          }}
          style={[
            tw`w-[100%] rounded h-full justify-center items-center`,
            {flex: 1},
          ]}
          resizeMode="cover">
          <LinearGradient
            colors={['#00000014', '#000000db']}
            className="w-full"
            start={{x: 0.5, y: 0.1}}>
            <View
              style={[
                tw`w-full h-full justify-end items-start p-2
              `,
              ]}>
              <Animated.View
                style={{marginBottom: marginBottom, opacity: opacity}}>
                <Text className="text-[32px] text-white font-[600]">
                  {item.title}
                </Text>
                <Text className="text-[16px] text-gray-300">
                  {item.subheading}
                </Text>
                <View className="flex-row gap-2 mt-1 justify-center">
                  <Pressable
                    className="flex-row rounded-full py-2 px-3 justify-center items-center mt-3 border"
                    style={{borderColor: textColors.textYlMain}}>
                    {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                    <Text
                      className="text-base font-semibold"
                      style={{color: textColors.textYlMain}}>
                      Connect with us
                    </Text>
                  </Pressable>
                  <Pressable
                    className="flex-row rounded-full py-2 px-3 justify-center items-center mt-3 border"
                    style={{borderColor: textColors.textYlMain}}
                    onPress={()=>{navigation.navigate("CourseDetailScreen" , {courseData:item , subScreenToShow:"payAndEnroll"})}}
                    >
                    {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                    <Text
                      className="text-base font-semibold"
                      style={{color: textColors.textYlMain}}>
                      Pay And Enroll
                    </Text>
                  </Pressable>
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
