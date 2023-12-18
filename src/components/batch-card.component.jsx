import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ScrollView} from 'react-native';
import {COLORS} from '../utils/constants/colors';
import BatchDateAndTime from './batchDateAndTime.component';
import Spacer from './spacer.component';
import TextWrapper from './text-wrapper.component';

import {useSelector} from 'react-redux';
import {courseSelector} from '../store/course/course.selector';
import {FONTS} from '../utils/constants/fonts';

const BatchCard = ({
  batchOptions,
  level,
  prices,
  ipData,
  currentAgeGroup,
  currentSelectedBatch,
  levelText,
}) => {
  const {currentLevel} = useSelector(courseSelector);
  const [price, setPrice] = useState(0);
  const [strikeThroughPrice, setStrikeThroughPrice] = useState(0);

  useEffect(() => {
    if (prices && ipData) {
      const batchPrices = prices.prices.batchPrices;
      const country = batchPrices?.find(
        item => item.countryCode === ipData.country_code2,
      );

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
  }, [ipData, prices, level]);

  return (
    <View
      style={{
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
      }}>
      <View
        style={{
          borderWidth: 2.5,
          borderColor: '#eee',
          paddingVertical: 16,
          paddingLeft: 16,
          paddingRight: 8,
          borderRadius: 6,
          // elevation: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <TextWrapper
              fs={24}
              fw="700"
              color={level === 1 ? '#2A6AC9' : COLORS.orange}>
              {level === 1
                ? 'Foundation'
                : level === 2
                ? 'Advanced'
                : 'Foundation + Advanced'}
            </TextWrapper>
            <TextWrapper fs={16} ff={FONTS.signika_medium} color="#434a52">
              {level === 1 || level === 2 ? '(12 classes)' : '(24 classes)'}
            </TextWrapper>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4,
            }}>
            <TextWrapper
              fs={23}>{`${ipData?.currency.symbol}${price}`}</TextWrapper>
            <TextWrapper
              styles={{textDecorationLine: 'line-through'}}
              fs={
                17
              }>{`${ipData?.currency.symbol}${strikeThroughPrice}`}</TextWrapper>
          </View>
        </View>
        <Spacer />
        {/* <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
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
        <Spacer /> */}

        <TextWrapper fs={20} color={COLORS.pgreen}>
          Select batch start date and time
        </TextWrapper>
        <ScrollView
          horizontal
          contentContainerStyle={{gap: 6, paddingTop: 4, paddingBottom: 6}}>
          {batchOptions.length > 0 &&
            batchOptions.map((batch, index) => {
              return (
                <BatchDateAndTime
                  key={index}
                  batch={batch}
                  option={
                    level === 1
                      ? 'Foundation'
                      : level === 2
                      ? 'Advanced'
                      : 'Foundation+Advanced'
                  }
                  level={level}
                  currentAgeGroup={currentAgeGroup}
                  currentSelectedBatch={currentSelectedBatch}
                  levelText={levelText}
                  currentLevel={currentLevel}
                  price={price}
                  strikeThroughPrice={strikeThroughPrice}
                />
              );
            })}
        </ScrollView>
        {/* <View style={{marginTop: 8}}>
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
        </View> */}
        {/* <View style={{}}>
          <Pressable
            style={({pressed}) => [
              styles.payButton,
              {
                opacity: pressed ? 0.8 : 1,
                backgroundColor:
                  level === currentLevel ? COLORS.pblue : '#DDF2FD',
              },
            ]}
            onPress={() => setVisibleCheckout(true)}
            disabled={level !== currentLevel}>
            <TextWrapper fs={18} fw="700" color={COLORS.white}>
              Pay and Enroll
            </TextWrapper>
          </Pressable>
        </View> */}
      </View>
    </View>
  );
};

export default BatchCard;

const styles = StyleSheet.create({
  payButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.pblue,
    borderRadius: 4,
  },
});
