import React, {useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import TextWrapper from '../text-wrapper.component';
import {COLORS} from '../../assets/theme/theme';
import Icon from '../icon.component';
import Button from '../button.component';

const PostDemoAction = () => {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);

  const onChangeRating = rate => {
    setRating(rate);
    setIsRated(true);
  };

  return (
    <View style={styles.container}>
      {!isRated ? (
        <View style={styles.ratingContainer}>
          <TextWrapper
            fs={28}
            color={COLORS.pgreen}
            fw="600"
            styles={{textAlign: 'center'}}>
            Congratulations for completing your free class.
          </TextWrapper>
          <View style={styles.ratingWrapper}>
            <TextWrapper fs={20}>Did you like it?</TextWrapper>
            <View style={styles.starsContainer}>
              {Array.from({length: 5}, (_, i) => {
                return (
                  <Pressable key={i} onPress={() => onChangeRating(i + 1)}>
                    <Icon
                      name={
                        rating
                          ? i < rating
                            ? 'star'
                            : 'star-outline'
                          : 'star-outline'
                      }
                      size={32}
                      color={
                        rating ? (i < rating ? COLORS.pgreen : 'gray') : 'gray'
                      }
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.ctasWrapper}>
          <TextWrapper fs={20} styles={{lineHeight: 28}}>
            Would you like to continue with the course and improve your child's
            handwriting?
          </TextWrapper>
          <View style={styles.ctas}>
            <Button
              textColor={COLORS.black}
              bg={COLORS.white}
              rounded={4}
              shadow={true}>
              Yes, need more info
            </Button>
            <Button
              textColor={COLORS.black}
              bg={COLORS.white}
              rounded={4}
              shadow={true}>
              Buy on website
            </Button>
            <Button
              textColor={COLORS.black}
              bg={COLORS.white}
              shadow={true}
              rounded={4}>
              No, I don't want
            </Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default PostDemoAction;

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
  },
  ratingContainer: {
    marginTop: 16,
  },
  ratingWrapper: {
    flex: 1,
    height: 146,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    gap: 8,
  },
  ctasWrapper: {
    paddingVertical: 12,
  },
  ctas: {
    flex: 1,
    gap: 8,
    marginTop: 16,
  },
});
