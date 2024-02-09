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

const CourseDetails = ({navigation, courseData}) => {
  const [aboutCourseArr, setAboutCourseArr] = useState([]);
  const [ageGroup, setAgeGroup] = useState('5-7');
  const [filteredCourse, setFilteredCourse] = useState(null);
  const [courseLevel, setCourseLevel] = useState('Foundation');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const dispatch = useDispatch();
  const {textColors, bgColor} = useSelector(state => state.appTheme);

  const [filteredLevels, setFilteredLevels] = useState([]);
  const [selectedLevelItemToShow, setSelectedLevelItemToShow] = useState(null);

  // console.log("CourseID here in this page", courseId)

  const {courseDetails, ageGroups, courseVideos, loading} =
    useSelector(courseSelector);

  // console.log("About course array is", aboutCourseArr[0].objArray[0].content)

  useEffect(() => {
    if (!courseDetails || courseDetails?.courseId !== courseData.id) {
      dispatch(
        fetchCourseStart({
          courseId: courseData.id,
          country: 'qatar',
        }),
      );
    }
  }, [courseDetails]);

  useEffect(() => {
    if (!courseVideos) {
      dispatch(fetchCourseVideos());
    }
  }, [courseVideos]);

  const getCurricumumLevelName = level => {
    // console.log(' curriculum=', level);
  };
  useEffect(() => {
    let arr = [];
    ageGroups?.map(ageGroupItem => {
      let ageGrp = ageGroupItem.ageGroup;
      console.log('ageGroup is', ageGrp);
      let objArray = ageGroupItem?.levels?.map(level => {
        let obj = {
          heading:
            courseDetails.course_type === 'curriculum'
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
        course = filteredCourse.objArray.find(
          item => parseInt(item.level) === 1,
        );
      } else {
        course = filteredCourse.objArray.find(
          item => parseInt(item.level) === 2,
        );
      }

      setSelectedCourse(course);
    }
  }, [courseLevel, filteredCourse]);

  useEffect(() => {
    console.log('changing for ', ageGroup);
    const filtered = aboutCourseArr?.filter(item => {
      return item?.ageGroup == ageGroup;
    });

    setFilteredLevels(filtered);
  }, [ageGroup, aboutCourseArr]);

  useEffect(() => {
    if (filteredLevels) {
      setSelectedLevelItemToShow(filteredLevels[0]?.objArray[0] || []);
    }
  }, [filteredLevels]);

  return (
    <View style={[styles.container, {backgroundColor: bgColor}]}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 30}}>
        <Text
          className="font-semibold w-full text-center"
          style={[FONTS.heading, {color: textColors.textSecondary}]}>
          More About Course
        </Text>
        <Spacer />
        {/* <VideoPlayer
          uri={courseVideos?.videoUri}
          // poster={courseVideos?.coursePoster}
        /> */}
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
              <Text
                className="text-center font-semibold"
                style={[FONTS.subHeading, {color: textColors.textYlMain}]}>
                Choose Age Group
              </Text>
              <View style={{alignItems: 'center'}}>
                <Spacer space={8} />
                <View style={{flexDirection: 'row', gap: 12}}>
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
                  className="mt-1"
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 5,
                  }}>
                  {filteredLevels.map((item, i) => {
                    return item?.objArray?.map((item, index) => {
                      return (
                        <Pressable
                          key={index}
                          className="py-1 px-3 border rounded-full"
                          style={
                            selectedLevelItemToShow?.heading === item?.heading
                              ? {
                                  borderColor: COLORS.pblue,
                                  backgroundColor: COLORS.pblue,
                                }
                              : {
                                  borderColor: COLORS.pblue,
                                }
                          }
                          onPress={() => setSelectedLevelItemToShow(item)}>
                          <Text
                            className="font-semibold "
                            style={{
                              color:
                                selectedLevelItemToShow?.heading ===
                                item?.heading
                                  ? 'white'
                                  : textColors.textYlMain,
                            }}>
                            {item?.heading}
                          </Text>
                        </Pressable>
                      );
                    });
                  })}
                </View>
              </View>
            </View>

            {/* <Spacer /> */}
            <View>
              {/* {console.log('selected level ', selectedLevelItemToShow)} */}
              {selectedLevelItemToShow && (
                <CourseContent content={selectedLevelItemToShow?.content} />
              )}
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

const CourseContent = ({content}) => {
  const {textColors} = useSelector(state => state.appTheme);
  return (
    <View>
      {content?.map((item, index) => {
        return (
          <View style={{paddingVertical: 1}} key={index}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}>
              <MIcon
                name="bullseye-arrow"
                size={28}
                color={textColors.textYlMain}
              />
              <Text
                className="font-semibold"
                style={[FONTS.subHeading, {color: textColors.textYlMain}]}>
                {item?.subHeading}
              </Text>
            </View>
            <View
              style={{paddingHorizontal: 8, width: '100%'}}
              className="mt-1">
              {item?.points.map((point, index) => (
                <View key={index.toString()}>
                  <Text
                    className="font-semibold"
                    style={[FONTS.primary, {color: textColors.textSecondary}]}>
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}
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
