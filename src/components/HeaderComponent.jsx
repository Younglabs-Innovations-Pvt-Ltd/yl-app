import {View, Text, Pressable} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheetComponent from './BottomSheetComponent';
import DropdownComponent from './DropdownComponent';
import Input from './CustomInputComponent';

const HeaderComponent = ({navigation, setShowAddChildView}) => {
  const handleShowDrawer = () => navigation.openDrawer();
  const dispatch = useDispatch();
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );

  const changeDarkMode = payload => {
    console.log('changing dark mode to ', payload);
    dispatch(setDarkMode(payload));
  };

  return (
    <>
      <View
        style={tw`flex flex-row justify-between w-[100%] px-2 py-1 bg-[${bgSecondaryColor}]
          }`}>
        <View className="flex-row items-center">
          <View className="px-2 justify-center">
            {darkMode ? (
              <MIcon
                name="brightness-4"
                color="white"
                size={28}
                onPress={() => changeDarkMode(false)}
              />
            ) : (
              <MIcon
                name="brightness-6"
                color="orange"
                size={28}
                onPress={() => changeDarkMode(true)}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('UserProfileScreen')}>
            <View style={tw` pr-2 flex-row gap-2 justify-end items-center`}>
              <View
                style={[
                  {
                    borderRadius: 50,
                    padding: 4,
                    backgroundColor: textColors.textYlMain,
                  },
                ]}>
                <MIcon name="account" size={25} color="white" />
              </View>

              <View style={tw`gap-0`}>
                <Text
                  style={tw`${
                    darkMode
                      ? `text-[${textColors.textPrimary}]`
                      : 'text-blue-900'
                  } text-[16px] font-black`}>
                  Hello, Rahul Sharma
                </Text>
                <Text
                  style={tw`text-[${textColors.textSecondary}] text-[10px] font-semibold `}>
                  970 points
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View>
            <Pressable
              className={`${
                darkMode ? 'bg-gray-500' : 'bg-gray-200'
              } rounded-full p-1`}
              onPress={() => setShowAddChildView(true)}>
              <MIcon name="plus" size={25} color={textColors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={tw`w-[20%]  flex-row gap-2 items-center justify-end`}>
          <MIcon
            name="menu"
            size={30}
            color={textColors.textYlMain}
            onPress={handleShowDrawer}
          />
        </View>
      </View>
    </>
  );
};

export const AddChildModule = () => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const [childName, setChildName] = useState(null);
  const [childAge, setChildAge] = useState(null);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);

  const ageArray = [
    {label: '5', value: 5},
    {label: '6', value: 6},
    {label: '7', value: 7},
    {label: '8', value: 8},
    {label: '9', value: 9},
    {label: '10', value: 10},
    {label: '11', value: 11},
    {label: '12', value: 12},
    {label: '13', value: 13},
    {label: '14', value: 14},
  ];

  const addChild = () => {
    let body = {
      name: childName,
      age: childAge,
    };

    console.log("isFiled filled", isFieldsFilled);
    console.log('body is', body);
  };

  useEffect(() => {
    console.log("runn");
    
    if (childName == null || childName?.length < 2) {
      setIsFieldsFilled(false);
      return;
    } else if (childAge === null || !childAge) {
      setIsFieldsFilled(false);
      return;
    } else {
      setIsFieldsFilled(true);
      return;
    }
  },[childAge, childName]);

  return (
    <>
      <View className="w-full items-center flex-1">
        <Text
          className="text-2xl font-semibold text-center"
          style={{color: textColors.textSecondary}}>
          Add Another child
        </Text>

        <View className="w-[95%] mt-4">
          <Input setValue={setChildName} placeHolder="Enter Child Name" value={childName} isDisabled={false}/>

          <View className="w-full mt-1">
            <DropdownComponent
              data={ageArray}
              placeHolder="Select Child Age"
              setSelectedValue={setChildAge}
            />
          </View>

          <TouchableOpacity
            className="py-3 rounded-full w-full mt-3"
            style={{backgroundColor: colorYlMain}}
            onPress={addChild}
            disabled={!isFieldsFilled}>
            <Text className="text-center text-white text-base font-semibold">
              Click to add Child
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default HeaderComponent;
