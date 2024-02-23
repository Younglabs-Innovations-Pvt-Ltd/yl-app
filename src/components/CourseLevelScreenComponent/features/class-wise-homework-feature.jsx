import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

const ClassWiseHomeWorkFeature = ({serviceReqClassesData}) => {
  const {bgSecondaryColor, textColors} = useSelector(state => state.appTheme);
  const [classWiseHomeWork, setClassWiseHomeWork] = useState([]);
  useEffect(() => {
    if (serviceReqClassesData) {
      let classWiseHomeWorkList;
      serviceReqClassesData?.classes?.map(studentClass => {
        classWiseHomeWork.push({
          classNumber: studentClass?.classNumer,
          homeWork: studentClass?.homework,
        });
      });
      setClassWiseHomeWork(classWiseHomeWorkList);
    }
  }, [serviceReqClassesData]);
  return (
    <View className="w-[100%] h-[100%]">
      <ScrollView>
        {classWiseHomeWork?.map(({classNumber, homeWork}, index) => {
          return (
            <View
              key={index}
              className="w-[100%] h-[90px] bg-[#b6b6bc4f] border-2 border-gray-300 rounded-md mt-3">
              <View className="w-[100%] h-[100%] flex flex-row justify-between items-start flex-wrap px-3 pt-2 ">
                <Text
                  style={{color: textColors?.textPrimary}}
                  className="text-black font-semibold text-[19px]">
                  Class {classNumber} :{' '}
                </Text>
                <Text
                  style={{color: textColors?.textSecondary}}
                  className="text-[15px]">
                  {homeWork}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ClassWiseHomeWorkFeature;
