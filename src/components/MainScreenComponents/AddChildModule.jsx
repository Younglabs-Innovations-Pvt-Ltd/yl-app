import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../CustomInputComponent';
import DropdownComponent from '../DropdownComponent';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BookDemoScreen from '../../screens/book-demo-form.screen';
import {authSelector} from '../../store/auth/selector';
import {FONTS} from '../../utils/constants/fonts';
import {startAddingChild} from '../../store/user/reducer';
import {userSelector} from '../../store/user/selector';
import {Showtoast} from '../../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import {COLORS} from '../../utils/constants/colors';

export const AddChildModule = ({onClose}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const [childName, setChildName] = useState(null);
  const [childAge, setChildAge] = useState(null);
  const [isFieldsFilled, setIsFieldsFilled] = useState(false);
  const {customer, user} = useSelector(authSelector);
  const {childAddLoading} = useSelector(userSelector);

  const dispatch = useDispatch();
  const toast = useToast();

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
    if (childName == null || childName?.length < 2) {
      Showtoast({text: 'Enter valid Child name', toast, type: 'danger'});
      return;
    }
    if (childAge === null || !childAge) {
      Showtoast({text: 'Select Child Age', toast, type: 'danger'});
      return;
    }

    let body = {
      childName,
      childAge,
      leadId: user?.leadId,
      onClose,
    };

    console.log('adding child');
    dispatch(startAddingChild(body));
    setChildName('');
    // console.log('isFiled filled', isFieldsFilled);
    // console.log('body is', body);
  };

  return (
    <>
      <View className="w-full items-center flex-1">
        {/* {customer === 'yes' ? (
          <> */}
        <Text
          className="font-semibold text-center"
          style={[FONTS.heading, {color: textColors.textSecondary}]}>
          Add child
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

          <Pressable
            className="py-3 rounded-full w-full mt-3 flex-row justify-center"
            style={{backgroundColor: colorYlMain}}
            onPress={addChild}
            disabled={childAddLoading}>
            <Text
              className="text-center text-white text-[18px] font-semibold"
              style={[{fontFamily: FONTS.primaryFont}]}>
              Click to add Child
            </Text>
            {childAddLoading && (
              <ActivityIndicator
                size={'small'}
                color={'white'}
                className="ml-1"
              />
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
};
