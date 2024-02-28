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
  course_type,
  levelNames,
}) => {
  const {currentLevel} = useSelector(courseSelector);
  const [price, setPrice] = useState(0);
  const [strikeThroughPrice, setStrikeThroughPrice] = useState(0);
  const {bgSecondaryColor, textColors, darkMode} = useSelector(
    state => state.appTheme,
  );

  useEffect(() => {
    if (prices && ipData) {
      const batchPrices = prices.prices['group'];

      if (level === 1) {
        setPrice(batchPrices[`level_${level}`]?.offer);
        setStrikeThroughPrice(batchPrices[`level_${level}`]?.price);
      } else if (level === 2) {
        setPrice(batchPrices[`level_${level}`]?.offer);
        setStrikeThroughPrice(batchPrices[`level_${level}`]?.price);
      } else {
        setPrice(batchPrices[`level_${level}`]?.offer);
        setStrikeThroughPrice(batchPrices[`level_${level}`]?.price);
      }
    }
  }, [ipData, prices, level]);

  const getLevelName = level => {
    if (course_type === 'curriculum') {
      switch (level) {
        case 1:
          return levelNames?.level1Name;

        case 2:
          return levelNames?.level2Name;

        case 3:
          return levelNames?.level3Name;
      }
    } else {
      switch (level) {
        case 1:
          return 'Foundation';

        case 2:
          return 'Advanced';

        case 3:
          return 'Foundation + Advanced';
      }
    }
  };

  return (
    <View
      style={{
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
        backgroundColor: darkMode ? bgSecondaryColor : 'white',
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
              fs={20}
              fw="700"
              color={
                level === 1
                  ? textColors.textYlBlue
                  : level == 2
                  ? textColors.textYlOrange
                  : textColors.textYlRed
              }>
              {getLevelName(level)}
            </TextWrapper>
            {course_type !== 'curriculum' && (
              <TextWrapper
                fs={16}
                ff={FONTS.signika_medium}
                color={textColors.textPrimary}>
                {level === 1 || level === 2 ? '(12 classes)' : '(24 classes)'}
              </TextWrapper>
            )}
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
              fs={23}
              className="font-semibold text-[28px]"
              style={{
                color: textColors.textPrimary,
              }}>{`${ipData?.currency.symbol}${price}`}</TextWrapper>
            <TextWrapper
              styles={{textDecorationLine: 'line-through'}}
              fs={17}
              className="mr-3 line-through"
              style={{
                color: textColors.textSecondary,
              }}>{`${ipData?.currency.symbol}${strikeThroughPrice}`}</TextWrapper>
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

        <TextWrapper fs={16} color={COLORS.pgreen}>
          Select batch start date and time
        </TextWrapper>
        <ScrollView
          contentContainerStyle={{
            gap: 6,
            paddingTop: 4,
            paddingBottom: 6,
            alignItems: 'center',
          }}>
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
