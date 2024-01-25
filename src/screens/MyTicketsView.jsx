import {View, Text} from 'react-native';
import React, {useState} from 'react';

export default MyTicketsView = () => {
  const [id, notId] = useState('33');
  return (
    <>
      <View className="flex-1 items-center">
        <Text>MyTicketsView {id}</Text>
      </View>
    </>
  );
};
