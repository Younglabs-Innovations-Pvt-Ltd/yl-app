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
import Button from '../components/button.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import VideoPlayer from '../components/video-player.component';
import {FONTS} from '../utils/constants/fonts';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/constants/local-keys';

// const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

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

const CourseDetails = ({navigation}) => {
  const [aboutCourseArr, setAboutCourseArr] = useState([]);
  const [ageGroup, setAgeGroup] = useState('5-7');
  const [filteredCourse, setFilteredCourse] = useState(null);
  const [courseLevel, setCourseLevel] = useState('Foundation');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const dispatch = useDispatch();

  const {courseDetails, ageGroups, courseVideos, loading} =
    useSelector(courseSelector);

  // Save current screen name
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     console.log('course focused..');
  //     localStorage.set(LOCAL_KEYS.CURRENT_SCREEN, 'course');
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    if (!courseDetails) {
      dispatch(fetchCourseStart({courseId: 'Eng_Hw'}));
    }
  }, [courseDetails]);

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
      setFilteredCourse(filteredCourseArr);
    }
  }, [ageGroup, aboutCourseArr]);

  useEffect(() => {
    if (filteredCourse) {
      let course;
      if (
        courseLevel === 'Foundation' ||
        courseLevel === 'Foundation+Advanced'
      ) {
        course = filteredCourse.objArray.find(item => item.level === '1');
      } else {
        course = filteredCourse.objArray.find(item => item.level === '2');
      }

      setSelectedCourse(course);
    }
  }, [courseLevel, filteredCourse]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}>
        <TextWrapper
          fs={22}
          color={'gray'}
          fw="700"
          styles={{textAlign: 'center'}}>
          More about course
        </TextWrapper>
        <Spacer />
        <VideoPlayer
          uri={courseVideos?.videoUri}
          // poster={courseVideos?.coursePoster}
        />
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
              <TextWrapper fs={18} styles={{textAlign: 'center'}}>
                Age group
              </TextWrapper>
              <View style={{alignItems: 'center'}}>
                {/* <TextWrapper fs={17}>Age group</TextWrapper> */}
                <Spacer space={8} />
                <View style={{flexDirection: 'row', gap: 12}}>
                  {AGE_GROUPS.map(group => (
                    <Pressable
                      key={group}
                      style={[
                        styles.ageGroup,
                        {
                          backgroundColor:
                            ageGroup === group ? COLORS.pblue : '#e7f4ff',
                        },
                      ]}
                      onPress={() => setAgeGroup(group)}>
                      <TextWrapper
                        fs={17}
                        ff={FONTS.signika_medium}
                        color={ageGroup === group ? COLORS.white : '#1b8ff5'}>
                        {group}
                      </TextWrapper>
                    </Pressable>
                  ))}
                </View>
                <Spacer space={8} />
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 12,
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
        <Button
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.BATCH_FEE_DETAILS);
          }}
          textSize={18}
          textColor={COLORS.white}
          bg={COLORS.pblue}
          rounded={4}>
          Batch/Fee Details
        </Button>
      </View>
    </View>
  );
};

const CourseLevels = ({courseLevel, level, setCourseLevel}) => {
  return (
    <Pressable
      style={[
        styles.ageGroup,
        {
          width: 'auto',
          paddingHorizontal: 6,
          backgroundColor: courseLevel === level ? COLORS.pblue : '#e7f4ff',
          position: 'relative',
        },
      ]}
      onPress={() => setCourseLevel(level)}>
      <TextWrapper
        fs={15}
        ff={FONTS.signika_medium}
        color={courseLevel === level ? COLORS.white : '#1b8ff5'}>
        {level}
      </TextWrapper>
      <TextWrapper
        fs={14}
        ff={FONTS.signika_medium}
        color={courseLevel === level ? COLORS.white : '#1b8ff5'}>
        {level === 'Foundation' || level === 'Advanced'
          ? '(12 classes)'
          : '(24 classes)'}
      </TextWrapper>
      {/* <View
        style={{
          position: 'absolute',
          top: '-50%',
          right: 4,
        }}>
        <TextWrapper fs={14} ff={FONTS.signika_medium} color={'#434a52'}>
          {level === 'Foundation' || level === 'Advanced'
            ? '12 classes'
            : '24 classes'}
        </TextWrapper>
      </View> */}
    </Pressable>
  );
};

const CourseContent = ({course}) => {
  return (
    <View style={{paddingVertical: 8}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
        }}>
        <MIcon name="bullseye-arrow" size={28} color={'#0046b2'} />
        <TextWrapper fs={21} color={'#0046b2'} ff={FONTS.signika_semiBold}>
          {course?.subHeading}
        </TextWrapper>
      </View>
      <View style={{paddingHorizontal: 8, paddingTop: 8, width: '100%'}}>
        {course?.points.map((point, index) => (
          <View key={index.toString()}>
            <TextWrapper color="#434a52" ff={FONTS.signika_medium}>
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
