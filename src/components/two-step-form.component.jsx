import React, {useRef, useState} from 'react';
import {StyleSheet, View, ScrollView, Dimensions} from 'react-native';
import BookingForm from './booking-form.component';
import Icon from './icon.component';
import {COLORS} from '../utils/constants/colors';
import BookDemoSlots from '../screens/book-demo-slots.screen';

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
    <View style={{height: deviceHeight * 0.8}}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}>
        <BookingForm goToNextSlide={goToNextSlide} />
        <View style={{width}}>
          <View style={{flex: 1}}>
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
        </View>
      </ScrollView>
    </View>
  );
};

export default TwoStepForm;

const styles = StyleSheet.create({});
