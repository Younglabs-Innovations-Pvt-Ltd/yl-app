import {View, Text, Image, Pressable} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';


const NoBatchesModule = ({courseData}) => {
  const {darkMode, bgColor, textColors, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  //   console.log('CourseData jer ', courseData);
  return (
    <View className="flex-1 px-2">
      <View style={{paddingVertical: 16}} className="w-full">
        <Image
          source={require('../assets/images/contactUs.jpg')}
          resizeMode="cover"
          className="w-full h-[250px] rounded"
        />
      </View>
      <Text
        className="text-2xl text-center font-semibold"
        style={{color: textColors.textYlMain}}>
        Chat with us on WhatsApp for batches of this course.
      </Text>
      <Text
        className="text-base text-center mt-3"
        style={{color: textColors.textSecondary}}>
        Need help with timings, prices or if have questions, contact on WhatsApp
        or request callback
      </Text>

      <View className="w-full flex-row justify-center gap-4 mt-0">
        <Pressable
          className="rounded-full items-center mt-3 flex-row py-1 p-3"
          style={{backgroundColor: textColors.textYlGreen}}>
          <MIcon name="whatsapp" size={22} color="white" />
          <Text className="text-white text-base ml-1">Chat with us</Text>
        </Pressable>

        <Pressable
          className="rounded-full items-center mt-3 flex-row py-1 p-3"
          style={{backgroundColor: textColors.textYlOrange}}>
          <MIcon name="phone-outline" size={22} color="white" />
          <Text className="text-white text-base ml-1">Request a call</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default NoBatchesModule;
