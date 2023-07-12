import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Image, StyleSheet, View, Dimensions} from 'react-native';

const image_1 =
  'https://images.unsplash.com/photo-1688410053066-efae78ae17ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80';
const image_2 =
  'https://images.unsplash.com/photo-1688168293343-e1c824a4ace5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80';
const image_3 =
  'https://images.unsplash.com/photo-1688503259180-34294811a436?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=640&q=80';

const {width: windowWidth} = Dimensions.get('window');

const slider_data = [
  {
    id: 1,
    url: image_1,
  },
  {
    id: 2,
    url: image_2,
  },
  {
    id: 3,
    url: image_3,
  },
];

const Slider = () => {
  const [sliderCurrentIndex, setSliderCurrentIndex] = useState(0);
  const sliderRef = useRef(null);

  const updateSliderIndex = e => {
    const offsetIndex = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
    setSliderCurrentIndex(offsetIndex);
  };

  useEffect(() => {
    sliderRef.current.scrollToOffset({
      offset: sliderCurrentIndex * windowWidth,
    });
  }, [sliderCurrentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSliderCurrentIndex(currentIndex => {
        if (currentIndex >= slider_data.length - 1) {
          return 0;
        } else {
          return currentIndex + 1;
        }
      });
    }, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View>
      <FlatList
        ref={sliderRef}
        data={slider_data}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={updateSliderIndex}
        renderItem={({item}) => {
          return <Image source={{uri: item.url}} style={[styles.image]} />;
        }}
      />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  image: {
    width: windowWidth,
    minHeight: 200,
    objectFit: 'cover',
  },
  indicatorWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingVertical: 8,
  },
  indicator: {
    width: 6,
    height: 6,
    backgroundColor: 'gray',
    borderRadius: 3,
  },
});
