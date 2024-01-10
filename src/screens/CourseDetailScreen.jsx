import {View, Text, Pressable} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {COLORS} from '../utils/constants/colors';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MainWelcomeScreen from './MainWelcomeScreen';
import {Animated, TouchableOpacity} from 'react-native';
import CourseDetails from './course-details.screen';
import {navigate} from '../navigationRef';
import BookDemoScreen from './book-demo-form.screen';
import Payment from './payment.screen';
import BatchFeeDetails from './batch-fees-details.screen';
import {useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialTopTabNavigator();
const BANNER_H = 160;
const TOPNAV_H = 50;
const CourseDetailsScreen = ({route, navigation}) => {
  const {darkMode, textColors, bgColor, colorYlMain} = useSelector(
    state => state.appTheme,
  );
  const {courseData} = route.params;
  const [selectedTab, setSelectedTab] = useState('courseDetails');

  const scrollA = useRef(new Animated.Value(0)).current;

  return (
    <View className="w-full flex-1" style={{backgroundColor: bgColor}}>
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <View
          style={[styles.bannerContainer, {backgroundColor: colorYlMain}]}
          className="w-full relative">
          <FeatureTray
            scrollA={scrollA}
            setSelectedTab={setSelectedTab}
            selectedTab={selectedTab}
          />
          <View
            className="absolute -bottom-4  py-4 rounded-full w-[100%]"
            style={{backgroundColor: bgColor}}></View>
        </View>
        <View className="flex-1 relative rounded-t-2xl pt-4 px-2 mb">
          <View className="flex-1">
            {selectedTab === 'courseDetails' ? (
              <CourseDetails
                navigation={navigation}
                courseId={courseData.courseId}
              />
            ) : selectedTab === 'bookFreeClass' ? (
              <BookDemoScreen
                navigation={navigation}
                data={{country: {callingCode: 91}, phone: 7668983758}}
                courseId={courseData.courseId}
                setSelectedTab={setSelectedTab}
              />
            ) : selectedTab === 'payAndEnroll' ? (
              <BatchFeeDetails
                navigation={navigation}
                courseData={courseData}
              />
            ) : (
              ''
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export const FeatureTray = ({scrollA, setSelectedTab, selectedTab}) => {
  const {darkMode, textColors, bgColor} = useSelector(state => state.appTheme);
  return (
    <Animated.View
      style={[styles.banner(scrollA)]}
      className="flex justify-center items-center w-full">
      <View className="flex flex-row justify-around w-full">
        <Pressable
          className="w-[30%]"
          onPress={() => setSelectedTab('courseDetails')}>
          <View
            className={`py-1 rounded-full px-1 items-center w-full`}
            style={{
              backgroundColor:
                selectedTab === 'courseDetails'
                  ? textColors.textYlGreen
                  : 'white',
            }}>
            <View className="w-[100%] flex-row justify-between">
              <View className="w-[25%] justify-center">
                <MIcon
                  name="sort-alphabetical-descending"
                  size={30}
                  color={
                    selectedTab === 'courseDetails'
                      ? 'white'
                      : textColors.textYlGreen
                  }
                />
              </View>
              <Text
                className="w-[70%] text-[15px] font-semibold"
                style={{
                  color:
                    selectedTab === 'courseDetails'
                      ? 'white'
                      : textColors.textYlGreen,
                }}>
                Course Details
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          className="w-[30%]"
          onPress={() => setSelectedTab('bookFreeClass')}>
          <View
            className={`py-1 rounded-full px-1 items-center w-full`}
            style={{
              backgroundColor:
                selectedTab === 'bookFreeClass'
                  ? textColors.textYlOrange
                  : 'white',
            }}>
            <View className="w-[100%] flex-row justify-between">
              <View className="w-[25%] justify-center">
                <MIcon
                  name="sort-alphabetical-descending"
                  size={30}
                  color={
                    selectedTab === 'bookFreeClass'
                      ? 'white'
                      : textColors.textYlOrange
                  }
                />
              </View>
              <Text
                className="w-[70%] text-[15px] font-semibold"
                style={{
                  color:
                    selectedTab === 'bookFreeClass'
                      ? 'white'
                      : textColors.textYlOrange,
                }}>
                Book Free class
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          className="w-[30%]"
          onPress={() => setSelectedTab('payAndEnroll')}>
          <View
            className={`py-1 rounded-full px-1 items-center w-full`}
            style={{
              backgroundColor:
                selectedTab === 'payAndEnroll' ? textColors.textYlRed : 'white',
            }}>
            <View className="w-[100%] flex-row justify-between">
              <View className="w-[25%] justify-center">
                <MIcon
                  name="sort-alphabetical-descending"
                  size={30}
                  color={
                    selectedTab === 'payAndEnroll'
                      ? 'white'
                      : textColors.textYlRed
                  }
                />
              </View>
              <Text
                className="w-[70%] text-[15px] font-semibold"
                style={{
                  color:
                    selectedTab === 'payAndEnroll'
                      ? 'white'
                      : textColors.textYlRed,
                }}>
                Pay & Enroll
              </Text>
            </View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default CourseDetailsScreen;

const styles = {
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    overflow: 'hidden',
  },
  banner: scrollA => ({
    height: BANNER_H,
    width: '100%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
  icon: {
    width: '100%',
    height: '100%',
  },
};

// <View className="flex-1 flex-col" style={{backgroundColor: COLORS.pblue}}>
//   <View className="items-center justify-center h-[20%]">
//     <View className="flex-row justify-around w-full">
//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'courseDetail' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('courseDetail')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'courseDetail' ? 'text-white' : ''
//           }`}>
//           Course Details
//         </Text>
//       </Pressable>

//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'bookDemo' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('bookDemo')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'bookDemo' ? 'text-white' : ''
//           }`}>
//           Book Demo
//         </Text>
//       </Pressable>

//       <Pressable
//         className={`${buttonStyle} ${
//           selectedTab === 'paymentTab' ? 'bg-orange-600' : 'bg-white'
//         }`}
//         onPress={() => setSelectedTab('paymentTab')}>
//         <Text
//           className={`${buttonTextStyle} ${
//             selectedTab === 'paymentTab' ? 'text-white' : ''
//           }`}>
//           Pay & Enroll
//         </Text>
//       </Pressable>
//     </View>
//   </View>

//   {/* Tab Switch Section */}
//   <View className="flex-1 rounded-t-[26px] bg-white justify-end">
//     <ScrollView className="h-[95%] px-1">
//       {selectedTab === 'courseDetail' ? (
//         <CourseDetailTab />
//       ) : selectedTab === 'bookDemo' ? (
//         <BookDemoTab />
//       ) : selectedTab === 'paymentTab' ? (
//         <PaymentTab />
//       ) : (
//         <CourseDetailTab />
//       )}
//     </ScrollView>
//   </View>
// </View>

// Tab navigator
{
  /* <Tab.Navigator
      screenOptions={{
        tabBarStyle: {backgroundColor: bgColor},
        tabBarIndicatorStyle:{
          backgroundColor:textColors.textYlMain
        }
      }}
      backBehavior="firstRoute">
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className={`flex flex-row items-center gap-[2px]`}>
                <MIcon
                  name="sort-alphabetical-descending"
                  size={20}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Course Details
                </Text>
              </View>
            );
          },
        }}
        name="Course Details"
        component={CourseDetailTab}
      />
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className="flex flex-row items-center gap-[4px]">
                <MIcon
                  name="google-classroom"
                  size={18}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Book Free class
                </Text>
              </View>
            );
          },
        }}
        name="Book Demo"
        component={BookDemoTab}
      />
      <Tab.Screen
        options={{
          title: ({color, focused}) => {
            return (
              <View className="flex flex-row items-center gap-[2px]">
                <MIcon
                  name="cash-check"
                  size={20}
                  color={
                    focused ? textColors.textYlMain : textColors.textSecondary
                  }
                />
                <Text
                  style={
                    focused
                      ? {color: textColors.textYlMain, fontWeight: 600}
                      : {color: textColors.textSecondary}
                  }>
                  Pay & Enroll
                </Text>
              </View>
            );
          },
        }}
        name="Pay & Enroll"
        component={PaymentTab}
      />
    </Tab.Navigator> */
}

// tabs
// function MyTabBar({state, descriptors, navigation, position}) {
//   const {bgColor, bgSecondaryColor, darkMode, textColors} = useSelector(
//     state => state.appTheme,
//   );
//   return (
//     <View
//       style={{flexDirection: 'row'}}
//       className={`${
//         darkMode ? `bg-[${bgSecondaryColor}]` : 'bg-gray-100'
//       } w-[100%] rounded-full mt-2 p-1 mb-[4px]`}>
//       {state.routes.map((route, index) => {
//         const {options} = descriptors[route.key];
//         const label =
//           options.tabBarLabel !== undefined
//             ? options.tabBarLabel
//             : options.title !== undefined
//             ? options.title
//             : route.name;

//         const isFocused = state.index === index;
//         const onPress = () => {
//           const event = navigation.emit({
//             type: 'tabPress',
//             target: route.key,
//             canPreventDefault: true,
//           });

//           if (!isFocused && !event.defaultPrevented) {
//             navigation.navigate(route.name, route.params);
//           }
//         };

//         const onLongPress = () => {
//           navigation.emit({
//             type: 'tabLongPress',
//             target: route.key,
//           });
//         };

//         const inputRange = state.routes.map((_, i) => i);
//         const opacity = position.interpolate({
//           inputRange,
//           outputRange: inputRange.map(i => (i === index ? 1 : 0)),
//         });

//         const animatedOpacity = new Animated.Value(0);
//         // useEffect(() => {
//         //   if (isFocused) {
//         //     animatedOpacity.stopAnimation(); // Stop any previous animation
//         //     Animated.timing(animatedOpacity, {
//         //       toValue: 1,
//         //       duration: 300,
//         //       useNativeDriver: true,
//         //     }).start();
//         //   } else {
//         //     Animated.timing(animatedOpacity, {
//         //       toValue: 0,
//         //       duration: 300,
//         //       useNativeDriver: true,
//         //       onComplete: () => {
//         //         // Unmount the component after the animation finishes
//         //         // setIsFocused(false);
//         //       },
//         //     }).start();
//         //   }
//         // }, [isFocused, animatedOpacity]);
//         return (
//           <TouchableOpacity
//             accessibilityRole="button"
//             accessibilityState={isFocused ? {selected: true} : {}}
//             accessibilityLabel={options.tabBarAccessibilityLabel}
//             testID={options.tabBarTestID}
//             onPress={onPress}
//             onLongPress={onLongPress}
//             style={{flex: 1}}
//             key={index}>
//             <View className="py-2 relative">
//               <Text
//                 className={`text-center w-full font-semibold text-[15px]`}
//                 style={
//                   isFocused
//                     ? {color: textColors.textYlMain}
//                     : {color: textColors.textSecondary}
//                 }>
//                 {label}
//               </Text>

//               {isFocused && (
//                 <Animated.View
//                   className="absolute w-full items-center -bottom-[3px]"
//                   // style={{opacity: animatedOpacity}}
//                 >
//                   <View
//                     className="w-[60%] p-[4px] rounded-t-lg"
//                     style={{backgroundColor: textColors.textYlMain}}></View>
//                 </Animated.View>
//               )}
//             </View>
//           </TouchableOpacity>
//         );
//       })}
//     </View>
//   );
// }
