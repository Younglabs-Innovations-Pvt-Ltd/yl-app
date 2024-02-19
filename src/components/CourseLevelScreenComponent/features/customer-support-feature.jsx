import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BASE_URL} from '@env';
import {authSelector} from '../../../store/auth/selector';
import {useSelector} from 'react-redux';
import SelectDropdown from 'react-native-select-dropdown';
import DropdownComponent from '../../DropdownComponent';
import {Showtoast} from '../../../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import auth from '@react-native-firebase/auth';
import CustomerTickets from './CustomerTickets';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {COLORS} from '../../../utils/constants/colors';
import Icon from '../../icon.component';

const CustomerSupportFeature = ({
  serviceReqClassesData,
  setSheetOpen,
  source,
}) => {
  const [issueType, setIssueType] = useState([
    {label: 'Batch Issues', value: 'Batch Issues'},
    {label: 'Homework Submission', value: 'Homework Submission'},
    {label: 'Login Issues', value: 'Login Issues'},
    {label: 'Class Issues', value: 'Class Issues'},
    {label: 'Downloading Worksheets', value: 'Downloading Worksheets'},
    {label: 'Refund', value: 'Refund'},
    {label: 'Request Callback', value: 'Request Callback'},
    {label: 'Recording Issues', value: 'Recording Issues'},
    {label: 'Other', value: 'Other'},
  ]);
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [message, setMessage] = useState(null);
  const [allClassNumber, setAllClassNumber] = useState(null);
  const [selectClassNumber, setSelectClassNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMyTickets, setShowMyTickets] = useState(false);
  const {user} = useSelector(authSelector);
  const {bgSecondaryColor, textColors} = useSelector(state => state.appTheme);
  const toast = useToast();
  useEffect(() => {
    if (source !== 'userProfile') {
      const classesNumberData = [];
      serviceReqClassesData?.classes?.map(classData => {
        classesNumberData.push({
          label: classData?.classNumber.toString(),
          value: classData?.classNumber,
        });
      });
      setAllClassNumber(classesNumberData);
    }
  }, [serviceReqClassesData]);

  const onFormSubmit = async data => {
    const token = await auth().currentUser.getIdToken();
    console.log(selectClassNumber, selectedIssueType, message);
    if (selectedIssueType == null || selectedIssueType == '') {
      Showtoast({text: 'Please select issue type', toast, type: 'danger'});
    } else if (
      source !== 'userProfile' &&
      (selectClassNumber == null || selectClassNumber == '')
    ) {
      Showtoast({text: 'Please select class', toast, type: 'danger'});
    } else if (message == null || message == '') {
      Showtoast({text: 'Please enter message', toast, type: 'danger'});
    } else {
      setLoading(true);
      const body1 = {
        leadId: user?.leadId,
        category: selectedIssueType,
        details: message,
        customerName: user.fullName,
        creatorEmail: user.email,
        courseId: user?.courseType,
        classInfo: {
          classNumber: selectClassNumber,
          classDate:
            serviceReqClassesData?.classes[selectClassNumber]?.classDate,
          teacherName:
            serviceReqClassesData?.classes[selectClassNumber]?.partnerName,
          rating: serviceReqClassesData?.classes[selectClassNumber]?.rating,
          attended: serviceReqClassesData?.classes[selectClassNumber]?.attended,
          batchId: serviceReqClassesData?.classes[selectClassNumber]?.batchId,
        },
      };
      const body2 = {
        leadId: user?.leadId,
        category: selectedIssueType,
        details: message,
        customerName: user.fullName,
        creatorEmail: user.email,
        source: 'app',
      };

      const body = source === 'userProfile' ? body2 : body1;
      console.log(body, 'body');
      const API_URL = `${BASE_URL}/admin/tickets/createticketcustomer`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        Showtoast({
          text: 'Ticket submitted successfully',
          toast,
          type: 'success',
        });
        source != 'userProfile' && setSelectedIssueType(null);
        setMessage(null);
        source != 'userProfile' && setSelectClassNumber(null);
        setSheetOpen(null);
      } else {
        Showtoast({
          text: `{Something went wrong ${response.status}}`,
          toast,
          type: 'danger',
        });
      }
      setLoading(false);
    }
  };

  const redirectToWhatsApp = async () => {
    try {
      let url = '';
      const phoneNumber = '+919289029696';
      if (Platform.OS === 'android') {
        url = `whatsapp://send?phone=${phoneNumber}`;
      } else if (Platform.OS === 'ios') {
        url = `whatsapp://wa.me/${phoneNumber}`;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View className="w-[100%] h-[100%] flex flex-col justify-center items-center">
      {showMyTickets ? (
        <CustomerTickets setShowMyTickets={setShowMyTickets} />
      ) : (
        <View className="w-[100%] h-[100%] flex flex-col justify-center items-center">
          {source !== 'userProfile' && (
            <View className="w-full flex flex-row justify-start items-center">
              <Pressable
                onPress={() => {
                  setShowMyTickets(true);
                }}
                style={{backgroundColor: textColors?.textYlMain}}
                className="px-3 py-2 rounded-lg">
                <Text className="text-white font-semibold">My Tickets</Text>
              </Pressable>
            </View>
          )}
          {source === 'userProfile' && (
            <Pressable
              onPress={redirectToWhatsApp}
              style={({pressed}) => [
                styles.btnWhatsApp,
                {backgroundColor: pressed ? '#eee' : 'transparent'},
              ]}>
              <Icon name="logo-whatsapp" size={28} color={COLORS.pgreen} />
              <Text
                className="font-semibold"
                style={{color: textColors.textPrimary}}>
                Chat with us
              </Text>
            </Pressable>
          )}
          <DropdownComponent
            data={issueType}
            placeHolder="Issue type"
            setSelectedValue={setSelectedIssueType}
          />
          {source !== 'userProfile' && allClassNumber && (
            <DropdownComponent
              data={allClassNumber}
              placeHolder="Select class"
              setSelectedValue={setSelectClassNumber}
            />
          )}
          <TextInput
            style={{color: textColors?.textPrimary}}
            className="w-[100%] border border-solid border-[#adabab] text-[16px] rounded-xl px-2 mt-3"
            multiline
            numberOfLines={6}
            value={message}
            onChangeText={newText => setMessage(newText)}
            placeholder="Describe the issue in detail"
            placeholderTextColor={'#858080'}
            textAlignVertical="top"
          />
          <Pressable
            onPress={onFormSubmit}
            style={{backgroundColor: textColors?.textYlMain}}
            className=" px-5 mt-3 py-3 rounded-lg flex flex-row justify-center items-center">
            <Text className="text-white font-semibold text-[16px]">Submit</Text>
            {loading && (
              <ActivityIndicator color={'white'} style={{width: 40}} />
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CustomerSupportFeature;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#adabab',
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    color: COLORS.black,
  },
  btnWhatsApp: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-end',
  },
});
