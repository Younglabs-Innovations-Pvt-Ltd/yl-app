import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Pressable,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import Video from 'react-native-video';
import {COLORS} from '../utils/constants/colors';
import Icon from '../components/icon.component';
import Spacer from '../components/spacer.component';
import TextWrapper from '../components/text-wrapper.component';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCourseStart} from '../store/course/course.reducer';
import {courseSelector} from '../store/course/course.selector';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../components/button.component';
import {SCREEN_NAMES} from '../utils/constants/screen-names';

const videoUri =
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/41/Big_Buck_Bunny_medium.ogv/Big_Buck_Bunny_medium.ogv.480p.vp9.webm';

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

const levels = ['Foundation', 'Advanced', 'Foundation+Advanced'];
const AGE_GROUPS = ['5-7', '8-10', '11-14'];

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
  const [muted, setMuted] = useState(true);
  const [paused, setPaused] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [aboutCourseArr, setAboutCourseArr] = useState([]);
  const [ageGroup, setAgeGroup] = useState('5-7');
  const [filteredCourse, setFilteredCourse] = useState(null);
  const [courseLevel, setCourseLevel] = useState('Foundation');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const dispatch = useDispatch();

  const {courseDetails, ageGroups} = useSelector(courseSelector);

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
      console.log('Object array', objArray);
      arr.push({ageGroup: ageGrp, objArray});
    });

    console.log('Arr is', arr);
    setAboutCourseArr(arr);
  }, [ageGroups, courseDetails]);

  useEffect(() => {
    if (aboutCourseArr) {
      const filteredCourseArr = aboutCourseArr.find(
        item => item.ageGroup === ageGroup,
      );
      console.log('iltered course', filteredCourseArr);
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

  useEffect(() => {
    dispatch(fetchCourseStart({courseId: 'Eng_Hw'}));
  }, []);

  const onLoadStart = () => {
    setVideoLoading(true);
  };

  const onReadyForDisplay = () => {
    setVideoLoading(false);
  };

  console.log('course', selectedCourse);

  const onMute = () => setMuted(p => !p);

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 16}}>
        <TextWrapper
          fs={22}
          color={'gray'}
          fw="700"
          styles={{textAlign: 'center'}}>
          More about course
        </TextWrapper>
        <Spacer />
        <View style={styles.videoContainer}>
          <Video
            source={{uri: videoUri}}
            style={styles.video}
            muted={muted}
            // paused={paused}
            resizeMode="cover"
            onLoadStart={onLoadStart}
            onReadyForDisplay={onReadyForDisplay}
          />
          {videoLoading && (
            <View style={styles.videoOvarlay}>
              <ActivityIndicator size={'large'} color={COLORS.white} />
            </View>
          )}
          <View style={styles.overlayButtons}>
            <Icon
              name={muted ? 'volume-mute-outline' : 'volume-high-outline'}
              size={28}
              color={COLORS.white}
              onPress={onMute}
            />
            <Icon name={'expand-outline'} size={28} color={COLORS.white} />
          </View>
        </View>
        <Spacer />
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
                    fw="700"
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
                alignItems: 'center',
                gap: 12,
              }}>
              {levels.map(level => (
                <Pressable
                  key={level}
                  style={[
                    styles.ageGroup,
                    {
                      width: 'auto',
                      paddingHorizontal: 6,
                      backgroundColor:
                        courseLevel === level ? COLORS.pblue : '#e7f4ff',
                    },
                  ]}
                  onPress={() => setCourseLevel(level)}>
                  <TextWrapper
                    fs={15}
                    fw="700"
                    color={courseLevel === level ? COLORS.white : '#1b8ff5'}>
                    {level}
                  </TextWrapper>
                </Pressable>
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
        <Spacer />
        <Button
          onPress={() => {
            navigation.navigate(SCREEN_NAMES.BATCH_FEE_DETAILS);
          }}
          textSize={18}
          textColor={COLORS.white}
          bg={COLORS.pblue}
          rounded={4}>
          Batch Detail
        </Button>
      </ScrollView>
    </View>
  );
};

const CourseContent = ({course}) => {
  return (
    <View style={{paddingVertical: 8}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
        <MIcon name="bullseye-arrow" size={28} color={'#0046b2'} />
        <TextWrapper fs={18} fw="700" color={'#0046b2'}>
          {course?.subHeading}
        </TextWrapper>
      </View>
      <View style={{paddingHorizontal: 8, paddingTop: 8}}>
        {course?.points.map((point, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginVertical: 4,
            }}>
            <Icon name="checkmark-circle-outline" size={24} color={'#1b8ff5'} />
            <TextWrapper>{point}</TextWrapper>
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
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    overflow: 'hidden',
    borderRadius: 8,
    position: 'relative',
    elevation: 4,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoOvarlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayButtons: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
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
