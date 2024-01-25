import React from 'react';
import {ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native-animatable';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import RoadMapBG from '../../assets/images/roadMapBackground.jpeg';
import RoadMapBGDark from '../../assets/images/roadMapBackgroundDark.jpeg';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const SnakeLevels = ({navigation, darkMode, allClasses}) => {
  const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
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
    <View className="h-[100%] w-[100%] bg-white rounded-t-xl overflow-hidden">
      <ImageBackground
        className="rounded-t-xl"
        // resizeMode="cover"
        style={styles.backgroundImage}
        source={darkMode ? RoadMapBGDark : RoadMapBG}>
        {allClasses?.map((level, index) => {
          count = count >= marginleftcustom.length - 1 ? 0 : count + 1;
          return (
            <View
              key={level?.classNumber}
              className="w-[100%] my-3 bg-transparent">
              <View
                style={[{marginLeft: marginleftcustom[count]}, styles.myView]}
                className={`h-[80px] w-[80px] top-[30px] absolute ${
                  level?.classStatus === 'Upcoming' &&
                  allClasses[index - 1]?.classStatus === 'Attended'
                    ? 'bg-[#78c347]'
                    : level?.classStatus === 'Rescheduled'
                    ? 'bg-[#76C8F2]'
                    : level?.classStatus === 'Missed'
                    ? 'bg-[#a95233]'
                    : level?.classStatus === 'Ongoing'
                    ? 'bg-[#00FF00]'
                    : level?.classStatus === 'Attended'
                    ? 'bg-[#6d6ded]'
                    : 'bg-[#8b8888]'
                }   rounded-full`}></View>
              <TouchableOpacity
                // disabled={level?.classStatus === 'Ongoing' ? false : true}
                onPress={() => {
                  navigation.navigate(SCREEN_NAMES.COURSE_CONDUCT_PAGE);
                }}
                style={[{marginLeft: marginleftcustom[count]}, styles.myView]}
                className={`p-4 ${
                  level?.classStatus === 'Upcoming' &&
                  allClasses[index - 1]?.classStatus === 'Attended'
                    ? 'bg-[#55D400]'
                    : level?.classStatus === 'Rescheduled'
                    ? 'bg-[#76C8F2]'
                    : level?.classStatus === 'Missed'
                    ? 'bg-[#F74300]'
                    : level?.classStatus === 'Ongoing'
                    ? 'bg-[#00FF00]'
                    : level?.classStatus === 'Attended'
                    ? 'bg-blue-500'
                    : 'bg-[#AEAEAE]'
                }  h-[80px] w-[80px] mt-6 rounded-full flex justify-center items-center relative`}>
                <MIcon
                  name={
                    level.classStatus === 'Attended'
                      ? 'lock-open-variant'
                      : 'lock'
                  }
                  size={30}
                  color={'white'}
                />
                {level?.classStatus === 'Ongoing' ||
                  (level?.classStatus === 'Upcoming' &&
                    allClasses[index - 1]?.classStatus === 'Attended' && (
                      <View className="absolute -top-9 flex justify-center items-center animate-bounce">
                        <View className="h-[40px] w-[40px] rotate-[45deg] bg-[#76C8F2] rounded-[5px] absolute top-3 border-2 border-gray-300 border-solid "></View>
                        <View className="h-[50px] w-[100px] flex flex-row justify-center items-center rounded-xl border-2 border-gray-300 border-solid  bg-[#76C8F2]">
                          <Text className="font-semibold text-[16px]">
                            Upcoming
                          </Text>
                        </View>
                      </View>
                    ))}
              </TouchableOpacity>
            </View>
          );
        })}
      </ImageBackground>
    </View>
  );
};

export default SnakeLevels;
