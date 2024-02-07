import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Rating} from 'react-native-ratings';
import DropdownComponent from '../DropdownComponent';
import {BASE_URL} from '@env';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {authSelector} from '../../store/auth/selector';
import {useToast} from 'react-native-toast-notifications';
import {Showtoast} from '../../utils/toast';

const AskPreClassRating = ({previousClassData, setAskForRating}) => {
  const {user} = useSelector(authSelector);
  const [rating, setRating] = useState(0);
  const [feedBack, setFeedBack] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const feedbackOptions = [
    {label: '', value: 'none'},
    {label: 'Class was good', value: 'Class was good'},
    {label: 'Teacher was late', value: 'Teacher was late'},
    {label: 'Child could not understand', value: 'Child could not understand'},
    {label: 'Teacher had network issues', value: 'Teacher has network issues'},
    {label: 'Other', value: 'Other'},
  ];

  const handleFeedback = async () => {
    if (rating !== 0) {
      setLoading(true);
      const token = await auth().currentUser.getIdToken();
      const API_URL = `${BASE_URL}/app/myCourse/giveclassrating`;
      const body = {
        leadId: user?.leadId,
        rating: rating,
        classNumber: previousClassData?.classNumber,
        batchId: previousClassData?.batchId,
        classId: previousClassData?.classId,
        feedback:
          feedBack === '' || feedBack == null
            ? 'none'
            : feedBack == 'Other'
            ? message
            : feedBack,
        teacherName: previousClassData?.partnerName,
        phone: user?.phone,
      };
      console.log('check body:', body);
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      });
      console.log(response?.status);
      if (response.status === 200) {
        Showtoast({
          text: 'Thanks for your feedback',
          toast,
          type: 'success',
        });
      } else {
        Showtoast({
          text: 'Something went wrong',
          toast,
          type: 'danger',
        });
      }
      setLoading(false);
      setAskForRating(false);
    } else {
      Showtoast({
        text: 'Please rate the class first',
        toast,
        type: 'danger',
      });
    }
  };

  return (
    <View className="h-[100%] w-[100%] absolute z-20 flex justify-center items-center">
      <View
        className={`flex flex-col justify-start items-center ${
          feedBack !== 'Other' ? 'h-[50%]' : 'h-[70%]'
        } w-[90%] bg-white px-3 py-3 rounded-md`}>
        <View className="flex flex-col justify-center items-center w-full">
          <Text className="text-black text-[23px] font-semibold mb-3">
            Rate your class {previousClassData?.classNumber}
          </Text>
          <Rating
            type="star"
            startingValue={rating}
            selectedColor="#f1c40f"
            unSelectedColor="#BDC3C7"
            size={20}
            onFinishRating={e => {
              console.log('Rating', e);
              setRating(e);
            }}
          />
        </View>
        <View className="flex flex-col justify-center items-start w-full mt-9">
          <Text className="text-black text-[19px]">
            Give Feedback (optional):
          </Text>
          <Text className="text-black text-[16px]">
            It will help us improve your experience
          </Text>
          <DropdownComponent
            data={feedbackOptions}
            placeHolder="Select Feedback"
            setSelectedValue={setFeedBack}
            defaultSelectedItem={feedbackOptions[0]}
          />
        </View>
        {feedBack === 'Other' && (
          <TextInput
            className="w-[100%]  text-black border border-solid border-[#adabab] text-[16px] rounded-xl px-2"
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={newText => setMessage(newText)}
            placeholder="Feedback"
            placeholderTextColor={'#858080'}
            textAlignVertical="top"
          />
        )}

        <Pressable
          onPress={handleFeedback}
          className={`bg-orange-500 rounded-md px-3 py-2 ${
            feedBack === 'Other' && 'mt-3'
          } flex flex-row justify-center items-center`}>
          <Text
            className={`text-white font-semibold text-[16px] ${
              loading && 'mr-2'
            }`}>
            Submit
          </Text>
          {loading && <ActivityIndicator color={'white'} size={20} />}
        </Pressable>
      </View>
    </View>
  );
};

export default AskPreClassRating;
