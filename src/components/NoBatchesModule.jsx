import {View, Text, Image, Pressable, Linking} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../utils/constants/fonts';
import {getWhatsappRedirectUrl} from '../utils/redirect-whatsapp';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';

const NoBatchesModule = ({courseData}) => {
  const {textColors} = useSelector(state => state.appTheme);
  const toast = useToast();

  const reqBatchPrices = async () => {
    try {
      console.log('hit');
      message = `Hi! i need to know the Prices of your ${courseData?.alternativeNameOnApp} Course.`;
      const link = getWhatsappRedirectUrl(message);
      await Linking.openURL(link);
      console.log('link is', link);
    } catch (error) {
      Showtoast({
        text: "Couldn't Complete the Request, Please ensure you have Whatsapp app and try again",
        toast,
        type: 'danger',
      });
    }
  };
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
        className="text-center font-semibold"
        style={[FONTS.heading, {color: textColors.textYlMain}]}>
        Chat with us on WhatsApp for batches of this course.
      </Text>
      <Text
        className="text-base text-center mt-3"
        style={{
          color: textColors.textSecondary,
          fontFamily: FONTS.primaryFont,
        }}>
        Need help with timings, prices or if have questions, contact on WhatsApp
        or request callback
      </Text>

      <View className="w-full flex-row justify-center gap-4 mt-0">
        <Pressable
          className="rounded-full items-center mt-3 flex-row py-1 p-3"
          style={{backgroundColor: textColors.textYlGreen}}
          onPress={reqBatchPrices}>
          <MIcon name="whatsapp" size={22} color="white" />
          <Text
            className="text-white text-base ml-1"
            style={{fontFamily: FONTS.primaryFont}}>
            Chat with us
          </Text>
        </Pressable>

        {/* <Pressable
          className="rounded-full items-center mt-3 flex-row py-1 p-3"
          style={{backgroundColor: textColors.textYlOrange}}>
          <MIcon name="phone-outline" size={22} color="white" />
          <Text className="text-white text-base ml-1" style={{fontFamily:FONTS.primaryFont}}>Request a call</Text>
        </Pressable> */}
      </View>
    </View>
  );
};

export default NoBatchesModule;
