import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  TextInput,
  StyleSheet,
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
import {FONTS} from '../../../utils/constants/fonts';
import Icon from '../../icon.component';

const CustomerTickets = ({setShowMyTickets, source}) => {
  const {user} = useSelector(authSelector);
  const [myTickets, ssetMyTickets] = useState(null);
  const [loading, setLoading] = useState(false);
  const {bgSecondaryColor, textColors, darkMode} = useSelector(
    state => state.appTheme,
  );
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
        {source !== 'userProfile' && (
          <View
            className={`w-[64%] flex flex-row justify-between items-center ${
              loading ? 'mt-10' : 'mt-1'
            } `}>
            <Pressable className={``} onPress={() => setShowMyTickets(false)}>
              <MIcon
                name="arrow-left-bold-circle"
                size={35}
                color={textColors?.textPrimary}
              />
            </Pressable>
            <Text
              style={{color: textColors?.textPrimary}}
              className={`font-semibold text-[20px] `}>
              My Tickets
            </Text>
          </View>
        )}
        {source === 'userProfile' && (
          <View className="w-full flex flex-row justify-center items-center">
            <Text
              style={{
                fontFamily: FONTS.headingFont,
                color: textColors?.textPrimary,
              }}
              className={`font-semibold text-[20px] ${
                loading ? 'mt-16' : 'mt-3'
              }`}>
              Log your issue here
            </Text>
          </View>
        )}
      </View>
      {loading ? (
        <View className="w-full h-full flex justify-center items-center">
          <ActivityIndicator
            color={textColors?.textPrimary}
            style={{width: 40}}
          />
        </View>
      ) : (
        <ScrollView className="w-[100%] mb-2">
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
                  darkMode={darkMode}
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
  darkMode,
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
              if (comment?.includes('http')) {
                return;
              } else {
                const commentNewObj = {
                  comment,
                  createdAt,
                  createdBy,
                  createdFor,
                };
                createdFor === 'customer' && commentsList.push(commentNewObj);
              }
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
      setTicketStatusColor('text-white bg-red-500');
    } else if (ticketStatus == 'pending') {
      setTicketStatusColor('text-white bg-yellow-500');
    } else if (ticketStatus == 'closed') {
      setTicketStatusColor('text-white bg-green-500');
    } else if (ticketStatus == 'in progress') {
      setTicketStatusColor('text-white bg-blue-500');
    }
  }, [ticketStatus]);
  useEffect(() => {
    const {_seconds, _nanoseconds} = createdAt;
    const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
    const dateObject = new Date(milliseconds);
    const date = moment(dateObject).format('dddd, MMM D');
    const showDate = moment(dateObject).format('DD/MM/YYYY');
    const time = moment(dateObject).format('hh:mm A');
    // setTicketCreatedAt(showDate + ' ' + time);
    setTicketCreatedAt(showDate);
  }, [createdAt]);

  const styles = StyleSheet.create({
    container: {
      // Set shadow properties for iOS
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 6},
      shadowOpacity: 0.2, // Adjust the opacity as needed
      shadowRadius: 5,

      // Set elevation for Android
      elevation: 9,

      // Other styles for your view
      backgroundColor: darkMode ? bgSecondaryColor : '#f5f2f2',
    },
  });

  return (
    <View
      style={styles.container}
      // style={{backgroundColor: darkMode?bgSecondaryColor:"#efeded"}}
      className="w-[100%] flex flex-1 flex-col shadow-2xl gap-y-3 justify-between items-center mt-5 rounded-md mx-auto">
      <View className="w-[100%] flex flex-row justify-between items-start px-2 pt-1">
        <Text
          style={{
            fontFamily: FONTS.headingFont,
            color: textColors?.textPrimary,
          }}
          className="text-[19px] font-semibold">
          {category}
        </Text>
        <View className="flex flex-row justify-center items-center">
          <Icon
            name="calendar-clear-outline"
            size={20}
            color={textColors.textSecondary}
          />
          <Text
            style={{
              fontFamily: FONTS.primaryFont,
              color: textColors?.textSecondary,
            }}
            className="text-[14px] font-semibold ml-1">
            {ticketCreatedAt}
          </Text>
        </View>
      </View>
      <View className="w-[100%] flex flex-row justify-start items-end px-2 pb-1 mt-2">
        <Text
          style={{
            fontFamily: FONTS.primaryFont,
            color: textColors?.textSecondary,
          }}
          className="font-semibold">
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
                style={{fontFamily: FONTS.primaryFont}}
                className={` border-2 px-2 py-1 rounded-md border-none border-transparent text-white bg-red-500 mr-1  text-[16px] font-semibold`}>
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
              style={{fontFamily: FONTS.primaryFont}}
              className={`text-black border-2 px-1 py-1 rounded-md border-solid border-transparent ${ticketStatusColor}  text-[16px] font-semibold mr-1`}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </Text>
          </Pressable>
        )}
        {/* </View> */}
        {/* <View className=" flex flex-row justify-end items-end px-2 pb-1"> */}

        <Text
          style={{fontFamily: FONTS.primaryFont}}
          className={`text-black border-2 px-2 py-1 rounded-md border-solid border-transparent ${ticketStatusColor}  text-[16px] font-semibold`}>
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
            bgSecondaryColor={bgSecondaryColor}
            darkMode={darkMode}
            textColors={textColors}
          />
        )}
      {showComments && (
        <View className="w-[100%] p-2 flex flex-col justify-center items-center gap-2">
          {ticketStatus == 'closed' && (
            <Pressable
              onPress={() => setShowReopen(!showReopen)}
              className="w-[100%] flex flex-row justify-end items-center">
              <Text
                style={{fontFamily: FONTS.primaryFont}}
                className={` border-2 px-2 py-1 rounded-md border-solid border-transparent text-white bg-red-500 mr-1  text-[16px] font-semibold`}>
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
              bgSecondaryColor={bgSecondaryColor}
              darkMode={darkMode}
              textColors={textColors}
            />
          )}
          {allComments?.map((comment, index) => {
            return (
              <View
                key={index}
                style={{
                  backgroundColor: darkMode ? bgSecondaryColor : '#f9f9f9',
                }}
                className="w-[100%] flex flex-col justify-center items-start bg-gray-300 p-2 rounded-md">
                <Text
                  style={{
                    color: textColors?.textPrimary,
                    fontFamily: FONTS.primaryFont,
                  }}
                  className=" w-[100%] font-semibold text-[16px]">
                  {comment?.comment}
                </Text>
                <View className="w-[100%] flex flex-row justify-between items-center mt-2">
                  <Text
                    style={{
                      color: textColors?.textSecondary,
                      fontFamily: FONTS.primaryFont,
                    }}>
                    {moment(comment?.createdAt).format('hh:mm')} at{' '}
                    {moment(comment?.createdAt).format('YYYY-MM-DD')}
                  </Text>
                  <Text
                    style={{
                      color: textColors?.textSecondary,
                      fontFamily: FONTS.primaryFont,
                    }}>
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
  bgSecondaryColor,
  darkMode,
  textColors,
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
    <View
      style={{
        backgroundColor: darkMode ? bgSecondaryColor : '#eeebeb',
      }}
      className="w-[100%] rounded-md p-2 mt-1">
      <Text
        style={{color: textColors?.textPrimary, fontFamily: FONTS.headingFont}}
        className="text-black w-[100%] font-semibold text-[15px] ml-1 mb-1">
        Describe the issue you are facing (optional)
      </Text>
      <TextInput
        style={{
          color: textColors?.textSecondary,
          fontFamily: FONTS.primaryFont,
        }}
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
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className={`font-semibold text-white ${loading && 'mr-2'}`}>
            Reopen Ticket
          </Text>
          {loading && <ActivityIndicator color={'white'} size={20} />}
        </Pressable>
        <Pressable
          onPress={() => setShowReopen(false)}
          className="bg-blue-500 px-3 py-2 rounded-md">
          <Text
            style={{fontFamily: FONTS.primaryFont}}
            className="font-semibold text-white">
            Cancel
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
