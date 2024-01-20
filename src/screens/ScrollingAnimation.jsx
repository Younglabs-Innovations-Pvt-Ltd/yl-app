import React, {useRef} from 'react';
import {View, ScrollView, Image, Animated, FlatList, Text} from 'react-native';

const BANNER_H = 160;
const TOPNAV_H = 50;

const ScrollingAnimation = () => {
  const scrollA = useRef(new Animated.Value(0)).current;
  return (
    <View className="bg-[#76C8F2] ">
      <Animated.ScrollView
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollA}}}],
          {useNativeDriver: true},
        )}
        scrollEventThrottle={16}>
        <View style={styles.bannerContainer}>
          <FeatureTray scrollA={scrollA} />
        </View>
        <View className="h-[100%] relative bg-white rounded-md">
          <Text className="text-4xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores error facere exercitationem vero sapiente? Ipsum, minima cumque perferendis deleniti esse ea deserunt similique, quidem praesentium reiciendis dolorem aliquid iste numquam unde, voluptas laborum vitae atque natus quisquam mollitia aliquam omnis ratione perspiciatis? Voluptates, amet nesciunt. Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit optio, odio culpa praesentium quos laboriosam similique hic eligendi atque accusantium quod deleniti eos fugit suscipit tempore veniam fuga voluptate debitis dignissimos? Cupiditate vitae magnam nobis impedit voluptatum repellendus doloribus neque officiis provident, sit similique nulla necessitatibus adipisci iure perferendis molestiae ab ad quidem corporis harum quod et repudiandae quam accusamus? Dignissimos natus labore eum molestiae? Delectus repellendus error quam cum sint ducimus iusto mollitia. Rem, harum blanditiis.
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ScrollingAnimation;

export const FeatureTray = ({scrollA}) => {
  return (
    <Animated.View
      style={[styles.banner(scrollA)]}
      className="flex justify-center items-center">
        <Text>ahdiof hasihdf</Text>
      {/* <FlatList
        className="w-[96vw] h-[100%] mx-auto mt-9"
        data={features}
        horizontal
        keyExtractor={item => item.item}
        renderItem={item => {
          return (
            <View className=" mt-2 mr-6">
              <Image
                style={[styles.icon, {width: 76, height: 76}]}
                source={item.item}
              />
            </View>
          );
        }}
      /> */}
    </Animated.View>
  );
};

const styles = {
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
  banner: scrollA => ({
    height: BANNER_H,
    width: '200%',
    transform: [
      {
        translateY: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [-BANNER_H / 2, 0, BANNER_H * 0.75, BANNER_H * 0.75],
        }),
      },
      {
        scale: scrollA.interpolate({
          inputRange: [-BANNER_H, 0, BANNER_H, BANNER_H + 1],
          outputRange: [2, 1, 0.5, 0.5],
        }),
      },
    ],
  }),
  icon: {
    width: '100%',
    height: '100%',
  },
};