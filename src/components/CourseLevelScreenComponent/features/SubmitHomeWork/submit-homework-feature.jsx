import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import allClassesDummyData from '../../../../screens/classesDummyData.json';
import moment from 'moment';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native-animatable';
import Carousel from 'react-native-reanimated-carousel';
import SubmitHomeWorkTile from './SubmitHomeWorkTile';
import SubmitHomeWork from './SubmitHomeWork';

const SubmitHomeworkFeature = () => {
  const [allClassData, setAllClassData] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selecteImages, setSelectedImages] = useState([]);
  useEffect(() => {
    if (allClassesDummyData?.classes?.length > 1) {
      setAllClassData(allClassesDummyData.classes);
    }
  }, [allClassesDummyData]);

  return (
    <View className="w-[100%] h-[100%]">
      <View className="w-[100%] flex flex-row justify-center items-center">
        <Text className="text-black text-[20px] font-semibold">
          Submit Homework
        </Text>
      </View>
      {!selectedClass ? (
        <ScrollView>
          {allClassData?.map(classData => {
            return (
              <SubmitHomeWorkTile
                key={classData?.classNumber}
                classData={classData}
                setSelectedClass={setSelectedClass}
                selectedClass={selectedClass}
              />
            );
          })}
        </ScrollView>
      ) : (
        <SubmitHomeWork
          setSelectedClass={setSelectedClass}
          selectedClass={selectedClass}
          setSelectedImages={setSelectedImages}
          selecteImages={selecteImages}
        />
      )}
    </View>
  );
};

export default SubmitHomeworkFeature;

// export const SubmitHomeWorkTile = ({
//   classData,
//   selectedClass,
//   setSelectedClass,
// }) => {
//   const [startDate, setStartDate] = useState(null);
//   useEffect(() => {
//     const {_seconds, _nanoseconds} = classData?.classDate;
//     const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
//     const dateObject = new Date(milliseconds);
//     console.log('before', moment(dateObject));
//     const date = moment(dateObject).format('MM/DD/YYYY');
//     console.log('check converted Date', date);
//     setStartDate(date);
//   }, [classData]);
//   const ifClassInFuture = () => {
//     const {_seconds, _nanoseconds} = classData?.classDate;
//     const milliseconds = _seconds * 1000 + Math.floor(_nanoseconds / 1e6);
//     const dateObject = new Date(milliseconds);
//     const classDate = moment(dateObject);
//     const currentDate = new Date();
//     if (classDate > currentDate) {
//       return true;
//     } else {
//       return false;
//     }
//   };
//   const getEvaluatedOrNot = () => {
//     if (classData.hasOwnProperty('evaluatedUrls')) {
//       return true;
//     } else {
//       return false;
//     }
//   };
//   const getUploadedOrNot = () => {
//     if (
//       classData.hasOwnProperty('homeworkUrls') &&
//       classData.homeworkUrls.length > 0
//     ) {
//       return true;
//     }
//     return false;
//   };
//   const isChecked = getEvaluatedOrNot();
//   const isUploaded = getUploadedOrNot();
//   const isInFuture = ifClassInFuture();
//   const styles = StyleSheet.create({
//     borderStyle: {
//       borderColor: '#b6abab',
//       borderWidth: 2,
//       borderRadius: 10,
//       overflow: 'hidden',
//     },
//     innerBorder: {
//       borderColor: '#b6abab',
//       borderStyle: 'dashed',
//       borderWidth: 2,
//       padding: 2,
//     },
//   });

//   return (
//     <View
//       style={[styles.borderStyle, styles.innerBorder]}
//       className="w-[100%] h-[120px] bg-[#b6b6bc4f] border-2 border-gray-300 rounded-md mt-3">
//       <View className="w-[100%] h-[50%] flex flex-row justify-between items-start px-3 pt-2 ">
//         <Text className="text-black text-[20px] font-semibold">
//           Class {classData?.classNumber}
//         </Text>
//         <Text className="text-black text-[20px] font-semibold">
//           Held on : {startDate}
//         </Text>
//       </View>
//       <View className="w-[100%] h-[50%] flex flex-row justify-between items-end px-3 pb-2 ">
//         {!isInFuture ? (
//           isChecked ? (
//             <Pressable className="w-[100%] flex flex-row justify-center items-center rounded-md py-2 bg-blue-400">
//               <Text className="text-white text-[20px] font-semibold">
//                 View Checked
//               </Text>
//             </Pressable>
//           ) : (
//             <View className="flex flex-row justify-center items-center w-[100%]">
//               {isUploaded && (
//                 <Pressable className="w-[50%] mr-1 flex flex-row justify-center items-center rounded-md py-2 bg-blue-400">
//                   <Text className="text-white text-[20px] font-semibold">
//                     View Uploaded
//                   </Text>
//                 </Pressable>
//               )}
//               <Pressable
//                 onPress={() => setSelectedClass(classData)}
//                 className={`${
//                   !isUploaded ? 'w-[100%]' : 'w-[50%]'
//                 } flex flex-row justify-center items-center rounded-md py-2 bg-blue-400`}>
//                 <Text className="text-white text-[20px] font-semibold">
//                   Upload
//                 </Text>
//               </Pressable>
//             </View>
//           )
//         ) : (
//           <Pressable
//             disabled={true}
//             className={`${
//               !isUploaded ? 'w-[100%]' : 'w-[50%]'
//             } flex flex-row justify-center items-center rounded-md py-2 bg-blue-200`}>
//             <Text className="text-white text-[20px] font-semibold">Upload</Text>
//           </Pressable>
//         )}
//       </View>
//     </View>
//   );
// };

// export const SubmitHomeWork = ({
//   setSelectedClass,
//   selectedClass,
//   selecteImages,
//   setSelectedImages,
// }) => {
//   const pickFile = async () => {
//     try {
//       setSelectedImages([]);
//       const result = await launchImageLibrary({
//         mediaType: 'photo',
//         quality: 0.3,
//         selectionLimit: 15,
//       });
//       console.log(result);
//       result.assets?.length > 0 &&
//         result.assets?.map(img => {
//           setSelectedImages(pre => [...pre, img]);
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const width = Dimensions.get('window').width;
//   // console.log('loading component=', selecteImages);

//   return (
//     <View className="flex flex-col justify-between items-center w-[100%] h-[57vh]">
//       <View className="flex flex-row justify-start items-center w-[100%] mt-6 mx-auto">
//         <Pressable onPress={() => setSelectedClass(null)}>
//           <MIcon
//             name="arrow-left-bold-circle"
//             className="mt-2"
//             size={35}
//             color="gray"
//           />
//         </Pressable>
//         <Text className="text-black text-[20px] ml-3 font-semibold">
//           Submit homework for class {selectedClass?.classNumber}
//         </Text>
//       </View>
//       {selecteImages?.length > 0 && (
//         <View className="rounded-lg w-[100%] h-[60%] bg-black overflow-hidden">
//           <Carousel
//             loop
//             width={width}
//             height="100%"
//             data={selecteImages}
//             scrollAnimationDuration={1000}
//             renderItem={({item}) => {
//               return (
//                 <View
//                   style={{
//                     flex: 1,
//                     borderWidth: 1,
//                     justifyContent: 'center',
//                   }}
//                   className="relative">
//                   <Image
//                     style={{width: '100%', height: '100%', borderRadius: 10}}
//                     resizeMode="cover"
//                     source={{
//                       uri: item.uri,
//                     }}
//                   />
//                   <Pressable
//                     onPress={() => {
//                       const newImages = selecteImages.filter(value => {
//                         return value.uri !== item.uri;
//                       });
//                       setSelectedImages(newImages);
//                     }}
//                     className="bg-red-500 rounded-lg px-3 py-2 w-[100px] h-fit absolute top-0 right-0 flex flex-row mr-[15px] justify-center items-center">
//                     <Text className="text-white font-semibold text-[16px]">
//                       Delete
//                     </Text>
//                   </Pressable>
//                 </View>
//               );
//             }}
//           />
//         </View>
//         // <FlatList
//         //   className="w-[96%] mx-auto mt-6"
//         //   data={selecteImages}
//         //   horizontal
//         //   keyExtractor={item => item}
//         //   renderItem={item => {
//         //     return (
//         //       <Pressable
//         //         key={item?.item?.featureName}
//         //         // style={{backgroundColor: darkMode ? bgSecondaryColor : 'white'}}
//         //         className=" mt-2 mr-6 h-[150px] w-[120px] relative rounded-md ">
//         //         <View>
//         //           <Image
//         //             style={{width: '100%', height: '100%', borderRadius: 10}}
//         //             resizeMode="cover"
//         //             width={120}
//         //             height={100}
//         //             source={{
//         //               uri: item.item.uri,
//         //             }}
//         //           />
//         //         </View>
//         //       </Pressable>
//         //     );
//         //   }}
//         // />
//       )}
//       <View className="flex flex-col justify-center items-center w-[100%]">
//         <Text className="text-blue-400 text-[18px]">
//           Only .jpg, .jpeg, .png files are allowed
//         </Text>
//         <Text className="text-red-500 text-[18px]">
//           Please DO NOT upload PDF
//         </Text>
//       </View>
//       <Pressable
//         onPress={pickFile}
//         className="flex flex-row justify-center items-center w-[90%] py-2 rounded-md mx-auto bg-blue-300">
//         <MIcon name="image-multiple" className="mt-2" size={35} color="white" />
//         <Text className="text-white font-semibold text-[20px] ml-2">
//           Select images to upload
//         </Text>
//       </Pressable>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
});
