import React, {useMemo} from 'react';
import {Pressable} from 'react-native';
import Icon from './icon.component';

const RatingStars = ({rating, onChangeRating, color}) => {
  const RATING_STARS = useMemo(() => {
    return Array.from({length: 5}, (_, i) => {
      return (
        <Pressable key={i} onPress={() => onChangeRating(i + 1)}>
          <Icon
            name={
              rating ? (i < rating ? 'star' : 'star-outline') : 'star-outline'
            }
            size={32}
            color={rating ? (i < rating ? color : color) : color}
          />
        </Pressable>
      );
    });
  }, [rating]);

  return RATING_STARS;
};

export default RatingStars;
