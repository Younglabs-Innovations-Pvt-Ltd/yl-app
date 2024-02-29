import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  Pressable,
  Image,
  Linking,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {COLORS} from '../utils/constants/colors';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {useDispatch, useSelector} from 'react-redux';
import {
  fetchCourseStart,
  fetchCourseVideos,
} from '../store/course/course.reducer';
import {courseSelector} from '../store/course/course.selector';
import Icon from '../components/icon.component';
import BatchCard from '../components/batch-card.component';
import Collapsible from 'react-native-collapsible';

import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import Spinner from '../components/spinner.component';

import {setCurrentAgeGroup} from '../store/course/course.reducer';
import {FONTS} from '../utils/constants/fonts';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import NoBatchesModule from '../components/NoBatchesModule';
import SoloBatchPayment from '../components/payments/SoloBatchPayment';
import {Text} from 'react-native-animatable';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getWhatsappRedirectUrl} from '../utils/redirect-whatsapp';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import BottomSheetComponent from '../components/BottomSheetComponent';
import ModalComponent from '../components/modal.component';

const {width: deviceWidth} = Dimensions.get('window');

const ITEM_WIDTH = deviceWidth * 0.75;

const BatchFeeDetails = ({navigation, courseData}) => {
  const toast = useToast();
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
    courseVideos,
  } = useSelector(courseSelector);

  const {ipData, timezone} = useSelector(bookDemoSelector);
  const {bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const [selectedCourseTypeToBuy, setSelectedCourseTypeToBuy] =
    useState('solo');
  const [isOneToOneCourseAvailable, setIsOneToOneCourseAvailable] =
    useState(false);
  const [isGroupCourseAvailable, setIsGroupCourseAvailable] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [showContactOnWhatsAppSheet, setShowContactOnWhatsAppSheet] =
    useState(false);

  useEffect(() => {
    if (!courseDetails || courseDetails?.courseId !== courseData.id) {
      dispatch(
        fetchCourseStart({
          courseId: courseData.id,
          country: ipData?.country_name,
        }),
      );
    }
  }, [courseData, ipData, courseDetails]);

  useEffect(() => {
    if (courseData?.courseAvailable) {
      if (courseData?.courseTypeAvailable === 'both') {
        setIsGroupCourseAvailable(true);
        setIsOneToOneCourseAvailable(true);
        setSelectedCourseTypeToBuy('group');
      } else if (courseData?.courseTypeAvailable === 'solo') {
        console.log('i am here');
        setIsGroupCourseAvailable(false);
        setIsOneToOneCourseAvailable(true);
        setSelectedCourseTypeToBuy('solo');
      } else if (courseData?.courseTypeAvailable === 'group') {
        setIsGroupCourseAvailable(true);
        setIsOneToOneCourseAvailable(false);
        setSelectedCourseTypeToBuy('group');
      }
    }
    if (
      courseData?.showPriceType === 'group' ||
      courseData?.showPriceType === 'both'
    ) {
      setShowPrice(true);
    }
  }, [courseData]);

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setCollapsedButton(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!courseVideos) {
      dispatch(fetchCourseVideos());
    }
  }, [courseVideos]);

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
    if (currentSelectedBatch) {
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
  }, [currentSelectedBatch]);

  useEffect(() => {
    if (currentAgeGroup) {
      const filteredBatches = batches.filter(
        item => item.ageGroup === currentAgeGroup,
      );

      console.log('filteredBatchesLength', filteredBatches.length);
      setFilteredBatches(filteredBatches);
    }
  }, [currentAgeGroup, batches]);

  const handleCurrentAgeGroup = group => {
    dispatch(setCurrentAgeGroup(group));
  };

  const btnStyle = type => {
    if (selectedCourseTypeToBuy === type) {
      return {
        backgroundColor: bgSecondaryColor,
      };
    } else {
      return {
        backgroundColor: bgColor,
      };
    }
  };

  const btnTextStyle = type => {
    if (selectedCourseTypeToBuy === type) {
      return {
        color: 'white',
      };
    } else {
      return {
        color: textColors.textSecondary,
      };
    }
  };

  const payNow = () => {
    if (!showPrice) {
      Showtoast({
        text: 'Contact us for prices of this batch',
        toast,
        type: 'warning',
      });
      setShowContactOnWhatsAppSheet(true);
      return;
    }

    navigation.navigate(SCREEN_NAMES.PAYMENT, {
      paymentBatchType: 'group',
      paymentMethod: courseData?.paymentMethod || 'tazapay',
    });
  };

  return (
    <>
      <View className="items-center">
        <View className="flex-row border rounded-md border-gray-200 max-w-[90%]">
          {isGroupCourseAvailable && (
            <Pressable
              onPress={() => setSelectedCourseTypeToBuy('group')}
              className={`${isOneToOneCourseAvailable ? 'w-[50%]' : 'w-full'}`}>
              <View
                className="rounded py-1 px-2 items-center "
                style={btnStyle('group')}>
                <MIcon
                  name="account-group"
                  size={30}
                  color={textColors.textYlMain}
                />
                <Text
                  className={`text-[17px] leading-[20px]`}
                  style={[
                    {
                      color: textColors?.textYlMain,
                      fontFamily: FONTS.primaryFont,
                    },
                  ]}>
                  Group batch
                </Text>
              </View>
            </Pressable>
          )}

          {isOneToOneCourseAvailable && (
            <Pressable
              onPress={() => setSelectedCourseTypeToBuy('solo')}
              className={`${isGroupCourseAvailable ? 'w-[50%]' : 'w-full'}`}>
              <View
                className="rounded py-1 px-2 items-center"
                style={btnStyle('solo')}>
                <MIcon
                  name="account-supervisor"
                  size={30}
                  color={textColors.textYlMain}
                />
                <Text
                  className={`text-[17px] leading-[20px]`}
                  style={[
                    {
                      color: textColors.textYlMain,
                      fontFamily: FONTS.primaryFont,
                    },
                  ]}>
                  One to one batch
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </View>

      {selectedCourseTypeToBuy === 'solo' ? (
        <View className="mt-2" style={{backgroundColor: bgColor}}>
          <SoloBatchPayment
            courseData={courseData}
            ipData={ipData}
            timezone={timezone}
            prices={prices?.prices}
            navigation={navigation}
            ageGroups={ageGroups}
            levelNames={courseDetails?.levelNames}
            course_type={courseDetails?.course_type}
          />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {loading ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Spinner style={{alignSelf: 'center'}} />
              <TextWrapper
                ff={FONTS.signika_medium}
                color="#434a52"
                styles={{marginTop: 4, textAlign: 'center'}}>
                Loading...
              </TextWrapper>
            </View>
          ) : batches?.length > 0 ? (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{flex: 1}}
              contentContainerStyle={{padding: 2}}>
              {/* {console.log('courseData.thumbnailUrl', courseData.thumbnailUrl)} */}
              <View style={{paddingVertical: 16}} className="flex-1">
                <Image
                  source={{uri: courseData.coverPicture}}
                  resizeMode="cover"
                  className="w-full h-[200px] rounded"
                />
                {/* {courseVideos?.postDemoVideo ? (
              <VideoMediaPlayer uri={courseVideos?.postDemoVideo} />
            ) : (
            )} */}
              </View>
              {/* Age groups */}

              <View
                style={{
                  padding: 12,
                  backgroundColor: bgSecondaryColor,
                  borderRadius: 4,
                }}>
                <Pressable
                  onPress={() => setSteps(s => ({...s, step1: !s.step1}))}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <TextWrapper fs={22} fw="700" color={textColors.textPrimary}>
                    1. Select age group
                  </TextWrapper>
                  {!currentAgeGroup ? (
                    <Icon
                      name={`chevron-${!steps.step1 ? 'up' : 'down'}-outline`}
                      size={24}
                      color={COLORS.black}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={COLORS.pblue}
                    />
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
                    backgroundColor: bgSecondaryColor,
                  }}
                  disabled={!currentAgeGroup}
                  onPress={() => setSteps(s => ({...s, step2: !s.step2}))}>
                  <TextWrapper fs={22} fw="700" color={textColors.textPrimary}>
                    2. Select a batch
                  </TextWrapper>
                  {!currentSelectedBatch ? (
                    <Icon
                      name={`chevron-${!steps.step2 ? 'up' : 'down'}-outline`}
                      size={24}
                      color={COLORS.black}
                    />
                  ) : (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={COLORS.pblue}
                    />
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
                        course_type={courseDetails?.course_type}
                        levelNames={courseDetails?.levelNames}
                        showPrice={showPrice}
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
                        course_type={courseDetails?.course_type}
                        levelNames={courseDetails?.levelNames}
                        showPrice={showPrice}
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
                        course_type={courseDetails?.course_type}
                        levelNames={courseDetails?.levelNames}
                        showPrice={showPrice}
                      />
                    </Collapsible>
                  </View>
                )}
              </View>

              <View
                style={{
                  padding: 12,
                  backgroundColor: bgSecondaryColor,
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
                  <TextWrapper fs={22} fw="700" color={textColors.textPrimary}>
                    3. Make payment
                  </TextWrapper>
                  {currentSelectedBatch && currentAgeGroup ? (
                    <Icon
                      name="checkmark-circle"
                      size={32}
                      color={textColors.textYlMain}
                    />
                  ) : (
                    <Icon
                      name={`chevron-${!steps.step3 ? 'up' : 'down'}-outline`}
                      size={24}
                      color={textColors.textSecondary}
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
                    onPress={payNow}>
                    <TextWrapper fs={18} fw="700" color={COLORS.white}>
                      Pay and Enroll
                    </TextWrapper>
                  </Pressable>
                </Collapsible>
              </View>
            </ScrollView>
          ) : (
            <NoBatchesModule courseData={courseData} />
          )}
        </View>
      )}

      <ModalComponent
        visible={showContactOnWhatsAppSheet}
        onRequestClose={() => setShowContactOnWhatsAppSheet(false)}
        animationType="fade-in">
        <View className="h-[100vh] w-[100vw] flex justify-center items-center bg-[#423a3a4f]">
          <View className="bg-white w-[85%] p-2 justify-center min-h-[50%] rounded-md shadow-md shadow-gray-700 relative">
            <View className="absolute right-0 top-0">
              <MIcon
                name="close"
                size={35}
                color="gray"
                onPress={() => setShowContactOnWhatsAppSheet(false)}
              />
            </View>
            <ShowPriceFalseView courseData={courseData} />
          </View>
        </View>
      </ModalComponent>
    </>
  );
};

const AgeSelector = ({
  ageGroups,
  currentAgeGroup,
  handleCurrentAgeGroup,
  setSteps,
}) => {
  const {textColors} = useSelector(state => state.appTheme);

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
              currentAgeGroup === item.ageGroup
                ? COLORS.white
                : textColors.textSecondary
            }>
            {item.ageGroup}
          </TextWrapper>
        </Pressable>
      ))}
    </View>
  );
};

export const ShowPriceFalseView = ({courseData}) => {
  const toast = useToast();
  const {textColors, bgSecondaryColor} = useSelector(state => state.appTheme);
  // console.log('course Data is', courseData);

  const reqBatchPrices = async () => {
    try {
      console.log('hit');
      message = `Hi! i need to know the Prices of your ${courseData?.alternativeNameOnApp} Course.`;
      const link = getWhatsappRedirectUrl(message);
      await Linking.openURL(link);
    } catch (error) {
      Showtoast({
        text: "Couldn't Complete the Request, Please ensure you have Whatsapp app and try again",
        toast,
        type: 'danger',
      });
    }
  };
  return (
    <View className="flex-1 mt-3 p-2">
      <View className="items-center mt-6">
        <Image
          source={require('../assets/images/customerService.png')}
          style={{
            width: 120,
            height: 120,
            borderRadius: 20,
            marginRight: 4,
          }}
        />
        <Text
          className="text-2xl font-semibold text-center"
          style={{color: textColors.textSecondary}}>
          Contact us for prices of this batch.
        </Text>
        <View className="w-full flex-row justify-center gap-3 mt-4">
          <Pressable
            className="py-2 w-[90%] rounded-full items-center flex-row justify-center"
            style={{backgroundColor: textColors?.textYlGreen}}
            onPress={reqBatchPrices}>
            <MIcon name="whatsapp" size={25} color="white" />
            <Text className="text-white ml-1">Contact Us</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default BatchFeeDetails;

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
  payButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pblue,
    borderRadius: 4,
  },
});
