import {View, Text, ImageBackground, Pressable} from 'react-native';
import React from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {useSelector} from 'react-redux';
import {FONTS} from '../../utils/constants/fonts';

const RecordingCourseBanner = ({navigation}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const courseFeatures = [
    {
      label: 'Total 12 High quality Recorded Lectures',
    },
    {
      label: 'Submit and get Review for daily Homework',
    },
    {
      label: 'Get Worksheet to solve after every classs',
    },
    {
      label: 'Download and watch Lectures offline anywhere anytime',
    },
  ];
  return (
    <>
      <Pressable
        className="w-full"
        onPress={() => {
          console.log('prssed'),
            navigation.navigate('RecordedCourseDetailScreen', {
              courseName: 'English Handwriting Recorded',
              courseId: 'Eng_Hw_Rec',
            });
        }}>
        <View
          style={[
            tw`flex-col items-center rounded w-full py-2 bg-blue-200 rounded-md overflow-hidden`,
            {
              overflow: 'hidden',
              backgroundColor: textColors.textYlMain,
            },
          ]}>
          {/* <ImageBackground
          source={{
            uri: 'https://im.hunt.in/local/Gallery/3077109/l/3077109_c81b4.png',
          }}
          style={[
            tw`w-full h-[250px] shadow shadow-gray-400`,
            {resizeMode: 'contain'},
          ]}></ImageBackground> */}
          <View style={[tw`w-[80%]  pl-2`]}>
            <Text style={tw`font-bold text-[22px] text-white`}>
              Learn at your pace with our personalized recorded course
            </Text>
            <Text
              style={[
                tw`text-[20px] text-white w-full justify-center items-center`,
                {flexWrap: 'wrap', fontFamily: FONTS.dancing_script},
              ]}>
              Buy now at just{' '}
              <Text
                style={tw`text-[#F35C19] text-[18px] font-bold transform:rotate(15deg)`}>
                ₹499
              </Text>
            </Text>
          </View>
        </View>
      </Pressable>
    </>
  );
};
export default RecordingCourseBanner;

{
  /* <View
          style={[
            tw`flex-row justify-between w-[100%] items-center rounded-md p-1 py-3 pb-5`,
            ,
          ]}> */
}

{
}

{
  /* <View className="justify-center items-center w-[20%]">
            <MIcon name="video-vintage" size={50} color="white" />
          </View> */
}
{
  /* <Image
              source={require('../assets/images/bg-removebg-preview.png')}
              style={[tw`h-[120px] w-[35%]`, {resizeMode: 'cover'}]}
            /> */
}
{
  /* </View> */
}

{
  /* <View style={tw`w-full flex-col px-4 mt-4`}>
            <Text style={[tw`text-[24px] font-bold text-gray-600 text-center`,{fontFamily:FONTS.gelasio_semibold}]}>
              Course Features
            </Text>
            <View style={tw`flex-col gap-1 items-start mt-2`}>
              {courseFeatures?.map(item => {
                return (
                  <View
                    key={item.label}
                    style={tw`flex-row items-center justify-start w-full wrap mt-1`}>
                    <MIcon
                      name="check-underline"
                      size={20}
                      style={tw`w-[10%] items-center text-gray-700`}
                    />
                    <Text style={[tw`text-gray-500 text-[14px] flex flex-wrap`]}>{item.label}</Text>
                  </View>
                );
              })}
  
              <View style={tw`flex-row justify-center items-center w-full mt-3`}>
                  <TouchableHighlight style={tw`bg-blue-500 w-full items-center rounded py-3 px-3`}> 
                    <Text style={tw`text-white font-base font-semibold`}>Checkout Course</Text>
                  </TouchableHighlight>
              </View>
            </View>
          </View> */
}
