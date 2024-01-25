import React, {useEffect, useRef, useState} from 'react';
import {View, Animated} from 'react-native';
import {useSelector} from 'react-redux';
import allClassData from './classesDummyData.json';
import BottomSheetComponent from '../components/BottomSheetComponent';
import FeatureTray from '../components/CourseLevelScreenComponent/FeatureTray';
import SubmitHomeworkFeature from '../components/CourseLevelScreenComponent/features/SubmitHomeWork/submit-homework-feature';
import PlayRecordingFeature from '../components/CourseLevelScreenComponent/features/play-recordings-feature';
import DownloadWorksheetsFeature from '../components/CourseLevelScreenComponent/features/download-worksheets-feature';
import DownloadCertificateFeature from '../components/CourseLevelScreenComponent/features/download-certificate-feature';
import ClassWiseHomeWorkFeature from '../components/CourseLevelScreenComponent/features/class-wise-homework-feature';
import CustomerSupportFeature from '../components/CourseLevelScreenComponent/features/customer-support-feature';
import SnakeLevels from '../components/CourseLevelScreenComponent/SnakeLevels';

const CourseLevelScreen = ({navigation}) => {
  const [allClasses, setAllClasses] = useState([]);
  const [enabledFeatures, setEnabledFeatures] = useState([]);
  const [features, setFeatures] = useState([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [displayFeature, setDisplayFeature] = useState('submit_homework');
  useEffect(() => {
    if (allClassData?.classes?.length > 1) {
      setAllClasses(allClassData.classes);
    }
    if (allClassData?.features?.length > 0) {
      setEnabledFeatures(allClassData?.features);
    }
  }, [allClassData]);

  const {bgColor, bgSecondaryColor, darkMode} = useSelector(
    state => state.appTheme,
  );
  const scrollA = useRef(new Animated.Value(0)).current;

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
          <View className="h-[100%] relative">
            <SnakeLevels
              navigation={navigation}
              darkMode={darkMode}
              allClasses={allClasses}
            />
          </View>
        </Animated.ScrollView>
      </View>
      {displayFeature === 'submit_homework' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={SubmitHomeworkFeature}
          onClose={() => setSheetOpen(false)}
          snapPoint={['65%', '72%']}
        />
      ) : displayFeature === 'request_recording' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={<PlayRecordingFeature navigation={navigation} />}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '72%']}
        />
      ) : displayFeature === 'download_worksheets' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={DownloadWorksheetsFeature}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '72%']}
        />
      ) : displayFeature === 'course_certificate' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={DownloadCertificateFeature}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '72%']}
        />
      ) : displayFeature === 'view_class_wise_homework' ? (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={ClassWiseHomeWorkFeature}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '72%']}
        />
      ) : (
        <BottomSheetComponent
          isOpen={sheetOpen}
          Children={CustomerSupportFeature}
          onClose={() => setSheetOpen(false)}
          snapPoint={['50%', '65%']}
        />
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
