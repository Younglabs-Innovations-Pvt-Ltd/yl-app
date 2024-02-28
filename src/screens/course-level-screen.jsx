import React, {useEffect, useRef, useState} from 'react';
import {View, Animated, ActivityIndicator, Modal} from 'react-native';
import BottomSheetComponent from '../components/BottomSheetComponent';
import FeatureTray from '../components/CourseLevelScreenComponent/FeatureTray';
import SubmitHomeworkFeature from '../components/CourseLevelScreenComponent/features/SubmitHomeWork/submit-homework-feature';
import PlayRecordingFeature from '../components/CourseLevelScreenComponent/features/play-recordings-feature';
import {downloadWorksheet} from '../components/CourseLevelScreenComponent/features/download-worksheets-feature';
import {downloadCertificate} from '../components/CourseLevelScreenComponent/features/download-certificate-feature';
import ClassWiseHomeWorkFeature from '../components/CourseLevelScreenComponent/features/class-wise-homework-feature';
import CustomerSupportFeature from '../components/CourseLevelScreenComponent/features/customer-support-feature';
import SnakeLevels from '../components/CourseLevelScreenComponent/SnakeLevels';
import {startFetchServiceRequestClasses} from '../store/handleCourse/reducer';
import {useDispatch, useSelector} from 'react-redux';
import {authSelector} from '../store/auth/selector';
import {handleCourseSelector} from '../store/handleCourse/selector';
import {SetHomeWorkSubmit} from '../store/homework-submit/reducer';
import {handleClassesHomeWork} from '../store/homework-submit/selector';
import {handleRequestRecording} from '../store/request-recording/selector';
import {SetRecordingRequest} from '../store/request-recording/reducer';
import AskPreClassRating from '../components/CourseLevelScreenComponent/AskPreClassRating';
import {useToast} from 'react-native-toast-notifications';
import {Showtoast} from '../utils/toast';

const CourseLevelScreen = ({navigation, route}) => {
  const {serviceRequestId,course} = route.params;
  const [allClasses, setAllClasses] = useState([]);
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [features, setFeatures] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [askForRating, setAskForRating] = useState(false);
  const [displayFeature, setDisplayFeature] = useState('submit_homework');
  const [previousClassData, setPreviousClassData] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();
  const {user} = useSelector(authSelector);
  const {serviceReqClassesLoading, serviceReqClassesData} =
    useSelector(handleCourseSelector);
  const {homeworksubmittedsuccessfully} = useSelector(handleClassesHomeWork);
  const {requestRecordingSuccessfully} = useSelector(handleRequestRecording);
  const handleCourseClick = ({serviceRequestId}) => {
    const leadId = user?.leadId;
    dispatch(startFetchServiceRequestClasses({leadId, serviceRequestId}));
  };

  useEffect(() => {
    console.log('homeworksubmittedsuccessfully', homeworksubmittedsuccessfully);
    if (homeworksubmittedsuccessfully || requestRecordingSuccessfully) {
      const leadId = user.leadId;
      dispatch(startFetchServiceRequestClasses({leadId, serviceRequestId}));
      dispatch(SetHomeWorkSubmit());
      dispatch(SetRecordingRequest());
    }
  }, [homeworksubmittedsuccessfully, requestRecordingSuccessfully]);

  useEffect(() => {
    handleCourseClick({serviceRequestId});
  }, [user]);

  useEffect(() => {
    // console.log('orifbhoergherih', serviceReqClassesData?.classes);
    if (serviceReqClassesData?.classes) {
      setAllClasses(serviceReqClassesData?.classes);
    }
    if (serviceReqClassesData?.features?.length > 0) {
      setEnabledFeatures(serviceReqClassesData?.features);
    }
  }, [serviceReqClassesData]);

  const {bgColor, bgSecondaryColor, darkMode} = useSelector(
    state => state.appTheme,
  );
  const scrollA = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (displayFeature === 'download_worksheets') {
      Showtoast({
        text: 'Download started',
        toast,
        type: 'success',
      });
      const response = downloadWorksheet({serviceReqClassesData});
    }
    if (displayFeature === 'course_certificate') {
      const leadId = user.leadId;
      downloadCertificate({
        leadId,
        serviceRequestId,
      });
    }
  }, [displayFeature]);

  return (
    <>
      <View style={{backgroundColor: darkMode ? bgColor : '#76C8F2'}}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}>
          <View style={styles.bannerContainer}>
            <FeatureTray
              scrollA={scrollA}
              bgSecondaryColor={bgSecondaryColor}
              darkMode={darkMode}
              enabledFeatures={enabledFeatures}
              features={features}
              setFeatures={setFeatures}
              sheetOpen={sheetOpen}
              setSheetOpen={setSheetOpen}
              displayFeature={displayFeature}
              setDisplayFeature={setDisplayFeature}
            />
          </View>
          {!serviceReqClassesLoading && (
            <View className="h-[100%] relative">
              <SnakeLevels
                navigation={navigation}
                darkMode={darkMode}
                allClasses={allClasses}
                setAskForRating={setAskForRating}
                askForRating={askForRating}
                setPreviousClassData={setPreviousClassData}
              />
            </View>
          )}
        </Animated.ScrollView>
        {serviceReqClassesLoading && (
          <View className="h-[70%] w-full flex flex-row justify-center items-center">
            <ActivityIndicator color={'white'} size={30} />
          </View>
        )}

        {askForRating && (
          <AskPreClassRating
            previousClassData={previousClassData}
            setAskForRating={setAskForRating}
          />
        )}
      </View>
      {displayFeature === 'submit_homework' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={
            <SubmitHomeworkFeature
              setSheetOpen={setSheetOpen}
              serviceRequestId={serviceRequestId}
            />
          }
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '70%']}
        />
      ) : displayFeature === 'request_recording' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={<PlayRecordingFeature navigation={navigation} />}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '70%']}
        />
      ) : // displayFeature === 'download_worksheets' ? (
      // downloadWorksheet()
      // <BottomSheetComponent
      //   isOpen={sheetOpen}
      //   Children={DownloadWorksheetsFeature}
      //   onClose={() => setSheetOpen(false)}
      //   snapPoint={['65%', '72%']}
      // />
      // ) :
      // displayFeature === 'course_certificate' ? (
      //   <BottomSheetComponent
      //     isOpen={sheetOpen}
      //     Children={DownloadCertificateFeature}
      //     onClose={() => setSheetOpen(false)}
      //     snapPoint={['65%', '72%']}
      //   />
      // ) :
      displayFeature === 'view_class_wise_homework' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={
            <ClassWiseHomeWorkFeature
              serviceReqClassesData={serviceReqClassesData}
            />
          }
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '70%']}
        />
      ) : (
        displayFeature === 'customer_support' && (
          <BottomSheetComponent
            isOpen={sheetOpen}
            Children={
              <CustomerSupportFeature
                setSheetOpen={setSheetOpen}
                serviceReqClassesData={serviceReqClassesData}
                course={course}
              />
            }
            onClose={() => setSheetOpen(false)}
            snapPoint={['50%', '70%']}
          />
        )
      )}
    </>
  );
};

export default CourseLevelScreen;

const styles = {
  bannerContainer: {
    marginTop: -1000,
    paddingTop: 1000,
    alignItems: 'center',
    overflow: 'hidden',
  },
};
