import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text, View} from 'react-native-animatable';
import {SCREEN_NAMES} from '../../utils/constants/screen-names';
import RoadMapBG from '../../assets/images/roadMapBackground.jpeg';
import RoadMapBGDark from '../../assets/images/roadMapBackgroundDark.jpeg';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment, {min} from 'moment';
import {getAcsToken} from '../../utils/api/yl.api';
import {startCallComposite} from '../../natiive-modules/team-module';
import {authSelector} from '../../store/auth/selector';
import {useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import {BASE_URL} from '@env';

const SnakeLevels = ({
  navigation,
  darkMode,
  allClasses,
  askForRating,
  setAskForRating,
  setPreviousClassData,
}) => {
  const [previousClass, setPreviousClass] = useState(null);
  const [currentOngoingClass, setCurrentOngoingClass] = useState(null);
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [todaysClass, setTodaysClass] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [allTagValues, setAllTagsValues] = useState([]);
  const user = useSelector(authSelector);

  const convertTimeStamp = time => {
    const {_seconds, _nanoseconds} = time;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    return milliseconds;
  };

  const getTimeRemaining = date => {
    let convertedTime = convertTimeStamp(date);
    convertedTime = moment(convertedTime).subtract(5, 'minutes');
    const countDownTime = new Date(convertedTime).getTime();
    const now = Date.now();

    const remainingTime = countDownTime - now;

    const days = Math.floor((remainingTime / (1000 * 60 * 60 * 24)) % 24);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    if (remainingTime <= 0) {
      return {days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime};
    }

    return {days, hours, minutes, seconds, remainingTime};
  };

  useEffect(() => {
    let timer;
    if (todaysClass) {
      timer = setInterval(() => {
        const remaining = getTimeRemaining(todaysClass?.classDate);
        if (remaining.remainingTime <= 0) {
          console.log('time over');
          clearInterval(timer);
          return;
        }
        setTimeLeft(remaining);
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [todaysClass]);

  const markAttendance = async () => {
    console.log('user?.user?.leadId', {
      leadId: user?.user?.leadId,
      classId: currentOngoingClass?.classId,
    });
    console.log('currentOngoingClass?.classId', currentOngoingClass?.classId);
    const token = await auth().currentUser.getIdToken();
    console.log('token', token);
    try {
      const API_URL = `${BASE_URL}/app/mycourse/classattendance`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          leadId: user?.user?.leadId,
          classId: currentOngoingClass?.classId,
        }),
      });
      if (response.status === 200) {
        console.log('Attendence marked');
      }
      return response;
    } catch (error) {
      console.log('Cant mark student Attendence');
    }
  };

  // getAcsToken
  const conductOnTeamsSDK = async () => {
    markAttendance()
      .then(async response => {
        if (currentOngoingClass?.conductOnWebsiteTemasSDK) {
          const response = await getAcsToken();
          const {token} = await response.json();
          console.log(
            'Conducting on teams SDK',
            user?.childName,
            user?.user?.leadId,
          );
          startCallComposite(
            user?.childName ? user?.childName : 'Children',
            currentOngoingClass.teamUrl,
            token,
          );
        } else {
          console.log('on web');
          Linking.openURL(currentOngoingClass?.teamsUrl).catch(err =>
            console.error('An error occurred: ', err),
          );
        }
      })
      .catch(error => {
        console.log('attendence not marked', error.message);
      });
  };

  const handleClass = () => {
    for (let i = 0; i < allClasses?.length; i++) {
      const classDate = convertTimeStamp(allClasses[i].classDate);
      const updatedClassDate = new Date(classDate);
      const currentClassTime =
        (updatedClassDate.getTime() - new Date().getTime()) / (60 * 1000);
      const todaysClassTimeBefore = currentClassTime < 5;
      const isCurrentClassOngoing =
        currentClassTime >= -60 && currentClassTime < 5;
      if (isCurrentClassOngoing) {
        if (allClasses[i].classNumber < allClasses.length) {
          setUpcomingClass(allClasses[i + 1]);
        }
        if (allClasses[i].classNumber !== 1) {
          setPreviousClass(allClasses[i - 1]);
        }
        setCurrentOngoingClass(allClasses[i]);
        break;
      } else if (
        moment(classDate).startOf('day').isSame(moment().startOf('day')) &&
        !todaysClassTimeBefore
      ) {
        setTodaysClass(allClasses[i]);
        if (allClasses[i].classNumber < allClasses.length) {
          setUpcomingClass(allClasses[i + 1]);
        }
        if (allClasses[i].classNumber !== 1) {
          setPreviousClass(allClasses[i - 1]);
        }
        break;
      } else if (moment(classDate).isAfter(moment())) {
        if (allClasses[i].classNumber !== 1) {
          setPreviousClass(allClasses[i - 1]);
        }
        setUpcomingClass(allClasses[i]);
        break;
      } else {
        if (allClasses[i].classNumber === allClasses.length) {
          setPreviousClass(allClasses[i]);
        }
      }
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      handleClass();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [allClasses]);

  useEffect(() => {
    if (previousClass) {
      if (previousClass?.attendance == true && previousClass?.rating == null) {
        setAskForRating(true);
        setPreviousClassData(previousClass);
      }
    }
  }, [previousClass]);

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
      <Pressable
        onPress={() => {
          const falseAllTags = allTagValues.map(tagValue => {
            return tagValue.replace('true', 'false');
          });
          setAllTagsValues(falseAllTags);
        }}>
        <ImageBackground
          className="rounded-t-xl"
          // resizeMode="cover"
          style={styles.backgroundImage}
          source={darkMode ? RoadMapBGDark : RoadMapBG}>
          {allClasses &&
            allClasses?.map((level, index) => {
              count = count >= marginleftcustom.length - 1 ? 0 : count + 1;
              return (
                <View
                  key={level?.classId}
                  className="w-[100%] my-3 bg-transparent">
                  <View
                    style={[
                      {marginLeft: marginleftcustom[count]},
                      styles.myView,
                    ]}
                    className={`h-[80px] w-[80px] top-[30px] absolute ${
                      level?.classStatus === 'Upcoming' && level === 'Attended'
                        ? 'bg-[#78c347]'
                        : level?.classStatus === 'Rescheduled'
                        ? 'bg-[#76C8F2]'
                        : level?.classStatus === 'Missed'
                        ? 'bg-[#a95233]'
                        : level?.classStatus === 'Ongoing' ||
                          currentOngoingClass?.classNumber ===
                            level?.classNumber
                        ? 'bg-[#71cb35]'
                        : level?.classStatus === 'Attended'
                        ? 'bg-[#6d6ded]'
                        : 'bg-[#8b8888]'
                    }   rounded-full`}></View>
                  <TouchableOpacity
                    // disabled={true}
                    onPress={() => {
                      const showTagValue = `${level?.classId} true`;
                      const textVariable = [...allTagValues, showTagValue];

                      const allNewTags = textVariable.map(tagValue => {
                        if (tagValue.includes(level?.classId)) {
                          return tagValue.replace('false', 'true');
                        } else {
                          return tagValue.replace('true', 'false');
                        }
                      });
                      setAllTagsValues(allNewTags);
                    }}
                    style={[
                      {marginLeft: marginleftcustom[count]},
                      styles.myView,
                    ]}
                    className={`p-4
                ${
                  level?.classStatus === 'Upcoming'
                    ? 'bg-[#AEAEAE]'
                    : level?.classStatus === 'Missed'
                    ? 'bg-[#F74300]'
                    : level?.classStatus === 'Ongoing' ||
                      currentOngoingClass?.classNumber === level?.classNumber
                    ? 'bg-[#55D400]'
                    : level?.classStatus === 'Attended'
                    ? 'bg-blue-500'
                    : level?.classStatus === 'Rescheduled'
                    ? 'bg-[#76C8F2]'
                    : null
                }

                  h-[80px] w-[80px] mt-6 rounded-full flex justify-center items-center relative`}>
                    <MIcon
                      name={
                        level.classStatus === 'Attended'
                          ? 'lock-open-variant'
                          : 'lock'
                      }
                      size={30}
                      color={'white'}
                    />
                    {!currentOngoingClass &&
                      todaysClass &&
                      todaysClass.classNumber === level?.classNumber && (
                        <View className="absolute -top-11 flex justify-center items-center animate-bounce">
                          <View className="h-[40px] w-[40px] rotate-[45deg] bg-[#76C8F2] rounded-[5px] absolute top-6 border-2 border-gray-300 border-solid "></View>
                          {todaysClass?.visibility ? (
                            <View className="h-[60px] w-[160px] flex flex-col justify-center items-center rounded-xl border-2 border-gray-300 border-solid  bg-[#76C8F2]">
                              <Text className="font-semibold text-[16px]">
                                Class Starts In
                              </Text>
                              <Text className="font-semibold text-[16px]">
                                {timeLeft
                                  ? timeLeft?.days +
                                    ':' +
                                    timeLeft?.hours +
                                    ':' +
                                    timeLeft?.minutes +
                                    ':' +
                                    timeLeft?.seconds
                                  : '0:0:0:0'}
                              </Text>
                            </View>
                          ) : (
                            <View className="h-[60px] w-[90px] flex flex-col justify-center items-center rounded-xl border-2 border-gray-300 border-solid  bg-[#76C8F2]">
                              <Text className="font-semibold text-[20px]">
                                TBD
                              </Text>
                            </View>
                          )}
                        </View>
                      )}

                    {!todaysClass &&
                      !currentOngoingClass &&
                      upcomingClass &&
                      upcomingClass.classNumber === level?.classNumber && (
                        <View className="absolute -top-11 flex justify-center items-center animate-bounce">
                          <View className="h-[40px] w-[40px] rotate-[45deg] bg-[#76C8F2] rounded-[5px] absolute top-6 border-2 border-gray-300 border-solid "></View>
                          <View className="h-[60px] w-[130px] flex flex-row justify-center items-center rounded-xl border-2 border-gray-300 border-solid  bg-[#76C8F2]">
                            {upcomingClass?.visibility ? (
                              <View>
                                <Text className="font-semibold text-[16px]">
                                  {moment(
                                    convertTimeStamp(upcomingClass?.classDate),
                                  ).format('ddd MMM D')}
                                </Text>
                                <Text className="font-semibold text-[16px]">
                                  Upcoming
                                </Text>
                              </View>
                            ) : (
                              <Text className="font-semibold text-[20px]">
                                TBD
                              </Text>
                            )}
                          </View>
                        </View>
                      )}
                    {currentOngoingClass &&
                      currentOngoingClass.classNumber ===
                        level?.classNumber && (
                        <Pressable
                          disabled={
                            level?.classNumber ==
                            currentOngoingClass?.classNumber
                              ? false
                              : true
                          }
                          onPress={() => {
                            if (
                              currentOngoingClass &&
                              level?.classNumber ===
                                currentOngoingClass.classNumber
                            ) {
                              conductOnTeamsSDK();
                            }
                            console.log('join now');
                          }}
                          className="absolute -top-9 flex justify-center items-center">
                          <View className="h-[40px] w-[40px] rotate-[45deg] bg-[#76C8F2] rounded-[5px] absolute top-3 border-2 border-gray-300 border-solid "></View>
                          <View className="h-[50px] w-[100px] flex flex-row justify-center items-center rounded-xl border-2 border-gray-300 border-solid  bg-[#76C8F2]">
                            <Text className="font-semibold text-[16px]">
                              Join now
                            </Text>
                          </View>
                        </Pressable>
                      )}
                    {upcomingClass &&
                      upcomingClass.classNumber !== level?.classNumber &&
                      !currentOngoingClass &&
                      !todaysClass &&
                      allTagValues.includes(`${level?.classId} true`) && (
                        <Pressable
                          disabled={false}
                          className="absolute -top-9 flex justify-center items-center">
                          <View
                            className={`h-[40px] w-[40px] rotate-[45deg] ${
                              level?.classStatus === 'Upcoming'
                                ? 'bg-[#AEAEAE]'
                                : level?.classStatus === 'Missed'
                                ? 'bg-[#F74300]'
                                : level?.classStatus === 'Ongoing' ||
                                  currentOngoingClass?.classNumber ===
                                    level?.classNumber
                                ? 'bg-[#55D400]'
                                : level?.classStatus === 'Attended'
                                ? 'bg-blue-500'
                                : level?.classStatus === 'Rescheduled'
                                ? 'bg-[#76C8F2]'
                                : null
                            } rounded-[5px] absolute top-3 border-2 border-gray-300 border-solid `}></View>
                          <View
                            className={`h-[50px] w-[100px] flex flex-row justify-center items-center rounded-xl border-2 border-gray-300 border-solid  ${
                              level?.classStatus === 'Upcoming'
                                ? 'bg-[#AEAEAE]'
                                : level?.classStatus === 'Missed'
                                ? 'bg-[#F74300]'
                                : level?.classStatus === 'Ongoing' ||
                                  currentOngoingClass?.classNumber ===
                                    level?.classNumber
                                ? 'bg-[#55D400]'
                                : level?.classStatus === 'Attended'
                                ? 'bg-blue-500'
                                : level?.classStatus === 'Rescheduled'
                                ? 'bg-[#76C8F2]'
                                : null
                            } `}>
                            <Text className="font-semibold text-[16px] text-white">
                              {level?.classStatus}
                            </Text>
                          </View>
                        </Pressable>
                      )}
                  </TouchableOpacity>
                </View>
              );
            })}
        </ImageBackground>
      </Pressable>
    </View>
  );
};

export default SnakeLevels;
