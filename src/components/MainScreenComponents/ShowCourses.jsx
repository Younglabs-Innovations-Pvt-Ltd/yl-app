import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FONTS} from '../../utils/constants/fonts';
import {COLORS} from '../../utils/constants/colors';
import {FlatList} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {welcomeScreenSelector} from '../../store/welcome-screen/selector';
import {bookDemoSelector} from '../../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../../store/book-demo/book-demo.reducer';
import {getCoursesForWelcomeScreen} from '../../store/welcome-screen/reducer';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {authSelector} from '../../store/auth/selector';
// Shimmer effects
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {fetchUserFormLoginDetails} from '../../store/auth/reducer';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {height, width} = Dimensions.get('window');
const ShowCourses = ({navigation}) => {
  const coursesNameByCategory = {
    handwriting: 'English Handwriting Courses',
    learning: 'English Learning',
    mathematics: 'Mathematics Courses',
    others: 'Other Academic Courses',
  };

  const dispatch = useDispatch();
  const {darkMode, bgColor, textColors} = useSelector(state => state.appTheme);
  const {courses, coursesLoadingFailed, coursesLoading} = useSelector(
    welcomeScreenSelector,
  );
  const {ipData} = useSelector(bookDemoSelector);
  const [refreshCourses, setRefreshCourses] = useState({});
  const {user} = useSelector(authSelector);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  // console.log("ip data is", ipData?.country_name)

  useEffect(() => {
    if (ipData) {
      dispatch(getCoursesForWelcomeScreen({country: ipData?.country_name}));
    }
  }, [ipData, refreshCourses]);

  const reloadCourses = () => {
    setRefreshCourses({});
    !user && dispatch(fetchUserFormLoginDetails());
  };

  //   console.log("courses are", courses)
  return (
    <View className="w-full">
      {coursesLoading ? (
        <CoursesLoadingEffect />
      ) : coursesLoadingFailed ? (
        <View className="w-full items-center h-[80px] justify-center">
          <Text
            className="font-semibold"
            style={[FONTS.primary, {color: textColors.textSecondary}]}>
            Unable To Load Courses For You
          </Text>

          <Pressable onPress={() => reloadCourses()}>
            <Text
              className="text-base mt-1"
              style={{color: textColors.textYlMain}}>
              Try Again
            </Text>
          </Pressable>
        </View>
      ) : (
        Object.keys(courses)?.map(key => {
          return courses[key]?.length > 0 ? (
            <View className="py-1 w-[100%]" key={key}>
              <View className="gap-1 pl-2 pr-3 flex-row justify-between items-end">
                <Text
                  className={`w-[100%] p-0`}
                  style={[FONTS.heading, {color: textColors?.textPrimary}]}>
                  {coursesNameByCategory[key]}
                </Text>
              </View>

              <FlatList
                data={courses[key]}
                keyExtractor={item => item.id}
                renderItem={item => {
                  return (
                    <CourseItemRender
                      data={item.item}
                      navigation={navigation}
                      phone={user?.phone}
                    />
                  );
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{paddingTop: 4}}
              />
            </View>
          ) : null;
        })
      )}
    </View>
  );
};

export default ShowCourses;

const CourseItemRender = ({data, navigation}) => {
  const {darkMode, bgColor, textColors} = useSelector(state => state.appTheme);
  return (
    <>
      <Pressable
        onPress={() => {
          navigation.navigate('CourseDetailScreen', {
            courseData: data,
          });
        }}>
        <View className="overflow-hidden items-center h-[160px] mx-[3px] shadow rounded-md bg-gray-100  w-[115px]">
          <ImageBackground
            source={{
              uri:
                data.coverPicture ||
                'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/courses%2FEng_Tuitions_5-14%2FthimbnailUrl.jpeg?alt=media&token=be2b7b32-311d-4951-8e47-61ab5fbfc529',
            }}
            style={[{flex: 1, resizeMode: 'cover'}]}
            className="w-[100%] rounded h-full justify-center items-center">
            <LinearGradient
              colors={['#00000014', '#000']}
              className="w-full"
              start={{x: 0.5, y: 0.2}}>
              <View className="h-[20%] justify-center items-center"></View>
              <View className="h-[80%] items-start justify-end p-1">
                {data?.alternativeNameOnApp?.split(' ').map((item, index) => {
                  return (
                    <Text
                      key={index}
                      style={[{lineHeight: 20, fontFamily: FONTS.headingFont}]}
                      className="flex-wrap text-white text-[17px] font-semibold">
                      {item}
                    </Text>
                  );
                })}
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </Pressable>
    </>
  );
};

const CoursesLoadingEffect = () => {
  return (
    <View className="py-4">
      <View className="">
        <ShimmerPlaceholder
          className="h-6 rounded w-[250px]"
          shimmerWidthPercent={0.4}></ShimmerPlaceholder>
      </View>
      <View className="flex-row justify-start mt-3">
        <FlatList
          data={[1, 2, 3]}
          keyExtractor={item => item}
          renderItem={() => (
            <ShimmerPlaceholder
              // shimmerWidthPercent={0.4}
              className="h-[160px] w-[110px] mr-3 rounded"></ShimmerPlaceholder>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

{
  /* <View className="py-1 w-[100%]">
        <View className="gap-1 pl-2 pr-3 flex-row justify-between items-end">
          <Text
            className={`w-[80%] p-0`}
            style={[FONTS.heading, {color: textColors?.textPrimary}]}>
            Handwriting Improvement
          </Text>

          <Pressable
            className="flex-row"
            onPress={() => {
              navigation.navigate('AllCoursesScreen', {
                //   courses: handwritingCourses,
                heading: 'Handwriting Improvement',
              });
            }}>
            <Text className="font-semibold" style={{color: COLORS.pblue}}>
              See all
            </Text>
            <MIcon name="chevron-right" size={22} color={COLORS.pblue} />
          </Pressable>
        </View>

        {coursesLoading ? (
          <View className="w-full items-center h-[80px] justify-center mt-1">
            <ActivityIndicator
              color={textColors.textYlMain}
              className="h-10 w-10"
            />
          </View>
        ) : coursesLoadingFailed ? (
          <View className="w-full items-center h-[80px] justify-center">
            <Text
              className="font-semibold"
              style={[FONTS.primary, {color: textColors.textSecondary}]}>
              Unable To Load Courses For You
            </Text>

            <Pressable onPress={() => reloadCourses()}>
              <Text
                className="text-base mt-1"
                style={{color: textColors.textYlMain}}>
                Try Again
              </Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={courses}
            keyExtractor={item => item.name}
            renderItem={item => {
              return (
                <CourseItemRender
                  data={item.item}
                  navigation={navigation}
                  phone={user?.phone}
                />
              );
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
            style={{paddingTop: 4}}
          />
        )}
      </View> */
}
