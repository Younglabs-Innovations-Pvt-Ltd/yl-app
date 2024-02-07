import {View, Text, Pressable, ActivityIndicator} from 'react-native';
import React, {Children, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setDarkMode} from '../store/app-theme/appThemeReducer';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import tw from 'twrnc';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {authSelector} from '../store/auth/selector';
import {FONTS} from '../utils/constants/fonts';
import {
  setCurrentUserOrders,
  startGetAllBookings,
} from '../store/welcome-screen/reducer';
import {welcomeScreenSelector} from '../store/welcome-screen/selector';
import {select} from 'redux-saga/effects';
import {fetchUserFormLoginDetails, logout} from '../store/auth/reducer';
import {localStorage} from '../utils/storage/storage-provider';
import {userSelector} from '../store/user/selector';
import {setCurrentChild} from '../store/user/reducer';

const HeaderComponent = ({navigation, setShowAddChildView, open}) => {
  const handleShowDrawer = () => navigation.openDrawer();
  const [customerName, setCustomerName] = useState('To Younglabs');
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
    currentUserOrders,
  } = useSelector(welcomeScreenSelector);
  const {user, customer} = useSelector(authSelector);
  const {currentChild} = useSelector(userSelector);

  const changeDarkMode = payload => {
    dispatch(setDarkMode(payload));
  };

  // useEffect(() => {
  //   console.log('useeffect running 1');
  //   if (customer !== 'yes') {
  //     console.log('if 2', user?.phone);
  //     dispatch(startGetAllBookings(user?.phone));
  //   }
  // }, [user, customer]);

  useEffect(() => {
    console.log('current child is', currentChild);
    if (currentChild) {
      setCustomerName(currentChild?.name);
    }
  }, [currentChild]);

  useEffect(() => {
    if (customer == 'yes') {
      // console.log('here', user);
      // setOrdersOrBookingsLoading(userOrdersLoading);
      // setOrdersOrBookingsLoadingFailed(userOrderLoadingFailed);
    } else {
      setOrdersOrBookingsLoading(allBookingsLoding);
      setOrdersOrBookingsLoadingFailed(allBookingsLoadingFailed);
      console.log('here 2', allBookingsLoadingFailed);
    }
  }, [customer, allBookingsLoding, userOrdersLoading]);

  const handleLogOut = () => {
    dispatch(logout());
  };

  // setCurrentUsers Orders
  useEffect(() => {
    if (userOrders && currentChild && customer === 'yes') {
      const filteredOrders = userOrders.filter(item => {
        return item?.childName === currentChild?.name;
      });
      dispatch(setCurrentUserOrders(filteredOrders || []));
    }
  }, [userOrders, currentChild, customer]);

  return (
    <>
      <View
        style={tw`flex flex-row justify-between w-[100%] px-2 py-1 bg-[${bgSecondaryColor}]
          }`}>
        <View className="flex-row items-center w-[75%]">
          {/* <View className="px-2 justify-center">
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
          </View> */}
          <View className="relative w-full items-start overflow-hidden pl-3">
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
                      Welcome, {customerName || 'To Younglabs'}
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
        </View>

        <View className="w-[25%]">
          <Pressable
            className={` flex-row items-center justify-center ${
              darkMode ? 'bg-gray-500' : 'bg-blue-200'
            } rounded-full py-1 px-2`}
            onPress={() => setShowAddChildView(true)}>
            <MIcon name="plus" size={20} color={textColors.textPrimary} />
            <Text className="text-xs" style={{fontFamily: FONTS.primaryFont}}>
              Add Child
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default HeaderComponent;

export const ChangeAddedChild = ({close}) => {
  const {selectedChild, userBookings, userOrders, selectedUserOrder} =
    useSelector(welcomeScreenSelector);
  const {childName, childAge, user, customer} = useSelector(authSelector);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();
  const {currentChild, children} = useSelector(userSelector);

  useEffect(() => {
    let loginDetails = localStorage.getString('loginDetails');
    if (!user && loginDetails) {
      dispatch(fetchUserFormLoginDetails());
    }
  }, [user]);

  const handleChangeCurrentChild = child => {
    dispatch(setCurrentChild(child));
    close();
  };

  const courses = ['course 1', 'course 2', 'course 3', 'course 4'];

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
        {/* {customer === 'yes' ? (
          <RenderCustomerOrder />
        ) : (
          userBookings?.map(booking => { */}
        {/* return ( */}

        {children?.map((child, key) => {
          return (
            <Pressable
              className="w-full border py-2 px-2 my-2 rounded-md relative"
              style={{
                borderColor:
                  currentChild?.name === child?.name
                    ? textColors?.textYlMain
                    : textColors.textSecondary,
              }}
              onPress={() => handleChangeCurrentChild(child)}
              key={key}>
              <View className="w-full flex-row items-center">
                <View
                  className="h-[40px] w-[40px] items-center justify-center"
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
                    className="text-base capitalize leading-[18px]"
                    style={{
                      color: textColors.textYlMain,
                      fontFamily: FONTS.headingFont,
                    }}>
                    {child.name}
                  </Text>
                  <Text
                    className="text-[14px] leading-[18px]"
                    style={{
                      color: textColors.textSecondary,
                      fontFamily: FONTS.headingFont,
                    }}>
                    Age: {child?.age || ''}
                  </Text>
                </View>

                {/* {selectedChild?.bookingId == booking.bookingId && (
                  <View
                    className="absolute -top-3 -right-3"
                    style={{backgroundColor: bgColor}}>
                    <MIcon
                      name="check-circle-outline"
                      size={25}
                      color={textColors.textYlMain}
                    />
                  </View>
                )} */}
              </View>
              <View className="w-full p-2 flex flex-row items-center">
                {/* <Text className="text-gray-500 font-semibold text-[14px]">Courses Bought: </Text> */}
                <FlatList
                  data={child?.courses}
                  keyExtractor={course => course}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => {
                    return (
                      <View className="py-[2px] px-2 border border-gray-200 rounded-full items-center justify-center">
                        <Text className="text-[12px]">{item}</Text>
                      </View>
                    );
                  }}
                  ItemSeparatorComponent={() => <View className="ml-2"></View>}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};
