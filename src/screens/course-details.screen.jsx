import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import Icon from '../components/icon.component';
import Spacer from '../components/spacer.component';
import TextWrapper from '../components/text-wrapper.component';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchCourseStart,
  fetchCourseVideos,
} from '../store/course/course.reducer';
import {courseSelector} from '../store/course/course.selector';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import VideoPlayer from '../components/video-player.component';
import {FONTS} from '../utils/constants/fonts';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/constants/local-keys';


const levels = ['Foundation', 'Advanced', 'Foundation+Advanced'];
const AGE_GROUPS = ['5-7', '8-10', '11-14'];

const {width: deviceWidth} = Dimensions.get('window');

const getLevelName = level => {
  if (level == 1) {
    return 'Foundation';
  }
  if (level == 2) {
    return 'Advanced';
  } else {
    return 'Foundation + Advanced';
  }
};

const CourseDetails = ({navigation , courseId}) => {
  const [aboutCourseArr, setAboutCourseArr] = useState([]);
  const [ageGroup, setAgeGroup] = useState('5-7');
  const [filteredCourse, setFilteredCourse] = useState(null);
  const [courseLevel, setCourseLevel] = useState('Foundation');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const dispatch = useDispatch();
  const {textColors,bgColor} = useSelector(state => state.appTheme);

  // console.log("CourseID here in this page", courseId)

  const {courseDetails, ageGroups, courseVideos, loading} =
    useSelector(courseSelector);


  // console.log("About course array is", aboutCourseArr[0].objArray[0].content)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // console.log('course focused..');
      localStorage.set(LOCAL_KEYS.CURRENT_SCREEN, 'course');
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
    dispatch(fetchCourseStart({courseId : courseId }))
  },[])

  useEffect(() => {
    if (!courseVideos) {
      dispatch(fetchCourseVideos());
    }
  }, [courseVideos]);

  useEffect(() => {
    let arr = [];
    ageGroups?.map(ageGroupItem => {
      let ageGrp = ageGroupItem.ageGroup;
      let objArray = ageGroupItem?.levels?.map(level => {
        let obj = {
          heading:
            courseDetails.definedCourseType === 'definedClasses'
              ? level?.altName || getLevelName(level?.level)
              : getLevelName(level?.level),
          level: level?.level,
          content: [
            {
              subHeading: 'Course Goals',
              points: level?.learning_goals?.split('/n'),
            },
            {
              subHeading: 'Topics Covered',
              points: level?.details?.split('/n'),
            },
            {
              subHeading: 'Requirements',
              points: level?.materials?.split('/n'),
            },
          ],
        };
        return obj;
      });

      objArray = objArray.sort((a, b) => {
        return parseInt(a?.level) - parseInt(b?.level);
      });

      if (
        courseDetails?.addedLevel3Manually &&
        courseDetails?.level3CourseDetails &&
        courseDetails?.ageGroupsToShowLevel3Details?.includes(ageGrp)
      ) {
        let body = courseDetails.level3CourseDetails;
        let level3Obj = {
          heading: body.heading,
          content: [
            {
              subHeading: 'Course Goals',
              points: body?.courseGoals?.split('\n'),
            },
            {
              subHeading: 'Topics Covered',
              points: body?.topicsCovered?.split('\n'),
            },
            {
              subHeading: 'Requirements',
              points: body?.requirements?.split('\n'),
            },
          ],
        };
        objArray.push(level3Obj);
      }
      arr.push({ageGroup: ageGrp, objArray});
    });

    setAboutCourseArr(arr);
  }, [ageGroups, courseDetails]);

  useEffect(() => {
    if (aboutCourseArr) {
      const filteredCourseArr = aboutCourseArr.find(
        item => item.ageGroup === ageGroup,
      );
      // console.log("find item" , filteredCourseArr)
      setFilteredCourse(filteredCourseArr);
    }
  }, [ageGroup, aboutCourseArr]);

  useEffect(() => {
    if (filteredCourse) {
      // console.log("here 1" , courseLevel)
      let course;
      if (
        courseLevel === 'Foundation' ||
        courseLevel === 'Foundation+Advanced'
      ) {
        course = filteredCourse.objArray.find(item => parseInt(item.level) === 1);
      } else {
        course = filteredCourse.objArray.find(item => parseInt(item.level) === 2);
      }

      setSelectedCourse(course);
    }
  }, [courseLevel, filteredCourse]);

  return (
    <View style={[styles.container,{backgroundColor:bgColor}]}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}>
        <TextWrapper
          fs={22}
          color={textColors.textSecondary}
          fw="900"
          styles={{textAlign: 'center'}}>
          More about course
        </TextWrapper>
        <Spacer />
        <VideoPlayer uri={courseVideos?.videoUri} />
        <Spacer />
        {loading ? (
          <ActivityIndicator
            size={'large'}
            color={COLORS.black}
            style={{alignSelf: 'center'}}
          />
        ) : (
          <>
            <View>
              <Text className="text-center text-[18px] font-semibold" style={{color:textColors.textYlMain}}>
                Choose Age Group
              </Text>
              <View style={{alignItems: 'center'}}>
                {/* <TextWrapper fs={17}>Age group</TextWrapper> */}
                <Spacer space={8} />
                <View style={{flexDirection: 'row', gap: 12}}>
                  {console.log('textcolor', textColors.textYlMain)}
                  {AGE_GROUPS.map(group => (
                    <Pressable
                      key={group}
                      style={[
                        ageGroup === group
                          ? {backgroundColor: textColors.textYlMain}
                          : {},
                        {borderColor: textColors.textYlMain},
                      ]}
                      className={`py-[3px] border rounded-full px-4`}
                      onPress={() => setAgeGroup(group)}>
                      <TextWrapper
                        fs={18}
                        ff={FONTS.signika_medium}
                        style={[
                          ageGroup === group
                            ? {color: 'white'}
                            : {color: textColors.textYlMain},
                        ]}>
                        {group}
                      </TextWrapper>
                    </Pressable>
                  ))}
                </View>
                <Spacer space={3} />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  {levels.map(level => (
                    <CourseLevels
                      key={level}
                      level={level}
                      courseLevel={courseLevel}
                      setCourseLevel={setCourseLevel}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Spacer />

            <View>
              {selectedCourse?.content?.map((course, index) => (
                <CourseContent course={course} key={index} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
      <View
        style={{
          // position: 'absolute',
          // bottom: 0,
          // height: 90,
          backgroundColor: '#eee',
        }}>
        {/* <Button
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.BATCH_FEE_DETAILS);
          }}
          textSize={18}
          textColor={COLORS.white}
          bg={COLORS.pblue}
          rounded={4}>
          Batch/Fee Details
        </Button> */}
      </View>
    </View>
  );
};

const CourseLevels = ({courseLevel, level, setCourseLevel}) => {
  const {textColors} = useSelector(state => state.appTheme);

  return (
    <Pressable
      style={[
        {borderColor: textColors.textYlMain},
        courseLevel === level ? {backgroundColor: textColors.textYlMain} : {},
      ]}
      className={`border py-[2px] px-3 items-center justify-center rounded-full`}
      onPress={() => setCourseLevel(level)}>
      <TextWrapper
        fs={13}
        ff={FONTS.signika_medium}
        color={courseLevel === level ? COLORS.white : textColors.textYlMain}>
        {level}
      </TextWrapper>
      <TextWrapper
        fs={11}
        ff={FONTS.signika_medium}
        color={courseLevel === level ? COLORS.white : textColors.textYlMain}>
        {level === 'Foundation' || level === 'Advanced'
          ? '(12 classes)'
          : '(24 classes)'}
      </TextWrapper>
    </Pressable>
  );
};

const CourseContent = ({course}) => {
  const {textColors} = useSelector(state => state.appTheme);
  return (
    <View style={{paddingVertical: 2}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
        <MIcon name="bullseye-arrow" size={28} color={textColors.textYlMain} />
        <TextWrapper
          fs={21}
          color={textColors.textYlMain}
          ff={FONTS.signika_semiBold}>
          {course?.subHeading}
        </TextWrapper>
      </View>
      <View style={{paddingHorizontal: 8, width: '100%'}} className="mt-1">
        {course?.points.map((point, index) => (
          <View key={index.toString()}>
            <TextWrapper
              color={textColors.textSecondary}
              ff={FONTS.signika_medium}>
              {point}
            </TextWrapper>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  ageGroup: {
    paddingVertical: 12,
    width: 74,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  contentCard: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'gray',
  },
});
