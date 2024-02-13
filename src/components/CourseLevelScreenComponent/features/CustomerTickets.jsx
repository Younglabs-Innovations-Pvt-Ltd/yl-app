import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TextInput,
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
  const {bgSecondaryColor, textColors} = useSelector(state => state.appTheme);
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
              color={textColors?.textPrimary}
            />
          </Pressable>
          <Text
            style={{color: textColors?.textPrimary}}
            className="font-semibold text-[20px]">
            My Tickets
          </Text>
        </View>
      </View>
      {loading ? (
        <View className="w-full h-full flex justify-center items-center">
          <ActivityIndicator color={'black'} style={{width: 40}} />
        </View>
      ) : (
        <ScrollView className="w-[100%]">
          {myTickets &&
            myTickets?.map((ticket, index) => {
              return (
                <TicketTile
                  key={index}
                  category={ticket?.category}
                  ticketStatus={ticket?.ticketStatus}
                  createdAt={ticket?.createdAt}
                  details={ticket?.details}
                  comments={ticket?.comments}
                  ticketId={ticket?.ticketId}
                  creatorEmail={ticket?.creatorEmail}
                  fetchCustomerTickets={fetchCustomerTickets}
                  bgSecondaryColor={bgSecondaryColor}
                  textColors={textColors}
                />
              );
            })}
        </ScrollView>
      )}
    </View>
  );
};

export default CustomerTickets;

export const TicketTile = ({
  category,
  ticketStatus,
  createdAt,
  details,
  comments,
  creatorEmail,
  ticketId,
  fetchCustomerTickets,
  bgSecondaryColor,
  textColors,
}) => {
  const [ticketStatusColor, setTicketStatusColor] = useState(null);
  const [ticketCreatedAt, setTicketCreatedAt] = useState(null);
  const [allComments, setAllComments] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [reopenMessage, setReopenMessage] = useState(null);
  const [showReopen, setShowReopen] = useState(false);

  useEffect(() => {
    if (comments) {
      let commentsList = [];
      for (let i = 0; i <= comments?.length; i++) {
        comments[i] &&
          Object.values(comments[i])[0].map(
            ({comment, createdAt, createdBy, createdFor}) => {
              const commentNewObj = {
                comment,
                createdAt,
                createdBy,
                createdFor,
              };
              createdFor === 'customer' && commentsList.push(commentNewObj);
            },
          );
      }
      if (commentsList.length > 0) {
        setAllComments(commentsList);
      }
    }
  }, [comments]);

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
    const date = moment(dateObject).format('dddd, MMM D');
    const showDate = moment(dateObject).format('DD-MM-YYYY');
    const time = moment(dateObject).format('hh:mm A');
    setTicketCreatedAt(showDate + ' ' + time);
  }, [createdAt]);

  return (
    <View className="w-[100%] flex flex-1 flex-col justify-between items-center mt-2 border-2 border-gray-200 rounded-md mx-auto">
      <View className="w-[100%] flex flex-row justify-between items-start px-2 pt-1">
        <Text
          style={{color: textColors?.textPrimary}}
          className="text-[16px] font-semibold">
          {category}
        </Text>
        <Text
          style={{color: textColors?.textSecondary}}
          className="text-[14px] font-semibold">
          {ticketCreatedAt}
        </Text>
      </View>
      <View className="w-[100%] flex flex-row justify-start items-end px-2 pb-1 mt-2">
        <Text style={{color: textColors}} className="font-semibold">
          {details}
        </Text>
      </View>
      <View className="w-[100%] flex flex-row justify-end items-center mr-2 my-2">
        {(allComments?.length === 0 || allComments == undefined) &&
          ticketStatus === 'closed' && (
            <Pressable
              onPress={() => setShowReopen(!showReopen)}
              className="w-[100%] flex flex-row justify-end items-center">
              <Text
                className={` border-2 px-2 py-1 rounded-md border-solid text-red-500 border-red-500 mr-1  text-[16px] font-semibold`}>
                Reopen Ticket
              </Text>
            </Pressable>
          )}

        {/* <View className=" flex flex-row justify-end items-end px-2 pb-1"> */}
        {allComments && allComments.length > 0 && (
          <Pressable
            onPress={() => {
              setShowComments(!showComments);
            }}>
            <Text
              className={`text-black border-2 px-1 py-1 rounded-md border-solid ${ticketStatusColor}  text-[16px] font-semibold mr-1`}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Text>
          </Pressable>
        )}
        {/* </View> */}
        {/* <View className=" flex flex-row justify-end items-end px-2 pb-1"> */}

        <Text
          className={`text-black border-2 px-2 py-1 rounded-md border-solid ${ticketStatusColor}  text-[16px] font-semibold`}>
          {ticketStatus}
        </Text>
        {/* </View> */}
      </View>
      {(allComments?.length === 0 || allComments == undefined) &&
        showReopen && (
          <ReopenTicket
            fetchCustomerTickets={fetchCustomerTickets}
            setShowReopen={setShowReopen}
            setMessage={setReopenMessage}
            message={reopenMessage}
            ticketId={ticketId}
            creatorEmail={creatorEmail}
          />
        )}
      {showComments && (
        <View className="w-[100%] p-2 flex flex-col justify-center items-center gap-2">
          {ticketStatus == 'closed' && (
            <Pressable
              onPress={() => setShowReopen(!showReopen)}
              className="w-[100%] flex flex-row justify-end items-center">
              <Text
                className={` border-2 px-2 py-1 rounded-md border-solid text-red-500 border-red-500 mr-1  text-[16px] font-semibold`}>
                Reopen Ticket
              </Text>
            </Pressable>
          )}
          {showReopen && (
            <ReopenTicket
              fetchCustomerTickets={fetchCustomerTickets}
              setShowReopen={setShowReopen}
              setMessage={setReopenMessage}
              message={reopenMessage}
              ticketId={ticketId}
              creatorEmail={creatorEmail}
            />
          )}
          {allComments?.map(comment => {
            return (
              <View className="w-[100%] flex flex-col justify-center items-start bg-gray-300 p-2 rounded-md">
                <Text className="text-black w-[100%] font-semibold text-[16px]">
                  {comment?.comment}
                </Text>
                <View className="w-[100%] flex flex-row justify-between items-center mt-2">
                  <Text className="text-black ">
                    {moment(comment?.createdAt).format('hh:mm')} at{' '}
                    {moment(comment?.createdAt).format('YYYY-MM-DD')}
                  </Text>
                  <Text className="text-black ">
                    {comment?.createdBy.split('@')[0]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export const ReopenTicket = ({
  setShowReopen,
  setMessage,
  message,
  ticketId,
  creatorEmail,
  fetchCustomerTickets,
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const reopenTicketHandler = async () => {
    setLoading(true);
    const token = await auth().currentUser.getIdToken();
    const API_URL = `${BASE_URL}/admin/tickets/addcommentcustomer`;
    const data = {
      comment: message,
      ticketId,
      email: creatorEmail,
      createdFor: 'internal',
    };

    console.log(data, 'open ticket again');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(data),
    });
    const res = await response.json();
    // console.log(res, 'res')
    if (response.status === 200) {
      Showtoast({
        text: `Ticket reopen successfully`,
        toast,
        type: 'success',
      });
      fetchCustomerTickets();
    }
    setLoading(false);
  };
  return (
    <View className="w-[100%] rounded-md bg-[#eeebeb] p-2 mt-1">
      <Text className="text-black w-[100%] font-semibold text-[15px] ml-1 mb-1">
        Describe the issue you are facing (optional)
      </Text>
      <TextInput
        className="w-[100%] text-black border border-solid border-[#adabab] rounded-xl px-2"
        multiline
        numberOfLines={6}
        value={message}
        onChangeText={newText => setMessage(newText)}
        placeholder="Describe the issue in detail"
        placeholderTextColor={'#858080'}
        textAlignVertical="top"
      />
      <View className="flex flex-row justify-start items-center ml-1 gap-x-1 mt-2">
        <Pressable
          onPress={reopenTicketHandler}
          className="bg-blue-500 px-3 py-2 rounded-md flex flex-row">
          <Text className={`font-semibold text-white ${loading && 'mr-2'}`}>
            Reopen Ticket
          </Text>
          {loading && <ActivityIndicator color={'white'} size={20} />}
        </Pressable>
        <Pressable
          onPress={() => setShowReopen(false)}
          className="bg-blue-500 px-3 py-2 rounded-md">
          <Text className="font-semibold text-white">Cancel</Text>
        </Pressable>
      </View>
    </View>
  );
};
