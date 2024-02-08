import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {contentSelector} from '../../store/content/selector';
import {fetchContentDataStart} from '../../store/content/reducer';
import TextWrapper from '../text-wrapper.component';
import {FONTS} from '../../utils/constants/fonts';
import {FlatList} from 'react-native-gesture-handler';
import Video from '../video.component';
import Testimonial from './Testimonial';
import {reviews} from '../../assets/data/reviews';

const ReviewsAndTestimonials = () => {
  const dispatch = useDispatch();
  const {contentData, contentLoading} = useSelector(contentSelector);
  const {darkMode, bgColor, textColors, colorYlMain, bgSecondaryColor} =
    useSelector(state => state.appTheme);
  // console.log('content Data loading', contentLoading);

  useEffect(() => {
    dispatch(fetchContentDataStart());
  }, []);

  // console.log("Content Data is" , contentData)

  return (
    <View className="w-full">
      {/* Video slider */}
      <View
        style={{paddingVertical: 8}}
        // onLayout={event => handleSectionLayout('reviews', event)}>
        onLayout={event => {
          console.log('event is');
        }}>
        <Text style={[FONTS.heading, {color: textColors.textPrimary}]}>
          {contentData?.content?.reviews?.heading}
        </Text>
        <Text
          style={[
            {
              color: textColors.textPrimary,
              fontFamily: FONTS.primaryFont,
              lineHeight: 18,
              fontSize: 16,
            },
          ]}>
          {contentData?.content?.reviews?.subheading}
        </Text>
        {/* <Spacer /> */}
        <View className="w-full overflow-hidden">
          <FlatList
            data={contentData?.reviews}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{marginHorizontal: 4}} />
            )}
            className="mt-4 rounded overflow-hidden"
            renderItem={({item}) => (
              <Video
                key={item.id}
                uri={item.uri}
                poster={item.poster}
                thumbnailText={item?.thumbnailText}
                aspectRatio={9 / 16}
              />
            )}
          />
        </View>
      </View>

      {/* Tips and tricks */}
      {/* Video slider */}
      <View
        style={{paddingVertical: 8}}
        onLayout={event => {
          console.log('event: ');
        }}>
        <Text
          style={[
            FONTS.heading,
            {
              color: textColors.textPrimary,
            },
          ]}>
          {contentData?.content?.tips?.heading}
        </Text>
        <Text
          style={[
            {
              color: textColors.textPrimary,
              fontFamily: FONTS.primaryFont,
              lineHeight: 18,
              fontSize: 16,
            },
          ]}>
          {contentData?.content?.tips?.subheading}
        </Text>
        <FlatList
          data={contentData?.tips}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-4"
          ItemSeparatorComponent={() => <View style={{marginHorizontal: 4}} />}
          renderItem={({item}) => (
            <Video
              key={item.id}
              uri={item.uri}
              poster={item.poster}
              thumbnailText={item?.thumbnailText}
              aspectRatio={9 / 16}
            />
          )}
        />
      </View>

      {/* Testimonials */}
      <View className="w-full mt-5">
        <View>
          <Text
            className={``}
            style={[FONTS.heading, {color: textColors.textPrimary}]}>
            What Our Customer Speak
          </Text>
        </View>
        <View className="w-[100%] mt-1">
          <FlatList
            data={reviews}
            keyExtractor={item => item.id}
            renderItem={item => {
              return <Testimonial data={item.item} />;
            }}
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={() => {
              return <View className="p-1"></View>;
            }}
            horizontal
          />
        </View>
      </View>
    </View>
  );
};

export default ReviewsAndTestimonials;
