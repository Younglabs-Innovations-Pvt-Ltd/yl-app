import {
  View,
  Text,
  Pressable,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import {ScrollView} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import BottomSheetComponent from '../components/BottomSheetComponent';
import RedeemPointsView from '../components/UserProfileComponents/RedeemPointsView';

const {width, height} = Dimensions.get('window');

const boughtCourses = [
  {
    name: 'English Cursive',
    courseId: 'Eng_Hw',
    icon: 'alpha-e',
    showBookDemoScreen: true,
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/handwriting.jpg?alt=media&token=b593eaeb-6bfa-41e3-9725-d7e3499f351f',
  },
  {
    name: 'English Print',
    icon: 'pinterest',
    courseId: 'English_PrintHW',
    description:
      'lorem ipsum dolor sit amet, consectetur adipiscing elit in id lig ut enim ad minim veniam',
    thumbnailUrl:
      'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEnglish_PrintHW%2FthimbnailUrl.webp?alt=media&token=b81a6eb1-e4bf-4e0c-af96-4659c0106422',
  },
];

const UserProfile = ({navigation}) => {
  const [dark, setdark] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [selectedBottomSheetComponent, setSelectedBottomSheetComponent] =
    useState('redeemPoints');
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();
  const changeDarkMode = () => {
    // console.log('changing dark mode to ', );
    dispatch(setDarkMode(dark));
    setdark(!dark);
  };

  const openBottomSheet = component => {
    setBottomSheetOpen(true);
    setSelectedBottomSheetComponent(component);
  };

  return (
    <>
      <ScrollView className="flex-1 px-2" style={{backgroundColor: bgColor}}>
        <View
          className="w-full p-2 rounded-md mt-4 flex-row"
          style={{backgroundColor: bgSecondaryColor, height: height / 4}}>
          <View className="w-[45%] h-full items-center justify-center flex-col">
            <View
              className="h-[72%] w-[85%] bg-gray-400 overflow-hidden"
              style={{borderRadius: 100}}>
              <ImageBackground
                source={{
                  uri: 'https://img.freepik.com/free-photo/playful-boy-holding-stack-books_23-2148414547.jpg?w=740&t=st=1703674788~exp=1703675388~hmac=24445b95541fba0512cfcb562557440de28ed52ef02e516f9a050a1d2871cc21',
                }}
                className="w-[100%] rounded h-full justify-center items-center"
                style={[{flex: 1, resizeMode: 'cover'}]}></ImageBackground>
            </View>
            <View className="mt-2">
              <Text
                className={`text-[12px] text-center font-semibold`}
                style={{color: textColors.textYlMain}}>
                Rahul Sharma, Age: 9
              </Text>
              <Text
                className={`text-[12px] text-center`}
                style={{color: textColors.textYlMain}}>
                Parent Name: Sohan Sharma
              </Text>
            </View>
          </View>
          <View className="w-[55%] h-full p-2 px-4">
            <Pressable onPress={() => openBottomSheet('redeemPoints')}>
              <View
                className="border-b justify-end"
                style={{borderColor: textColors.textSecondary}}>
                <View className="flex-row items-center py-2">
                  <MIcon
                    name="hand-coin-outline"
                    color={textColors.textYlOrange}
                    size={38}
                  />
                  <View className="ml-1">
                    <Text
                      className="font-semibold"
                      style={{color: textColors.textYlOrange}}>
                      Refferal Points
                    </Text>
                    <Text
                      className=""
                      style={{color: textColors.textSecondary}}>
                      960
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            <Pressable onPress={() => openBottomSheet('transactionsView')}>
              <View
                className="justify-start border-b"
                style={{borderColor: textColors.textSecondary}}>
                <View className="flex-row items-center py-2">
                  <MIcon
                    name="swap-horizontal"
                    color={textColors.textYlGreen}
                    size={40}
                  />
                  <View className="ml-1">
                    <Text
                      className="font-semibold"
                      style={{color: textColors.textYlGreen}}>
                      My Transactions
                    </Text>
                    <Text
                      className=""
                      style={{color: textColors.textSecondary}}>
                      5460
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>

            <Pressable onPress={() => openBottomSheet('ticketsView')}>
              <View
                className="justify-start"
                style={{borderColor: textColors.textSecondary}}>
                <View className="flex-row items-center py-2">
                  <MIcon
                    name="ticket-confirmation-outline"
                    color={textColors.textYlRed}
                    size={40}
                  />
                  <View className="ml-1 flex-wrap">
                    <Text
                      className="font-semibold"
                      style={{color: textColors.textYlRed}}>
                      My Tickets
                    </Text>
                    <Text
                      className="flex-wrap"
                      style={{color: textColors.textSecondary}}>
                      Total: 4 , Closed: 3
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Bought Courses Here */}
        <View className="mt-8">
          <Text
            className="text-[24px] capitalize font-bold px-1"
            style={{color: textColors.textPrimary}}>
            My Courses
          </Text>

          <View className="w-full">
            {boughtCourses?.map((data, index) => {
              return (
                <CourseItemShow
                  key={index}
                  data={data}
                  navigation={navigation}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>
      <BottomSheetComponent
        isOpen={bottomSheetOpen}
        Children={
          selectedBottomSheetComponent === 'redeemPoints'
            ? RedeemPointsView
            : selectedBottomSheetComponent === 'transactionsView'
            ? MyTransactionsView
            : selectedBottomSheetComponent === 'ticketsView' && MyTicketsView
        }
        snapPoint={['70%']}
        onClose={() => setBottomSheetOpen(false)}
      />
    </>
  );
};

const MyTransactionsView = () => {
  return (
    <>
      <View className="flex-1 items-center">
        <Text>myTransactionsView</Text>
      </View>
    </>
  );
};

const MyTicketsView = () => {
  return (
    <>
      <View className="flex-1 items-center">
        <Text>MyTicketsView</Text>
      </View>
    </>
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
      // onPress={() => {
      //   navigation.navigate('CourseDetailScreen', {
      //     courseData: data,
      //   });
      // }}
      className="w-full"
      style={{elevation: 1.2}}>
      <View
        className="w-full overflow-hidden mt-3 h-[180px] rounded-xl"
        style={{backgroundColor: bgSecondaryColor}}>
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
            //   end={{x: 0.8, y: 1}}
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
                  className="flex-row rounded-full py-2 px-4 justify-center items-center mt-1 border"
                  style={{borderColor: 'white'}}>
                  {/* <MIcon name="whatsapp" size={30} color="white" /> */}
                  <Text
                    className="text-[12px] font-semibold"
                    style={{color: 'white'}}>
                    Start Learning
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

export default UserProfile;
