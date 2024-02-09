import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BASE_URL} from '@env';
import auth from '@react-native-firebase/auth';
import {authSelector} from '../../../store/auth/selector';
import {useSelector} from 'react-redux';
import {Showtoast} from '../../../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import moment from 'moment';

const CustomerTickets = ({setShowMyTickets}) => {
  const {user} = useSelector(authSelector);
  const [myTickets, ssetMyTickets] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fetchCustomerTickets = async () => {
    setLoading(true);
    const token = await auth().currentUser.getIdToken();
    const API_URL = `${BASE_URL}/admin/tickets/getticketscustomer`;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        leadId: user?.leadId,
      }),
    });
    if (response.status === 200) {
      const result = await response.json();
      ssetMyTickets(result?.tickets);
    } else {
      Showtoast({
        text: 'Something went wrong while fetching tickets',
        toast,
        type: 'danger',
      });
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCustomerTickets();
  }, []);
  //   useEffect(() => {
  //     console.log('myTickets', myTickets[0]?.createdAt, 'myTickets');
  //   }, [myTickets]);

  return (
    <View className="w-[100%] h-[100%] relative flex flex-col justify-center items-center">
      <View className="w-full flex flex-row justify-start items-center">
        <View className="w-[64%] flex flex-row justify-between items-center">
          <Pressable className="" onPress={() => setShowMyTickets(false)}>
            <MIcon
              name="arrow-left-bold-circle"
              className="mt-2"
              size={35}
              color="gray"
            />
          </Pressable>
          <Text className="text-black font-semibold text-[20px]">
            My Tickets
          </Text>
        </View>
      </View>
      {loading ? (
        <View className="w-full h-full flex justify-center items-center">
          <ActivityIndicator color={'black'} style={{width: 40}} />
        </View>
      ) : (
        <ScrollView className="w-full">
          {myTickets &&
            myTickets?.map(ticket => {
              return (
                <TicketTile
                  category={ticket?.category}
                  ticketStatus={ticket?.ticketStatus}
                  createdAt={ticket?.createdAt}
                  details={ticket?.details}
                />
              );
            })}
        </ScrollView>
      )}
    </View>
  );
};

export default CustomerTickets;

export const TicketTile = ({category, ticketStatus, createdAt, details}) => {
  console.log(createdAt, 'efwegwegwrgwgwrger');
  const [ticketStatusColor, setTicketStatusColor] = useState(null);
  const [ticketCreatedAt, setTicketCreatedAt] = useState(null);
  useEffect(() => {
    if (ticketStatus == 'open') {
      setTicketStatusColor('text-red-500 border-red-500');
    } else if (ticketStatus == 'pending') {
      setTicketStatusColor('text-yellow-500 border-yellow-500');
    } else if (ticketStatus == 'closed') {
      setTicketStatusColor('text-green-500 border-green-500');
    } else if (ticketStatus == 'in progress') {
      setTicketStatusColor('text-blue-500 border-blue-500');
    }
  }, [ticketStatus]);
  useEffect(() => {
    const {_seconds, _nanoseconds} = createdAt;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    console.log('before', dateObject);
    const date = moment(dateObject).format('dddd, MMM D');
    const showDate = moment(dateObject).format('DD-MM-YYYY');
    const time = moment(dateObject).format('hh:mm A');
    setTicketCreatedAt(showDate + ' ' + time);
  }, [createdAt]);
  return (
    <View className="w-[100%] h-[130px] flex flex-col justify-between items-center mt-2 border-2 border-black rounded-md mx-auto">
      <View className="w-[100%] h-[20%] flex flex-row justify-between items-start px-2 pt-1">
        <Text className="text-black text-[16px] font-semibold">{category}</Text>
        <Text className="text-black  text-[14px] font-semibold">{ticketCreatedAt}</Text>
      </View>
      <View className="w-[100%] h-[30%] flex flex-row justify-start items-end px-2 pb-1 mt-2">
        <Text className="text-black  font-semibold">{details}</Text>
      </View>
      <View className="w-[100%] h-[40%] flex flex-row justify-end items-end px-2 pb-1">
        <Text
          className={`text-black border-2 px-2 py-1 rounded-md border-solid ${ticketStatusColor}  text-[16px] font-semibold`}>
          {ticketStatus}
        </Text>
      </View>
    </View>
  );
};
