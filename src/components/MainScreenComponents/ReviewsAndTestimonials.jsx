import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {contentSelector} from '../../store/content/selector';
import {fetchContentDataStart} from '../../store/content/reducer';
import TextWrapper from '../text-wrapper.component';
import {FONTS} from '../../utils/constants/fonts';
import {FlatList} from 'react-native-gesture-handler';
import VideoPlayer from '../video-player.component';

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
        <View className="h-[200px] w-full overflow-hidden">
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
              <View
                className={`h-[180px] w-[130px]  rounded ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}></View>
              //   <VideoPlayer
              //     key={item.id}
              //     uri={item.uri}
              //     poster={item.poster}
              //     thumbnailText={item?.thumbnailText}
              //     aspectRatio={9 / 16}
              //   />
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
            <View
              className={`h-[180px] w-[130px]  rounded ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}></View>
            // <VideoPlayer
            //   key={item.id.toString()}
            //   uri={item.uri}
            //   poster={item.poster}
            //   thumbnailText={item?.thumbnailText}
            //   aspectRatio={9 / 16}
            // />
          )}
        />
      </View>
    </View>
  );
};

export default ReviewsAndTestimonials;
