////////////////////////
// Current not in use
///////////////////////

import React, {useRef, useState} from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import BookingForm from './booking-form.component';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';
import BookDemoSlots from '../screens/book-demo-slots.screen';
import TextWrapper from './text-wrapper.component';
import {FONTS} from '../utils/constants/fonts';

const {height: deviceHeight, width} = Dimensions.get('window');

const TwoStepForm = ({closeModal}) => {
  const scrollViewRef = useRef(null);
  const [formFields, setFormFields] = useState(null);
  const [isNextSlide, setIsNextSlide] = useState(false);

  const goToNextSlide = data => {
    setFormFields(data);
    setIsNextSlide(true);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: width,
        animated: true,
      });
    }
  };

  const goToPreviousSlide = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: -width,
        animated: true,
      });
    }
    setIsNextSlide(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isNextSlide && (
          <Icon
            name={'arrow-back-outline'}
            size={28}
            color={COLORS.black}
            style={{marginLeft: 16}}
            onPress={goToPreviousSlide}
          />
        )}
        <TextWrapper
          fs={20}
          ff={FONTS.signika_medium}
          styles={{marginHorizontal: 16}}>
          Book Free Handwriting Class
        </TextWrapper>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}>
        <View style={{width}}>
          <BookingForm goToNextSlide={goToNextSlide} />
        </View>
        <View style={{width}}>
          {formFields && (
            <BookDemoSlots
              route={{params: {formFields}}}
              onClose={closeModal}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default TwoStepForm;

const styles = StyleSheet.create({
  container: {
    // height: deviceHeight * 0.65,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
