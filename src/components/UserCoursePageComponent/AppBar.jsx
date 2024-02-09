import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../../store/app-theme/appThemeReducer';
import {StyleSheet, Switch} from 'react-native';
import {Text, View} from 'react-native-animatable';

const AppBar = ({bgSecondaryColor, darkMode, textColors, userName}) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const dispatch = useDispatch();
  const onToggleSwitch = () => {
    setIsSwitchOn(!isSwitchOn);
    dispatch(setDarkMode(!isSwitchOn));
  };
  const styles = StyleSheet.create({
    myView: {
      backgroundColor: darkMode ? bgSecondaryColor : 'white',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 10,
    },
  });
  const [value, setValue] = useState(null);

  return (
    <View
      style={styles.myView}
      className="flex w-[100%]  h-[60px] px-3 flex-row justify-between items-center">
      <Text
        style={{color: textColors?.textPrimary}}
        className="font-semibold text-[20px] text-black">
        {userName}
      </Text>
      {/* <Switch
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isSwitchOn ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onToggleSwitch}
        value={isSwitchOn}
      /> */}
      <Text
        style={{
          color: textColors?.textPrimary,
        }}
        className="font-semibold text-[20px] text-black">
        My Course
      </Text>
    </View>
  );
};

export default AppBar;
