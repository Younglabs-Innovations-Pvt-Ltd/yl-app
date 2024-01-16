import {View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import Input from '../CustomInputComponent';
import DropdownComponent from '../DropdownComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BookDemoScreen from '../../screens/book-demo-form.screen';
import { authSelector } from '../../store/auth/selector';

export const AddChildModule = () => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const [childName, setChildName] = useState(null);
  const [childAge, setChildAge] = useState(null);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  
  const {customer} = useSelector(authSelector)

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

    console.log('isFiled filled', isFieldsFilled);
    console.log('body is', body);
  };

  useEffect(() => {
    console.log('runn');

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
  }, [childAge, childName]);

  return (
    <>
      <View className="w-full items-center flex-1">
        {customer === 'yes' ? (
          <>
            <Text
              className="text-2xl font-semibold text-center"
              style={{color: textColors.textSecondary}}>
              Add Another child
            </Text>

            <View className="w-[95%] mt-4">
              <Input
                setValue={setChildName}
                placeHolder="Enter Child Name"
                value={childName}
                isDisabled={false}
              />

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
          </>
        ) : (
          <BookDemoScreen
            navigation={''}
            data={{country: {callingCode: 91}, phone: 7668983758}}
            courseId={'Eng_Hw'}
            setSelectedTab={''}
            demoAvailableType={'both'}
            place={'addChildModal'}
          />
        )}
      </View>
    </>
  );
};
