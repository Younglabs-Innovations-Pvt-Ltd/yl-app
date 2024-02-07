import {View, Text, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';

const ClassWiseHomeWorkFeature = ({serviceReqClassesData}) => {
  const [classWiseHomeWork, setClassWiseHomeWork] = useState([
    {
      classNumber: 1,
      homeWork:
        'Day 1 Sample +Basic Strokes, Loops and Patterns (Page number 0-7)',
    },
    {
      classNumber: 2,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 3,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 4,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 5,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 6,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 7,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 8,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 9,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 10,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 11,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
    {
      classNumber: 12,
      homeWork: 'Day 2 Sample +Basic Strokes, Loops and Patterns ',
    },
  ]);
  useEffect(() => {
    if (serviceReqClassesData) {
      serviceReqClassesData?.classes?.map(studentClass => {
        console.log({
          classNumber: studentClass?.classNumer,
          homeWork: studentClass?.homework,
        });
      });
    }
  }, [serviceReqClassesData]);
  return (
    <View className="w-[100%] h-[100%]">
      <ScrollView>
        {classWiseHomeWork?.map(({classNumber, homeWork}) => {
          return (
            <View className="w-[100%] h-[90px] bg-[#b6b6bc4f] border-2 border-gray-300 rounded-md mt-3">
              <View className="w-[100%] h-[100%] flex flex-row justify-between items-start flex-wrap px-3 pt-2 ">
                <Text className="text-black font-semibold text-[19px]">
                  Class {classNumber} :{' '}
                </Text>
                <Text className="text-black text-[15px]">{homeWork}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ClassWiseHomeWorkFeature;
