import React from 'react';
import {StyleSheet, FlatList, View, Dimensions, Image} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';

const reviewData = [
  {
    id: 1,
    name: 'Savita Kolte',
    review:
      'Excellent course for anyone who wants to learn or improve on handwriting. The course is very interesting and my son really enjoyed learning.',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAEdFTp4UUHXUK1FvZz2x5ao31IUUo9PfnlzL5VNipJNT%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 2,
    name: 'Manjiri Panganti',
    review:
      "Handwriting class taken by Shamee ma'am was excellent, Siya improved a lot thank you ma'am 🙂",
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAEdFTp6l_OP6eo_HODiPizvz1mdmWlCRBzJaYMdpIC4Y%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 3,
    name: 'Suganya Sureshkumar',
    review:
      'I am happy in a way my daughters writing has improved a way far better. Loved the patience of the teacher Aarti mam and she was very friendly with my daughter.',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa-%2FAD5-WClv3nGWCehwFcggGNlq0nLLZEdTFNGyIX-QosheOw%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 4,
    name: 'Kirthi GA',
    review:
      'Hello everyone, my daughter kanishga has made great strides in her handwriting, and she is eager to learn from Mamta Sharma madam, who has been very cooperative.Thank you',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa-%2FAD5-WClbsoEkCyl5jNeS8Cg8LPXsQ6UxjPZ6Wj821srnNg%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 5,
    name: 'Richa Chugh',
    review:
      'I am very satisfied with the course Meenakshi ma’am was really very good and taught all the content very well in her class',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAEdFTp4olVBXAw2QfP-rF1XK9SfBoUAny71mwTOEPB3x%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 6,
    name: 'Aahil Sadat',
    review:
      'Great experience with Samina mam. My kid really improved his hand writing.',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa-%2FAD5-WCklq8LLcjDGbfyJjmEPeu1CNQYw19Ke11f4eCo7aQ%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
  {
    id: 7,
    name: 'P Varalakshmi',
    review:
      'Good learning platform for kids. Thank you for your assistance in learning journey to my child',
    image:
      'https://www.younglabs.in/_next/image?url=https%3A%2F%2Flh3.googleusercontent.com%2Fa%2FAEdFTp6r1Ot7sgBqHhzjof2GVFToCECjd1oa5ythm94X%3Ds120-c-c0x00000000-cc-rp-mo-br100&w=128&q=75',
  },
];

const {width: deviceWidth} = Dimensions.get('window');

const ITEM_WIDTH = deviceWidth * 0.75;

const Reviews = () => {
  return (
    <FlatList
      data={reviewData}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{padding: 4}}
      ItemSeparatorComponent={() => <View style={{marginHorizontal: 12}} />}
      renderItem={({item}) => {
        return (
          <View key={item.id} style={styles.reivewItem}>
            <View style={styles.reviewRow}>
              <Image source={{uri: item.image}} style={styles.reviewAvatar} />
              <TextWrapper
                fs={18}
                ff={FONTS.signika_semiBold}
                color={'#434a52'}
                styles={{letterSpacing: 0.7}}>
                {item.name}
              </TextWrapper>
            </View>
            <View style={styles.reivewContent}>
              <TextWrapper ff={FONTS.signika_medium} color="#484848">
                {item.review}
              </TextWrapper>
            </View>
          </View>
        );
      }}
    />
  );
};

export default Reviews;

const styles = StyleSheet.create({
  reivewItem: {
    width: ITEM_WIDTH,
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'gray',
  },
  reviewRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingBottom: 8,
  },
  reviewAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  reivewContent: {
    // paddingVertical: 8,
  },
});
