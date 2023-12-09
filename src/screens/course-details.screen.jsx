import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {COLORS} from '../utils/constants/colors';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCourseStart} from '../store/course/course.reducer';
import {courseSelector} from '../store/course/course.selector';
import Icon from '../components/icon.component';
import BatchCard from '../components/batch-card.component';
import Collapsible from 'react-native-collapsible';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import Spinner from '../components/spinner.component';

import {setCurrentAgeGroup} from '../store/course/course.reducer';

const {width: deviceWidth} = Dimensions.get('window');

const ITEM_WIDTH = deviceWidth * 0.75;

const CourseDetails = ({navigation}) => {
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [collapsedButton, setCollapsedButton] = useState(true);
  const [steps, setSteps] = useState({
    step1: true,
    step2: true,
    step3: true,
  });

  const dispatch = useDispatch();

  const {
    courseDetails,
    ageGroups,
    batches,
    prices,
    loading,
    levelText,
    currentSelectedBatch,
    currentAgeGroup,
  } = useSelector(courseSelector);
  const {ipData} = useSelector(bookDemoSelector);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCollapsedButton(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    dispatch(fetchCourseStart({courseId: 'Eng_Hw'}));
  }, []);

  useEffect(() => {
    let timeout;
    if (currentAgeGroup) {
      timeout = setTimeout(() => {
        setSteps(b => ({...b, step1: true, step2: false}));
      }, 200);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentAgeGroup]);

  useEffect(() => {
    let timeout;
    if (levelText) {
      timeout = setTimeout(() => {
        setSteps(b => ({...b, step2: true}));
        setCollapsedButton(false);
      }, 200);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [levelText]);

  useEffect(() => {
    if (currentAgeGroup) {
      const filteredBatches = batches.filter(
        item => item.ageGroup === currentAgeGroup,
      );

      setFilteredBatches(filteredBatches);
    }
  }, [currentAgeGroup, batches]);

  const handleCurrentAgeGroup = group => {
    dispatch(setCurrentAgeGroup(group));
  };

  const SECTIONS = [
    {
      title: 'First',
      content: 'Lorem ipsum...',
    },
    {
      title: 'Second',
      content: 'Lorem ipsum...',
    },
  ];

  return (
    <View style={{flex: 1}}>
      {loading ? (
        <Spinner style={{alignSelf: 'center'}} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}
          contentContainerStyle={{padding: 16}}>
          {/* Age groups */}
          <View style={{padding: 12, backgroundColor: '#eee', borderRadius: 4}}>
            <Pressable
              onPress={() => setSteps(s => ({...s, step1: !s.step1}))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TextWrapper fs={22} fw="700">
                1. Select age group
              </TextWrapper>
              {!currentAgeGroup ? (
                <Icon
                  name={`chevron-${!steps.step1 ? 'up' : 'down'}-outline`}
                  size={24}
                  color={COLORS.black}
                />
              ) : (
                <Icon name="checkmark-circle" size={32} color={COLORS.pgreen} />
              )}
            </Pressable>
            <Collapsible collapsed={steps.step1} duration={450}>
              <AgeSelector
                ageGroups={ageGroups}
                currentAgeGroup={currentAgeGroup}
                handleCurrentAgeGroup={handleCurrentAgeGroup}
                setSteps={setSteps}
              />
            </Collapsible>
          </View>

          {/* Batch card */}
          <View style={{marginTop: 12}}>
            <Pressable
              style={{
                padding: 12,
                opacity: !currentAgeGroup ? 0.7 : 1,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#eee',
              }}
              disabled={!currentAgeGroup}
              onPress={() => setSteps(s => ({...s, step2: !s.step2}))}>
              <TextWrapper fs={22} fw="700">
                2. Select a batch
              </TextWrapper>
              {!currentSelectedBatch ? (
                <Icon
                  name={`chevron-${!steps.step2 ? 'up' : 'down'}-outline`}
                  size={24}
                  color={COLORS.black}
                />
              ) : (
                <Icon name="checkmark-circle" size={32} color={COLORS.pgreen} />
              )}
            </Pressable>
            {filteredBatches.length > 0 && (
              <View style={{paddingTop: 8}}>
                <Collapsible collapsed={steps.step2} duration={450}>
                  <BatchCard
                    ipData={ipData}
                    ageGroups={ageGroups}
                    courseDetails={courseDetails}
                    prices={prices}
                    level={1}
                    batchOptions={filteredBatches.filter(
                      batch => batch.level === 1,
                    )}
                    currentAgeGroup={currentAgeGroup}
                    currentSelectedBatch={currentSelectedBatch}
                    levelText={levelText}
                  />
                  <Spacer space={4} />
                  <BatchCard
                    ipData={ipData}
                    ageGroups={ageGroups}
                    courseDetails={courseDetails}
                    prices={prices}
                    level={2}
                    batchOptions={filteredBatches.filter(
                      batch => batch.level === 2,
                    )}
                    currentAgeGroup={currentAgeGroup}
                    currentSelectedBatch={currentSelectedBatch}
                    levelText={levelText}
                  />
                  <Spacer space={4} />
                  <BatchCard
                    ipData={ipData}
                    ageGroups={ageGroups}
                    courseDetails={courseDetails}
                    prices={prices}
                    level={3}
                    batchOptions={filteredBatches.filter(
                      batch => batch.level === 1,
                    )}
                    currentAgeGroup={currentAgeGroup}
                    currentSelectedBatch={currentSelectedBatch}
                    levelText={levelText}
                  />
                </Collapsible>
              </View>
            )}
          </View>
          <View
            style={{
              padding: 12,
              backgroundColor: '#eee',
              borderRadius: 4,
              marginTop: 12,
            }}>
            <Pressable
              onPress={() => setCollapsedButton(p => !p)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: currentAgeGroup && currentSelectedBatch ? 1 : 0.7,
              }}
              disabled={!currentAgeGroup || !currentSelectedBatch}>
              <TextWrapper fs={22} fw="700">
                3. Make payment
              </TextWrapper>
              {currentSelectedBatch && currentAgeGroup ? (
                <Icon name="checkmark-circle" size={32} color={COLORS.pgreen} />
              ) : (
                <Icon
                  name={`chevron-${!steps.step3 ? 'up' : 'down'}-outline`}
                  size={24}
                  color={COLORS.black}
                />
              )}
            </Pressable>
            <Collapsible collapsed={collapsedButton}>
              <Pressable
                style={({pressed}) => [
                  styles.payButton,
                  {
                    opacity: pressed ? 0.8 : 1,
                    marginTop: 20,
                  },
                ]}
                onPress={() => navigation.navigate(SCREEN_NAMES.PAYMENT)}>
                <TextWrapper fs={18} fw="700" color={COLORS.white}>
                  Pay and Enroll
                </TextWrapper>
              </Pressable>
            </Collapsible>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const AgeSelector = ({
  ageGroups,
  currentAgeGroup,
  handleCurrentAgeGroup,
  setSteps,
}) => {
  const selectBatch = item => {
    handleCurrentAgeGroup(item.ageGroup);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
        alignSelf: 'center',
      }}>
      {ageGroups.map(item => (
        <Pressable
          key={item.ageGroup}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 8,
            backgroundColor:
              currentAgeGroup === item.ageGroup ? COLORS.pblue : 'transparent',
          }}
          onPress={() => selectBatch(item)}>
          <TextWrapper
            fs={20}
            fw="700"
            color={
              currentAgeGroup === item.ageGroup ? COLORS.white : COLORS.black
            }>
            {item.ageGroup}
          </TextWrapper>
        </Pressable>
      ))}
    </View>
  );
};

export default CourseDetails;

const styles = StyleSheet.create({
  videoContainer: {
    height: 240,
    paddingVertical: 12,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  reivewItem: {
    width: ITEM_WIDTH,
    padding: 16,
    borderRadius: 6,
    elevation: 1.25,
  },
  reviewRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 8,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  reivewContent: {
    paddingVertical: 8,
  },
  btnBooking: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: COLORS.pgreen,
  },
  payButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pgreen,
    borderRadius: 4,
  },
});
