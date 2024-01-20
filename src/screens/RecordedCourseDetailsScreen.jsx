import {
  View,
  Text,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {FlatList, ScrollView, TextInput} from 'react-native-gesture-handler';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FONTS} from '../utils/constants/fonts';
import Collapsible from 'react-native-collapsible';
import {Button} from 'react-native-share';
import Accordion from 'react-native-collapsible/Accordion';
import Input from '../components/CustomInputComponent';
import {Showtoast} from '../utils/toast';
import {useToast} from 'react-native-toast-notifications';
import Testimonial from '../components/MainScreenComponents/Testimonial';

const {width, height} = Dimensions.get('window');
const RecordedCourseDetailsScreen = ({route}) => {
  const {darkMode, bgColor, textColors, bgSecondaryColor, colorYlMain} =
    useSelector(state => state.appTheme);
  const {courseName, courseId} = route.params;
  const featuresstyle = 'w-[32%] p-2 flex-col items-center';
  const arr = [
    'Lorem ipsum dolor sit amet consectetur adipisicing elit.Voluptas itaque explicabo omnis',
    'lorem100 dolor sit amet consectetur adipisicing elit non',
    'Lorem ipsum dolor sit amet consectetu Voluptas itaque explicabo omnis',
    'Lorem ipsum dolor sit amet consectetu Voluptas itaque explicabo omnis oia hsuf uahsdfiohasdf asdhf ohadsf igdfs',
    'Lorem ipsum dolor sit amet',
  ];

  const testimonials = [
    {
      name: 'Jhon Doe',
      posted_on: '12-04-2022',
      comment:
        'lorem ipsum d Pellentesque habitant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am',
      coverPictureLink: null,
    },
    {
      name: 'Harry hess',
      posted_on: '16-03-2023',
      comment:
        'lorementesque habi tant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am lorem ipsum adhf hadfiuh ',
      coverPictureLink: null,
    },
    {
      name: 'Simon dull',
      posted_on: '16-03-2023',
      comment:
        'lorementesque habi tant morbi tristique senectus et netus et malesu faucibus et faucibus et feugiat labor lorem. Lorem ipsum dolor sit am lorem ipsum adhf hadfiuh ',
      coverPictureLink: null,
    },
  ];

  return (
    <ScrollView
      className="bg-gray-400"
      contentContainerStyle={{backgroundColor: bgColor}}>
      <View className="h-[230px]">
        <Image
          source={require('../assets/images/courseBanner.png')}
          className="w-full max-h-[230px]"
          resizeMode="cover"
        />
      </View>

      {/* Course Buy Component */}
      <View className="mt-2 w-full items-center">
        <View className="w-[100%]">
          <CourseBuyComponent />
        </View>
      </View>

      {/* Course Includes */}
      <View className="w-full items-center mt-3">
        <View
          className="w-[100%] p-2 shdadow-md shdadow-gray-400 flex-col"
          style={{backgroundColor: colorYlMain}}>
          <View className="flex-row w-full items-start justify-between">
            <View className={`${featuresstyle}`}>
              <View className="h-[30px]">
                <MIcon
                  name="video-wireless-outline"
                  color={'white'}
                  size={28}
                />
              </View>
              <View className="ml-2 mt-1">
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  Recorded Sessions
                </Text>
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  8
                </Text>
              </View>
            </View>
            <View className={`${featuresstyle}`}>
              <View className="h-[30px]">
                <MIcon
                  name="file-document-multiple"
                  color={'white'}
                  size={28}
                />
              </View>
              <View className="ml-2 mt-1">
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  WorkSheets for Practice
                </Text>
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  8
                </Text>
              </View>
            </View>
            <View className={`${featuresstyle}`}>
              <View className="h-[30px]">
                <MIcon
                  name="clock-time-eight-outline"
                  color={'white'}
                  size={28}
                />
              </View>
              <View className="ml-2 mt-1">
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  Course Duration
                </Text>
                <Text
                  className="text-[12px] text-center font-semibold"
                  style={{color: 'white'}}>
                  LifeTime
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Course Details */}
      <View className="w-full mt-8 px-2">
        <View className="relative py-2">
          <Text
            className="w-full font-semibold text-[20px]"
            style={{color: textColors.textPrimary}}>
            More About Course
          </Text>
          <View
            className="absolute bottom-0 left-0 w-[35%] p-[2px] rounded-full"
            style={{backgroundColor: textColors.textYlMain}}></View>
        </View>

        <View className="w-full px-1 mt-1">
          {arr.map(item => {
            return (
              <View className="flex-row items-center mt-2" key={item}>
                <View className="w-[8%]">
                  <MIcon
                    name="check-circle-outline"
                    color={textColors.textYlGreen}
                    size={20}
                  />
                </View>
                <Text
                  className="w-[90%] flex-wrap text-start text-[14px]"
                  style={{
                    fontFamily: FONTS.signika_medium,
                    color: textColors.textSecondary,
                  }}>
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* CourseIntroDuction */}
      <View className="mt-8 w-full">
        <View className="relative py-2 ml-2 ">
          <Text
            className="w-full font-semibold text-[20px]"
            style={{color: textColors.textPrimary}}>
            Course Introduction
          </Text>
          <View
            className="absolute bottom-0 left-0 w-[30%] p-[2px] rounded-full"
            style={{backgroundColor: textColors.textYlMain}}></View>
        </View>
        <View className="w-[100%]">
          <CourseIntroIntroduction />
        </View>
      </View>

      {/* Testimonials */}
      <View className="mt-8 w-full">
        <View className="relative py-2 ml-2 ">
          <Text
            className="w-full font-semibold text-[20px]"
            style={{color: textColors.textPrimary}}>
            Our Happy Customers
          </Text>
          <View
            className="absolute bottom-0 left-0 w-[30%] p-[2px] rounded-full"
            style={{backgroundColor: textColors.textYlMain}}></View>
        </View>
        <View className="w-[100%] mt-3">
          <FlatList
            data={testimonials}
            keyExtractor={item => item.name}
            renderItem={item => {
              return <Testimonial data={item.item} />;
            }}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
      </View>

      {/* Inquiry Section */}
      <View className="mt-8 w-full">
        <View className="relative py-2 ml-2 ">
          <Text
            className="w-full font-semibold text-[20px]"
            style={{color: textColors.textPrimary}}>
            Have some Enquiry? Connect us
          </Text>
          <View
            className="absolute bottom-0 left-0 w-[60%] p-[2px] rounded-full"
            style={{backgroundColor: textColors.textYlMain}}></View>
        </View>
        <View
          className="w-[100%] mt-5 px-2 items-center bg-gray-100 py-4"
          style={darkMode ? {backgroundColor: bgSecondaryColor} : {}}>
          <InquirySection />
        </View>
      </View>

      {/* FAQ's */}
      <View className="mt-8 w-full">
        <View className="relative py-2 ml-2 ">
          <Text
            className="w-full font-semibold text-[20px]"
            style={{color: textColors.textPrimary}}>
            Frequently Asked Questions
          </Text>
          <View
            className="absolute bottom-0 left-0 w-[45%] p-[2px] rounded-full"
            style={{backgroundColor: textColors.textYlMain}}></View>
        </View>
        <View className="w-[100%] mt-3">
          <FAQView />
        </View>
      </View>

      <View className="my-4"></View>
    </ScrollView>
  );
};

const CourseBuyComponent = () => {
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  return (
    <>
      <View className="w-full px-2">
        <View className="w-full flex-row items-center">
          <Text
            className="text-[16px] font-semibold"
            style={{color: textColors.textSecondary}}>
            Buy Course at Offer Price, INR
          </Text>
          <Text
            className="text-[22px] ml-2 font-semibold"
            style={{color: textColors.textYlMain}}>
            599
          </Text>
          <Text
            className="line-through text-[14px] ml-1"
            style={{color: textColors.textSecondary}}>
            999
          </Text>
        </View>

        <View className="flex-row w-full justify-center my-2">
          {/* <Pressable className="py-2 px-4 border-none outline-none flex-row items-center">
            <MIcon
              name="cart-plus"
              color={textColors.textSecondary}
              size={28}z
            />
            <Text className="ml-1 font-semibold">Add To Cart</Text>
          </Pressable> */}

          <Pressable
            className="py-2 w-full border-none outline-none flex-row items-center justify-center rounded-full"
            style={{backgroundColor: textColors.textYlMain}}>
            <MIcon name="currency-usd" color={'white'} size={28} />
            <Text className="ml-1 text-white font-semibold">Buy Now</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const CourseIntroIntroduction = () => {
  return (
    <View className="w-full items-center mt-4">
      <View className="w-[90%] h-[220px] rounded-md bg-gray-100 items-center justify-center">
        <Text className="text-xl font-semibold">Course Intro Video Here</Text>
      </View>
    </View>
  );
};

const FAQView = () => {
  const [activeSection, setActiveSection] = useState('');
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const faqs = [
    {
      ques: 'first Question',
      ans: 'first Answer ahsd ufhaih sdfoah sdfoguad sfuguashs fohai osdfhuagsd uifgusadf first Answer ahsd ufhaih sdfoah sdfoguad sfuguashs fohai osdfhuagsd uifgusadf',
      id: 1,
    },
    {
      ques: 'Second Question',
      ans: 'Second ffirst Answer ahsd ufhaih sdfoah sdfoguad sfuguashs fohai osdfhuagsd uifgusadfirst Answer ahsd ufhaih sdfoah sdfoguad sfuguashs fohai osdfhuagsd uifgusadf',
      id: 2,
    },
  ];

  const handleAccordianClick = item => {
    if (activeSection === item.id) {
      setActiveSection('');
    } else {
      setActiveSection(item.id);
    }
  };

  return (
    <View className="w-full items-center">
      {faqs.map((item, index) => {
        return (
          <View className="w-[95%] my-1 rounded overflow-hidden" key={index}>
            <Pressable
              className="w-full flex-row p-2 items-center justify-between"
              onPress={() => handleAccordianClick(item)}
              style={{backgroundColor: bgSecondaryColor}}>
              <View className="flex-row">
                <Text
                  className="font-semibold text-[18px]"
                  style={{color: textColors.textPrimary}}>
                  {index + 1}
                </Text>
                <Text
                  className="font-semibold ml-3 text-[18px]"
                  style={{color: textColors.textPrimary}}>
                  {item.ques}
                </Text>
              </View>

              <MIcon
                name={activeSection == item.id ? 'chevron-up' : 'chevron-down'}
                size={30}
                color={textColors.textPrimary}
              />
            </Pressable>

            <Collapsible
              collapsed={activeSection === item.id ? false : true}
              duration={450}>
              <View className="w-full p-2">
                <Text className="" style={{color: textColors.textSecondary}}>
                  {item.ans}
                </Text>
              </View>
            </Collapsible>
          </View>
        );
      })}
    </View>
  );
};

const InquirySection = () => {
  const [inqSubmitting, setInqSubmitting] = useState(false);
  const {darkMode, bgColor, textColors, bgSecondaryColor} = useSelector(
    state => state.appTheme,
  );
  const toast = useToast();

  const [inqData, setInqData] = useState({
    fullName: '',
    phone: '',
    courseId: 'Eng_Hw_Rec',
    source: 'App',
    comment: '',
  });

  const handleInputFields = (value, field) => {
    setInqData(preVals => {
      return {...preVals, [field]: value};
    });
  };

  const validateFormFields = () => {
    if (inqData.fullName?.length < 3) {
      Showtoast({text: 'Please enter valid Parent Name', toast});
      return false;
    } else if (inqData.phone?.length < 5) {
      Showtoast({text: 'Please enter phone number', toast});
      return false;
    } else if (inqData.comment?.length < 10) {
      Showtoast({text: 'Enter 15 words minimun in Enquiry', toast});
      return false;
    } else {
      return true;
    }
  };

  const resetForm = () => {
    setInqData({
      fullName: '',
      phone: '',
      courseId: 'Eng_Hw_Rec',
      source: 'App',
      comment: '',
    });
  };

  const handleSubmitInquiry = () => {
    if (!validateFormFields()) {
      return;
    }
    setInqSubmitting(true);
    console.log('body is', inqData);
    setTimeout(() => {
      setInqSubmitting(false);
      Showtoast({
        text: 'Form Submitted Successfully. We will return back to you soon',
        toast,
      });
      resetForm();
    }, 2000);
  };

  return (
    <View className="w-[98%] p-2">
      <View className="flex-row w-full justify-between">
        <View className="w-[45%] flex-row border-b border-gray-400 overflow-hidden">
          <MIcon name="account" size={30} color={textColors.textSecondary} />
          <TextInput
            className="border-none  w-full text-[14px] py-1 px-2"
            placeholder="Parent Name"
            value={inqData?.fullName}
            onChangeText={e => handleInputFields(e, 'fullName')}
            placeholderTextColor={'gray'}
            style={{color: textColors.textSecondary}}
          />
        </View>

        <View className="w-[50%] flex-row border-b border-gray-400 overflow-hidden items-center">
          <MIcon name="phone" size={25} color={textColors.textSecondary} />
          <TextInput
            className="border-none  w-full text-[14px] py-1 px-2"
            placeholder="phone Number"
            keyboardType={'phone-pad'}
            value={inqData?.phone}
            onChangeText={e => handleInputFields(e, 'phone')}
            placeholderTextColor={'gray'}
            style={{color: textColors.textSecondary}}
          />
        </View>
      </View>

      <View>
        <TextInput
          multiline={true}
          numberOfLines={6}
          className="border-none w-full text-[14px] py-0 px-2 border-b border-gray-400"
          placeholder="Type your enquiry here"
          value={inqData?.comment}
          onChangeText={e => handleInputFields(e, 'comment')}
          placeholderTextColor={'gray'}
          style={{color: textColors.textSecondary}}
        />
      </View>

      <View className="w-full justify-center mt-6 flex-row">
        <Pressable
          className="py-3 px-5 rounded-full flex-row items-center"
          style={{backgroundColor: textColors.textYlGreen}}
          onPress={() => {}}>
          <MIcon name="whatsapp" size={25} color="white" />
          <Text className="text-[16px] text-white font-semibold ml-1">
            Whatsapp us
          </Text>
        </Pressable>

        <Pressable
          className="py-3 px-5 rounded-full ml-3 justify-center flex-row"
          style={{backgroundColor: textColors.textYlMain}}
          onPress={() => handleSubmitInquiry()}>
          <Text className="text-[16px] text-white font-semibold">
            Submit Now
          </Text>
          {inqSubmitting && (
            <ActivityIndicator className="ml-1" color={'white'} />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default RecordedCourseDetailsScreen;
