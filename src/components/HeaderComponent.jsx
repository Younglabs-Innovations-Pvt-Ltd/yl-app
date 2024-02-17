import React, {useEffect, useState} from 'react';
import {View, Text, Pressable, ActivityIndicator, Image} from 'react-native';
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
import {setCurrentChild, startEditChild} from '../store/user/reducer';
import Input from './CustomInputComponent';
import DropdownComponent from './DropdownComponent';
import {COLORS} from '../utils/constants/colors';
import Snackbar from 'react-native-snackbar';

const HeaderComponent = ({navigation, setShowAddChildView, open, ipData}) => {
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
    userOrders,
    allBookingsLoding,
    userOrdersLoading,
    allBookingsLoadingFailed,
  } = useSelector(welcomeScreenSelector);
  const {user, customer, userFetchLoading} = useSelector(authSelector);
  const {currentChild, children} = useSelector(userSelector);

  useEffect(() => {
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
    }
  }, [customer, allBookingsLoding, userOrdersLoading]);

  // setCurrentUsers Orders
  useEffect(() => {
    if (userOrders && currentChild && customer === 'yes') {
      const filteredOrders = userOrders.filter(item => {
        return item?.childName === currentChild?.name;
      });
      dispatch(setCurrentUserOrders(filteredOrders || []));
    }
  }, [userOrders, currentChild, customer]);

  const handleChangeSheetClick = () => {
    if (children?.length > 0) {
      open();
    } else {
      Snackbar.show({
        text: 'Please Add Child',
        textColor: COLORS.white,
        duration: Snackbar.LENGTH_LONG,
        action: {
          text: 'Add One',
          textColor: COLORS.white,
          onPress: () => setShowAddChildView(true),
        },
      });
    }
  };

  return (
    <>
      <View
        style={tw`flex flex-row justify-between items-center w-[100%] px-2 py-1 bg-[${COLORS.pblue}]
          }`}>
        <View className="flex-row items-center flex-1">
          <View className="relative w-full items-start overflow-hidden">
            {/* <TouchableOpacity onPress={handleChangeSheetClick}> */}
            {userFetchLoading ? (
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
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {ipData && (
                  <Image
                    source={{uri: ipData.country_flag}}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 20,
                      marginRight: 4,
                    }}
                  />
                )}
                <View style={tw` pr-2 flex-row gap-2 justify-end items-center`}>
                  {/* <View
                    style={[
                      {
                        borderRadius: 50,
                        padding: 4,
                        backgroundColor: textColors.textYlMain,
                      },
                    ]}>
                    <MIcon name="account" size={25} color="white" />
                  </View> */}

                  <View style={tw`gap-0`}>
                    <Text
                      style={[
                        {
                          color: COLORS.white,
                          fontFamily: FONTS.headingFont,
                        },
                      ]}
                      className={`font-semibold`}>
                      Welcome{' '}
                      {customerName && customerName.length > 12
                        ? customerName.slice(0, 12) + '...'
                        : customerName || 'to Younglabs'}
                    </Text>

                    {user?.credits > 0 && (
                      <Text
                        style={{
                          color: darkMode
                            ? textColors.textSecondary
                            : '#448BD6',
                        }}
                        className={`text-[10px] font-semibold `}>
                        {user?.credits} credits
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            )}
            {/* </TouchableOpacity> */}
          </View>
        </View>

        <View className="flex-row gap-1">
          <Pressable
            className={` flex-row items-center justify-center rounded-full py-1 px-2`}
            onPress={handleChangeSheetClick}
            style={{backgroundColor: COLORS.white}}>
            <MIcon name="account-switch" size={20} color={COLORS.black} />
            <Text
              className="text-xs"
              style={{
                fontFamily: FONTS.primaryFont,
                color: COLORS.black,
              }}>
              Select child
            </Text>
          </Pressable>
          <Pressable
            className={` flex-row items-center justify-center rounded-full py-1 px-2`}
            onPress={() => setShowAddChildView(true)}
            style={{backgroundColor: COLORS.white}}>
            <MIcon name="plus" size={20} color={COLORS.black} />
            <Text
              className="text-xs"
              style={{
                fontFamily: FONTS.primaryFont,
                color: COLORS.black,
              }}>
              Add child
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default HeaderComponent;

export const ChangeAddedChild = ({close}) => {
  const {user, customer} = useSelector(authSelector);
  const [childToEdit, setChildToEdit] = useState(null);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const dispatch = useDispatch();
  const {currentChild, children} = useSelector(userSelector);

  // console.log("current chid is", currentChild)

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

  const handleEditChild = child => {
    setChildToEdit(child);
    console.log('child is', child);
  };

  return (
    <View className="w-full items-center">
      <Text
        className="font-semibold"
        style={[FONTS.heading, {color: textColors.textYlMain}]}>
        {customer === 'yes' ? 'Select child' : 'Select child'}
      </Text>
      <View className="w-[90%] mt-3">
        {children?.map((child, key) => {
          return (
            <View
              className="w-full border py-2 px-2 my-2 rounded-md relative"
              style={{
                borderColor:
                  currentChild?.name === child?.name
                    ? textColors?.textYlMain
                    : textColors.textSecondary,
              }}
              key={key}>
              <Pressable
                className="w-full"
                onPress={() => handleChangeCurrentChild(child)}>
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
                </View>

                {child?.courses?.length > 0 && (
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
                            <Text
                              className="text-[12px]"
                              style={{color: textColors.textSecondary}}>
                              {item}
                            </Text>
                          </View>
                        );
                      }}
                      ItemSeparatorComponent={() => (
                        <View className="ml-2"></View>
                      )}
                    />
                  </View>
                )}
              </Pressable>
              {currentChild?.name == child.name && (
                <View
                  className="absolute -top-2 -right-2"
                  style={{backgroundColor: bgColor}}>
                  <MIcon
                    name="check-circle-outline"
                    size={25}
                    color={textColors.textYlMain}
                  />
                </View>
              )}

              <View className="absolute bottom-1 right-1 z-50">
                <MIcon
                  name={
                    childToEdit?.name === child.name
                      ? 'close'
                      : 'pencil-outline'
                  }
                  size={22}
                  color={textColors?.textYlMain}
                  onPress={() => {
                    childToEdit?.name === child.name
                      ? setChildToEdit(null)
                      : handleEditChild(child);
                  }}
                />
              </View>

              {childToEdit?.name === child.name && (
                <View className="w-full">
                  <EditChildView
                    child={child}
                    close={close}
                    setChildToEdit={setChildToEdit}
                  />
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const EditChildView = ({child, close, setChildToEdit}) => {
  const dispatch = useDispatch();
  const {user} = useSelector(authSelector);
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(null);
  const {editChildLoading} = useSelector(userSelector);

  useEffect(() => {
    setChildName(child?.name);
    setChildAge(child?.age);
  }, [child]);

  const arr = [
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

  const onSaveChild = () => {
    let body = {
      toAdd: childName,
      toRemove: child?.name,
      childAge,
      leadId: user?.leadId,
      close,
    };
    console.log('body is', body);
    dispatch(startEditChild(body));
    setChildToEdit(null);
  };

  return (
    <View className="w-full items-center mt-4">
      <View className="w-[80%]">
        <Input
          placeHolder="Enter Child Name"
          setValue={setChildName}
          value={childName}
        />

        <DropdownComponent
          data={arr}
          placeHolder="Select Child"
          setSelectedValue={setChildAge}
          defaultValue={childAge?.toString()}
        />

        <Pressable
          className="w-full py-2 rounded-full justify-center flex-row"
          style={{backgroundColor: COLORS.pblue}}
          onPress={onSaveChild}
          disabled={editChildLoading}>
          <Text className="text-white text-base font-semibold">Save</Text>
          {editChildLoading && (
            <ActivityIndicator
              size={'small'}
              color={'white'}
              className="ml-2"
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};
