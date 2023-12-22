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

  const goToNextSlide = data => {
    setFormFields(data);
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
  };

  return (
    <View style={styles.container}>
      <TextWrapper
        fs={18}
        ff={FONTS.signika_medium}
        styles={{marginHorizontal: 16, marginTop: 8}}>
        Book Handwriting Class
      </TextWrapper>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={{width}}>
          <BookingForm goToNextSlide={goToNextSlide} />
        </View>
        <View style={{width}}>
          <Icon
            name={'arrow-back-outline'}
            size={28}
            color={COLORS.black}
            style={{marginTop: 16, marginLeft: 16}}
            onPress={goToPreviousSlide}
          />
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
    height: deviceHeight * 0.65,
    backgroundColor: COLORS.white,
  },
});
