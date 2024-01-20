import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {authSelector} from '../store/auth/selector';
import {FONTS} from '../utils/constants/fonts';
import {
  setSelectedChild,
  setSelectedUserOrder,
  startFetchingUserOrders,
  startGetAllBookings,
} from '../store/welcome-screen/reducer';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {select} from 'redux-saga/effects';

const HeaderComponent = ({navigation, setShowAddChildView, open}) => {
  const handleShowDrawer = () => navigation.openDrawer();
  const [customerName, setCustomerName] = useState('');
  const [ordersOrBookingsLoading, setOrdersOrBookingsLoading] = useState(false);
  const [ordersOrBookingsLoadingFailed, setOrdersOrBookingsLoadingFailed] =
    useState(false);
  const dispatch = useDispatch();
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const {
    selectedChild,
    userBookings,
    userOrders,
    selectedUserOrder,
    allBookingsLoding,
    userOrdersLoading,
    allBookingsLoadingFailed,
    userOrderLoadingFailed,
  } = useSelector(welcomeScreenSelector);
  const {user, customer} = useSelector(authSelector);

  // console.log("UserOrders are" , userOrders)

  const changeDarkMode = payload => {
    dispatch(setDarkMode(payload));
  };

  useEffect(() => {
    console.log('useeffect running 1');
    if (customer !== 'yes') {
      console.log('if 2');
      if (!userBookings) {
        console.log('if 3');
        dispatch(startGetAllBookings(user?.phone));
      }
    }
  }, [userBookings, user, customer]);

  useEffect(() => {
    if (customer == 'yes') {
      console.log('condition 2');
      let body = {
        leadId: user.leadId,
        token: user.token,
      };

      dispatch(startFetchingUserOrders(body));
    }
  }, [customer, user]);

  useEffect(() => {
    if (customer == 'yes') {
      let userName = Object.keys(selectedUserOrder)[0];
      setCustomerName(userName);
    } else {
      setCustomerName(selectedChild.userName);
    }
  }, [customer, selectedChild, selectedUserOrder]);

  useEffect(() => {
    if (customer == 'yes') {
      setOrdersOrBookingsLoading(userOrdersLoading);
      setOrdersOrBookingsLoadingFailed(userOrderLoadingFailed);
    } else {
      setOrdersOrBookingsLoading(allBookingsLoding);
      setOrdersOrBookingsLoadingFailed(allBookingsLoadingFailed);
    }
  }, [customer, allBookingsLoding, userOrdersLoading]);

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

          <View className="relative">
            <TouchableOpacity onPress={open}>
              {ordersOrBookingsLoading ? (
                <ActivityIndicator />
              ) : ordersOrBookingsLoadingFailed ? (
                <View>
                  <Text
                    className="text-[12px]"
                    style={{
                      color: textColors.textSecondary,
                      fontFamily: FONTS.primaryFont,
                    }}>
                    Error in Fetcing Data
                  </Text>
                  <Text
                    className="text-[10px]"
                    style={{
                      color: textColors.textYlMain,
                      fontFamily: FONTS.primaryFont,
                    }}>
                    Try Again
                  </Text>
                </View>
              ) : (
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
                      style={[
                        {
                          color: darkMode
                            ? textColors.textSecondary
                            : '#448BD6',
                          fontFamily: FONTS.headingFont,
                        },
                      ]}
                      className={`font-semibold`}>
                      Welcome, {customerName || ''}
                    </Text>

                    <Text
                      style={{
                        color: darkMode ? textColors.textSecondary : '#448BD6',
                      }}
                      className={`text-[10px] font-semibold `}>
                      {user?.credits} points
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="ml-5">
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

export default HeaderComponent;

export const ChangeAddedChild = ({close}) => {
  const {selectedChild, userBookings, userOrders, selectedUserOrder} =
    useSelector(welcomeScreenSelector);
  const {childName, childAge, credits, allBookings} = useSelector(authSelector);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();

  const handleSelectChild = child => {
    dispatch(setSelectedChild(child));
    close();
  };

  // console.log("selectedUserOrder is", selectedUserOrder)

  const {customer} = useSelector(authSelector);

  const RenderCustomerOrder = () => {
    const selectedOrderUserName = Object.keys(selectedUserOrder)[0];

    const handleChangeUserOrder = (key, value) => {
      dispatch(
        setSelectedUserOrder({
          [key]: value,
        }),
      );
    };
    return (
      <View className="w-full py-2 px-1 items-center">
        {Object.keys(userOrders)?.map(key => {
          return (
            <Pressable
              className="w-[100%] border py-3 px-2 my-2 rounded-md relative flex-row items-center"
              key={key}
              style={{
                borderColor:
                  selectedOrderUserName == key
                    ? textColors.textYlMain
                    : textColors.textSecondary,
              }}
              onPress={() => handleChangeUserOrder(key, userOrders[key])}>
              <View
                className="h-[50px] w-[50px] items-center justify-center"
                style={[
                  {
                    borderRadius: 50,
                    backgroundColor: textColors.textYlMain,
                  },
                ]}>
                <MIcon name="account" size={35} color="white" />
              </View>

              <View className="ml-3">
                <Text
                  className="text-base font-semibold"
                  style={{
                    color: textColors.textSecondary,
                    fontFamily: FONTS.headingFont,
                  }}>
                  {key}
                </Text>
                <Text
                  style={{
                    color: textColors.textSecondary,
                    fontFamily: FONTS.headingFont,
                  }}>
                  Courses: {userOrders[key][0]?.serviceRequests?.length}
                </Text>
              </View>

              {selectedOrderUserName == key && (
                <View
                  className="absolute -top-3 -right-3"
                  style={{backgroundColor: bgColor}}>
                  <MIcon
                    name="check-circle-outline"
                    size={25}
                    color={textColors.textYlMain}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View className="w-full items-center">
      <Text
        className="font-semibold"
        style={[FONTS.heading, {color: textColors.textYlMain}]}>
        {customer === 'yes'
          ? 'Select Child To switch'
          : 'Select Child To See Booking'}
      </Text>
      <View className="w-[90%] mt-3">
        {customer === 'yes' ? (
          <RenderCustomerOrder />
        ) : (
          userBookings?.map(booking => {
            return (
              <Pressable
                className="w-full border py-1 px-2 my-2 rounded-md relative"
                style={{
                  borderColor:
                    selectedChild?.bookingId == booking.bookingId
                      ? textColors?.textYlMain
                      : textColors.textSecondary,
                }}
                onPress={() => handleSelectChild(booking)}>
                <View className="w-full flex-row items-center">
                  <View
                    className="h-[50px] w-[50px] items-center justify-center"
                    style={[
                      {
                        borderRadius: 50,
                        backgroundColor: textColors.textYlMain,
                      },
                    ]}>
                    <MIcon name="account" size={25} color="white" />
                  </View>

                  <View className="ml-3">
                    <Text
                      className="text-base"
                      style={{
                        color: textColors.textSecondary,
                        fontFamily: FONTS.headingFont,
                      }}>
                      {booking?.userName}
                    </Text>
                    <Text
                      className="text-base"
                      style={{
                        color: textColors.textSecondary,
                        fontFamily: FONTS.headingFont,
                      }}>
                      Age: {booking?.childAge}
                    </Text>
                  </View>

                  {selectedChild?.bookingId == booking.bookingId && (
                    <View
                      className="absolute -top-3 -right-3"
                      style={{backgroundColor: bgColor}}>
                      <MIcon
                        name="check-circle-outline"
                        size={25}
                        color={textColors.textYlMain}
                      />
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
};
