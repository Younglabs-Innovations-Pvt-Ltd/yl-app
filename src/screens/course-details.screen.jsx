import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import TextWrapper from '../components/text-wrapper.component';
import Spacer from '../components/spacer.component';
import {SafeAreaView} from 'react-native-safe-area-context';
import Video from 'react-native-video';
import {COLORS} from '../utils/constants/colors';
import {SCREEN_NAMES} from '../utils/constants/screen-names';
import {getCourseDetails} from '../utils/api/course.api';
import {useDispatch, useSelector} from 'react-redux';
import {fetchCourseStart} from '../store/course/course.reducer';
import {courseSelector} from '../store/course/course.selector';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {bookDemoSelector} from '../store/book-demo/book-demo.selector';
import {startFetchingIpData} from '../store/book-demo/book-demo.reducer';
import {joinDemoSelector} from '../store/join-demo/join-demo.selector';
import {generateOffering} from '../utils/offering';
import RazorpayCheckout from 'react-native-razorpay';

const {width: deviceWidth} = Dimensions.get('window');

const ITEM_WIDTH = deviceWidth * 0.75;

const BASE_URL =
  'https://111f-2401-4900-1c5a-6d3e-cd37-1829-ad3-43b6.ngrok-free.app';

const CourseDetails = ({route, navigation}) => {
  const [currentAgeGroup, setCurrentAgeGroup] = useState('');
  const [currentSelectedBatch, setCurrentSelectedBatch] = useState(null);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelText, setLevelText] = useState('');

  const dispatch = useDispatch();

  const {
    courseDetails,
    ageGroups,
    courseId,
    batches,
    prices,
    message,
    loading,
  } = useSelector(courseSelector);
  const {ipData} = useSelector(bookDemoSelector);
  const {bookingDetails} = useSelector(joinDemoSelector);

  const onBuffer = buffer => {
    console.log(buffer);
  };

  useEffect(() => {
    if (!ipData) {
      dispatch(startFetchingIpData());
    }
  }, [ipData]);

  useEffect(() => {
    if (currentLevel === 1) {
      setLevelText('Foundation');
    } else if (currentLevel === 2) {
      setLevelText('Advanced');
    } else {
      setLevelText('Foundation + Advanced');
    }
  }, [currentLevel]);

  useEffect(() => {
    dispatch(fetchCourseStart({courseId: 'Eng_Hw'}));
  }, []);

  useEffect(() => {
    if (ageGroups.length) {
      setCurrentAgeGroup(ageGroups[0].ageGroup);
    }
  }, [ageGroups.length]);

  useEffect(() => {
    if (currentAgeGroup) {
      const filteredBatches = batches.filter(
        item => item.ageGroup === currentAgeGroup,
      );

      setFilteredBatches(filteredBatches);
    }
  }, [currentAgeGroup, batches]);

  const handleBuyNowClick = async (price, strikeThroughPrice) => {
    console.log('price', price);
    // setBatchError("");
    if (!currentSelectedBatch) {
      // setBatchError("Please select a batch first");
      return;
    }

    let selectBatch = {...currentSelectedBatch};

    selectBatch.price = parseInt(price);
    selectBatch.strikeThroughPrice = parseInt(strikeThroughPrice);
    // selectBatch.offeringId = offeringId;
    selectBatch.levelText = levelText;
    selectBatch.courseType = courseDetails?.course_type;

    if (levelText === 'Foundation + Advanced') {
      selectBatch.actualItems = 2;
    } else {
      selectBatch.actualItems = 1;
    }

    const startDate = new Date(selectBatch.startDate._seconds * 1000);

    const startDateTime = moment(startDate).format('YYYY-MM-DD HH:mm');

    const countryCode = parseInt(ipData?.calling_code.split('+')[1]);
    // const country = ipData?.country_name;
    const timezone = ipData?.time_zone?.offset;

    const daysArrString = selectBatch?.daysArr.split(',').join('');

    const body = {
      courseType: selectBatch?.courseType,
      leadId: bookingDetails.leadId,
      ageGroup: selectBatch?.ageGroup,
      courseId: selectBatch?.courseId,
      FCY: `${ipData?.currency?.code} ${selectBatch?.price}`,
      promisedStartDate: startDateTime,
      promisedBatchFrequency: daysArrString,
      phone: bookingDetails.phone,
      fullName: bookingDetails.parentName,
      batchId: selectBatch?.batchId,
      childName: bookingDetails.childName,
      email: 'test@gmail.com',
      childAge: bookingDetails.childAge,
      timezone,
      countryCode,
    };

    const offeringBody = generateOffering(selectBatch);

    body.offeringData = offeringBody;
    console.log('body=', body);

    const response = await fetch(`${BASE_URL}/shop/orderhandler/makepayment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log(data);

    const {amount, id: order_id, currency} = data.order;

    const orderResp = await fetch(`${BASE_URL}/shop/orderhandler/addToBag`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bagDetails: {...body, rpOrderId: order_id, type: 'order'},
        leadId: body?.leadId,
      }),
    });

    const orderRes = await orderResp.json();
    console.log(orderRes);

    let config = {
      display: {
        blocks: {
          banks: {
            name: 'Pay via UPI',
            instruments: [
              {
                method: 'upi',
              },
            ],
          },
        },
        sequence: ['block.banks'],
        preferences: {
          show_default_blocks: false,
        },
      },
    };

    const options = {
      key: 'rzp_test_0cYlLVRMEaCUDx',
      currency,
      amount: amount?.toString(),
      order_id,
      name: 'Young Labs',
      description: 'Younglabs Innovations',
    };

    RazorpayCheckout.open(options)
      .then(async data => {
        console.log(data);
      })
      .catch(error => {
        // handle failure
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 16}}>
        {/* Steps */}
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TextWrapper fs={54} fw="700" color={COLORS.pblue}>
              1
            </TextWrapper>
            <View>
              <TextWrapper fs={18} fw="700" color={COLORS.pblue}>
                Select a batch
              </TextWrapper>
              <TextWrapper>
                Choose a batch according to your child's age
              </TextWrapper>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TextWrapper fs={54} fw="700" color={COLORS.pgreen}>
              2
            </TextWrapper>
            <View>
              <TextWrapper fs={18} fw="700" color={COLORS.pgreen}>
                Fill details
              </TextWrapper>
              <TextWrapper>Fill the required information</TextWrapper>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <TextWrapper fs={54} fw="700" color={COLORS.orange}>
              3
            </TextWrapper>
            <View>
              <TextWrapper fs={18} fw="700" color={COLORS.orange}>
                Make payment
              </TextWrapper>
              <TextWrapper>Get access to the course</TextWrapper>
            </View>
          </View>
        </View>

        {/* Age groups */}
        <View
          style={{
            paddingTop: 20,
            paddingBottom: 16,
          }}>
          <TextWrapper fs={24} fw="700" styles={{textAlign: 'center'}}>
            Select age group:
          </TextWrapper>
          <AgeSelector
            ageGroups={ageGroups}
            currentAgeGroup={currentAgeGroup}
            setCurrentAgeGroup={setCurrentAgeGroup}
          />
        </View>

        {/* Batch card */}
        {filteredBatches.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}>
            <BatchCard
              ipData={ipData}
              ageGroups={ageGroups}
              courseDetails={courseDetails}
              prices={prices}
              level={1}
              batchOptions={filteredBatches.filter(batch => batch.level === 1)}
              setCurrentSelectedBatch={setCurrentSelectedBatch}
              currentSelectedBatch={currentSelectedBatch}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
              levelText={levelText}
              setLevelText={setLevelText}
              currentAgeGroup={currentAgeGroup}
              handleBuyNowClick={handleBuyNowClick}
            />
            <BatchCard
              ipData={ipData}
              ageGroups={ageGroups}
              courseDetails={courseDetails}
              prices={prices}
              level={2}
              batchOptions={filteredBatches.filter(batch => batch.level === 2)}
              setCurrentSelectedBatch={setCurrentSelectedBatch}
              currentSelectedBatch={currentSelectedBatch}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
              levelText={levelText}
              setLevelText={setLevelText}
              currentAgeGroup={currentAgeGroup}
              handleBuyNowClick={handleBuyNowClick}
            />
            <BatchCard
              ipData={ipData}
              ageGroups={ageGroups}
              courseDetails={courseDetails}
              prices={prices}
              level={3}
              batchOptions={filteredBatches.filter(batch => batch.level === 1)}
              setCurrentSelectedBatch={setCurrentSelectedBatch}
              currentSelectedBatch={currentSelectedBatch}
              currentLevel={currentLevel}
              setCurrentLevel={setCurrentLevel}
              levelText={levelText}
              setLevelText={setLevelText}
              currentAgeGroup={currentAgeGroup}
              handleBuyNowClick={handleBuyNowClick}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const AgeSelector = ({ageGroups, currentAgeGroup, setCurrentAgeGroup}) => {
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
          onPress={() => setCurrentAgeGroup(item.ageGroup)}>
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

const BatchCard = ({
  batchOptions,
  level,
  ageGroups,
  courseDetails,
  prices,
  setCurrentSelectedBatch,
  currentSelectedBatch,
  levelText,
  setLevelText,
  currentLevel,
  setCurrentLevel,
  currentAgeGroup,
  ipData,
  handleBuyNowClick,
}) => {
  const [price, setPrice] = useState(0);
  const [strikeThroughPrice, setStrikeThroughPrice] = useState(0);

  useEffect(() => {
    if (prices && ipData) {
      const batchPrices = prices.prices.batchPrices;
      const country = batchPrices?.find(
        item => item.countryCode === ipData.country_code2,
      );
      // const offeringDetails = prices.prices.offeringDetails

      if (level === 1) {
        setPrice(country?.prices?.level1?.offer);
        setStrikeThroughPrice(country?.prices?.level1?.price);
      } else if (level === 2) {
        setPrice(country?.prices?.level2?.offer);
        setStrikeThroughPrice(country?.prices?.level2?.price);
      } else {
        setPrice(country?.prices?.combo?.offer);
        setStrikeThroughPrice(country?.prices?.combo?.price);
      }
    }
  }, [ipData, prices]);

  useEffect(() => {
    if (batchOptions.length) {
      setCurrentSelectedBatch(batchOptions[0]);
    }
  }, []);

  return (
    <View
      style={{
        marginTop: 12,
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
      }}>
      <View
        style={{
          padding: 16,
          borderRadius: 6,
          elevation: 1.25,
        }}>
        <TextWrapper
          fs={24}
          fw="700"
          color={level === 1 ? '#2A6AC9' : COLORS.orange}
          styles={{textAlign: 'center'}}>
          {level === 1
            ? 'Foundation'
            : level === 2
            ? 'Advanced'
            : 'Foundation + Advanced'}
        </TextWrapper>
        <Spacer />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <MIcon name="book-variant" size={36} color={COLORS.black} />
          <TextWrapper fs={24}>
            Total Classess: {level === 1 || level === 2 ? 12 : 24}
          </TextWrapper>
        </View>
        <Spacer space={8} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <MIcon name="cake-variant" size={36} color={COLORS.black} />
          <TextWrapper fs={24}>For Ages: {currentAgeGroup}</TextWrapper>
        </View>
        <Spacer />
        <TextWrapper fs={22} color={COLORS.pgreen}>
          Select batch start date and time
        </TextWrapper>
        <Spacer />
        <View style={{gap: 8}}>
          {batchOptions.length > 0 &&
            currentSelectedBatch &&
            batchOptions.map((batch, index) => {
              return (
                <BatchDateAndTime
                  key={index}
                  batch={batch}
                  setCurrentSelectedBatch={setCurrentSelectedBatch}
                  currentSelectedBatch={currentSelectedBatch}
                  option={level === 1 ? 'Foundation' : 'Foundation + Advanced'}
                  levelText={levelText}
                  setLevelText={setLevelText}
                  level={level}
                  currentLevel={currentLevel}
                  setCurrentLevel={setCurrentLevel}
                />
              );
            })}
        </View>
        <View style={{paddingVertical: 16, marginTop: 8}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}>
            <TextWrapper
              fs={24}>{`${ipData?.currency.symbol}${price}`}</TextWrapper>
            <TextWrapper
              styles={{textDecorationLine: 'line-through'}}
              fs={
                18
              }>{`${ipData?.currency.symbol}${strikeThroughPrice}`}</TextWrapper>
          </View>
        </View>
        <View style={{}}>
          <Pressable
            style={({pressed}) => [
              styles.payButton,
              {opacity: pressed ? 0.8 : 1},
            ]}
            onPress={() => handleBuyNowClick(price, strikeThroughPrice)}>
            <TextWrapper fs={18} fw="700" color={COLORS.white}>
              Pay and Enroll
            </TextWrapper>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const BatchDateAndTime = ({
  batch,
  currentSelectedBatch,
  setCurrentSelectedBatch,
  level,
  currentLevel,
  setCurrentLevel,
}) => {
  if (!batch) return null;

  const date = new Date(batch.startDate._seconds * 1000);
  const dateAndTime = moment(date).format('MMMM Do [at] h:mm A');

  const handleBatch = () => {
    setCurrentSelectedBatch(batch);
    setCurrentLevel(level);
  };

  return (
    <Pressable
      style={{
        padding: 16,
        borderRadius: 6,
        elevation: 1.25,
        backgroundColor:
          currentSelectedBatch.batchId === batch.batchId &&
          currentLevel === level
            ? COLORS.pblue
            : 'transparent',
      }}
      onPress={handleBatch}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        <MIcon name="calendar-month" size={28} color={COLORS.black} />
        <TextWrapper fs={20}>{dateAndTime}</TextWrapper>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 16,
        }}>
        {batch.daysArr.split(',').map((item, index) => (
          <TextWrapper key={index} fs={18} color={COLORS.black}>
            {item}
          </TextWrapper>
        ))}
      </View>
    </Pressable>
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
    backgroundColor: COLORS.pblue,
    borderRadius: 4,
  },
});
