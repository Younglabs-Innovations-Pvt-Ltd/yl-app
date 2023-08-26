import React, {useRef} from 'react';
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
import {COLORS} from '../assets/theme/theme';

const VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Course%20Cover%20Videos%2FENGLISH%20HANDWRITING%20COURSE%20STRUCTURE%20VIDEO.mp4?alt=media&token=8ccbe67d-3655-43da-be89-0fa482b32682';

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

const CourseDetails = ({route, navigation}) => {
  const {phone} = route.params;

  const goToForm = () => navigation.navigate('BookDemoForm', {phone});

  const onBuffer = buffer => {
    console.log(buffer);
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1}}
        contentContainerStyle={{padding: 16}}>
        <TextWrapper fs={24} fw="600">
          English Cursive Handwriting Course
        </TextWrapper>

        <View style={styles.videoContainer}>
          <Video
            source={{uri: VIDEO_URL}}
            muted={true}
            resizeMode="cover"
            style={styles.video}
            onBuffer={onBuffer}
            onLoadStart={() => console.log('loading')}
          />
        </View>
        <TextWrapper fs={18} styles={{lineHeight: 24, letterSpacing: 0.75}}>
          This course helps to get the right techniques including posture,
          pencil/pen holding and position of the notebook. Kids will get to know
          the proper structuring of the alphabets in 4-line notebook according
          to the zones with the proper height and spacing. There will be a
          gradual shift to 2-line notebook including speed techniques.
        </TextWrapper>
        <Spacer />
        <View>
          <TextWrapper fs={20} fw="700">
            Reviews
          </TextWrapper>
          <FlatList
            data={reviewData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingVertical: 16}}
            ItemSeparatorComponent={() => (
              <View style={{marginHorizontal: 12}} />
            )}
            renderItem={({item}) => {
              return (
                <View key={item.id} style={styles.reivewItem}>
                  <View style={styles.reviewRow}>
                    <Image
                      source={{uri: item.image}}
                      style={styles.reviewAvatar}
                    />
                    <TextWrapper
                      fs={18}
                      color={COLORS.black}
                      styles={{letterSpacing: 0.7}}>
                      {item.name}
                    </TextWrapper>
                  </View>
                  <View style={styles.reivewContent}>
                    <TextWrapper fs={18}>{item.review}</TextWrapper>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <SafeAreaView edges={['bottom']} style={{padding: 16}}>
        <Pressable
          style={({pressed}) => [
            styles.btnBooking,
            {opacity: pressed ? 0.8 : 1},
          ]}
          onPress={goToForm}>
          <TextWrapper
            fs={18}
            color={COLORS.white}
            styles={{textTransform: 'capitalize'}}>
            Book first class for free
          </TextWrapper>
        </Pressable>
      </SafeAreaView>
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
});
