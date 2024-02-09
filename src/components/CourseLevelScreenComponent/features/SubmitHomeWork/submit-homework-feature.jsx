import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import SubmitHomeWorkTile from './SubmitHomeWorkTile';
import SubmitHomeWork from './SubmitHomeWork';
import {handleCourseSelector} from '../../../../store/handleCourse/selector';
import {useSelector} from 'react-redux';
import ViewUploadedHomeWork from './ViewUploadedHomeWork';

const SubmitHomeworkFeature = ({setSheetOpen, serviceRequestId}) => {
  const [allClassesHomeWork, setAllClassesHomeWork] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewUploadedHomwWork, setViewUploadedHomwWork] = useState(false);
  const [editHomeWork,setEditHomeWork] = useState(false)

  const {
    serviceReqClassesLoading,
    serviceReqClassesData,
    serviceReqClassesDataFailed,
  } = useSelector(handleCourseSelector);
  useEffect(() => {
    if (serviceReqClassesData?.classes?.length > 0) {
      setAllClassesHomeWork(serviceReqClassesData?.classes);
    }
  }, [serviceReqClassesData]);

  return (
    <View className="w-[100%] h-[100%]">
      <View className="w-[100%] flex flex-row justify-center items-center">
        {!viewUploadedHomwWork && (
          <Text className="text-black text-[20px] font-semibold">
            Submit Homework
          </Text>
        )}
      </View>
      {!selectedClass ? (
        <ScrollView>
          {allClassesHomeWork?.map(classData => {
            return (
              <SubmitHomeWorkTile
                classData={classData}
                setSelectedClass={setSelectedClass}
                selectedClass={selectedClass}
                setViewUploadedHomwWork={setViewUploadedHomwWork}
                setEditHomeWork={setEditHomeWork}
              />
            );
          })}
        </ScrollView>
      ) : viewUploadedHomwWork ? (
        <ViewUploadedHomeWork
          selectedClass={selectedClass}
          setSelectedClass={setSelectedClass}
          setViewUploadedHomwWork={setViewUploadedHomwWork}
          setEditHomeWork={setEditHomeWork}
          editHomeWork={editHomeWork}
          serviceRequestId={serviceRequestId}
        />
      ) : (
        <SubmitHomeWork
        serviceReqClassesLoading={serviceReqClassesLoading}
          setSheetOpen={setSheetOpen}
          setSelectedClass={setSelectedClass}
          selectedClass={selectedClass}
          serviceRequestId={serviceRequestId}
        />
      )}
    </View>
  );
};

export default SubmitHomeworkFeature;

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
  },
});
