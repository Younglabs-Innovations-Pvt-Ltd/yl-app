import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {Image, Text} from 'react-native-animatable';
import Backward from '../assets/videoPlayerController/backward.png';
import Foreward from '../assets/videoPlayerController/forward.png';
import Pause from '../assets/newVideoPlayerIcons/pause.png';
import Play from '../assets/newVideoPlayerIcons/play-button.png';
import Fullsize from '../assets/newVideoPlayerIcons/full-screen.png';
import Minisize from '../assets/newVideoPlayerIcons/minimise.png';
import Setting from '../assets/newVideoPlayerIcons/settings.png';
import arrow from '../assets/images/right-arrow.png';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import debounce from 'lodash/debounce';
import {Dropdown} from 'react-native-element-dropdown';
import {FONTS} from '../utils/constants/fonts';

const CourseConductScreen = ({route}) => {
  // const {videoUrl} = route.params;
  // console.log('check videoUrl', videoUrl);
  const [settings, setSettings] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [fullScreen, setFullScreen] = useState(false);
  // const playBackSpeed = [1.0, 1.25, 1.5, 1.75, 2.0];
  const playBackSpeed = [
    {label: 'Normal', value: '1.0'},
    {label: '1.25', value: '1.25'},
    {label: '1.5', value: '1.5'},
    {label: '1.75', value: '1.75'},
    {label: '2.0', value: '2.0'},
  ];
  const Quality = [
    {label: 'low', value: 'low'},
    {label: 'Medium', value: 'Medium'},
    {label: 'High', value: 'High'},
  ];
  // const videoQuality = ['low', 'Medium', 'High'];
  useEffect(() => {
    console.log('check fullscreen', fullScreen);
  }, [fullScreen]);
  return (
    <View style={{flex: 1, width: '100%', height: '100%'}}>
      <NewVideoPlayer
        settings={settings}
        setSettings={setSettings}
        fullScreen={fullScreen}
        setFullScreen={setFullScreen}
        speed={speed}
        // videoUrl={videoUrl}
      />
      {!fullScreen && settings && (
        <View className="h-[35%]  w-[100%] mt-3 flex flex-col justify-start items-center px-3">
          <Dropdown
            style={{
              width: '100%',
              paddingLeft: 10,
              height: 50,
              borderRadius: 10,
              borderColor: 'gray',
              borderWidth: 1,
            }}
            placeholder="Select Speed"
            placeholderStyle={{
              color: 'black',
              fontFamily: FONTS.signika_medium,
            }}
            itemTextStyle={{color: 'black', fontFamily: FONTS.signika_medium}}
            selectedTextStyle={{
              color: 'black',
            }}
            containerStyle={{borderColor: '#dfd2d2', borderRadius: 10}}
            inputSearchStyle={{fontFamily: FONTS.signika_medium}}
            data={playBackSpeed}
            labelField={'label'}
            valueField={'value'}
            value={speed}
            onChange={item => {
              setSpeed(parseFloat(item.value));
            }}
          />
          <Dropdown
            style={{
              width: '100%',
              paddingLeft: 10,
              height: 50,
              borderRadius: 10,
              borderColor: 'gray',
              borderWidth: 1,
              marginTop: 10,
            }}
            placeholder="Select Quality"
            placeholderStyle={{
              color: 'black',
              fontFamily: FONTS.signika_medium,
            }}
            itemTextStyle={{color: 'black', fontFamily: FONTS.signika_medium}}
            selectedTextStyle={{
              color: 'black',
            }}
            containerStyle={{borderColor: '#dfd2d2', borderRadius: 10}}
            inputSearchStyle={{fontFamily: FONTS.signika_medium}}
            data={Quality}
            labelField={'label'}
            valueField={'value'}
            value={speed}
            onChange={item => {
              setSpeed(item.value);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default CourseConductScreen;

export const NewVideoPlayer = ({
  settings,
  setSettings,
  fullScreen,
  setFullScreen,
  speed,
  // videoUrl,
}) => {
  const debouncedSeek = debounce(value => {
    ref.current.seek(value);
    setPause(false);
  }, 500);
  const [openController, setOpenController] = useState(false);
  const [pause, setPause] = useState(false);
  const [progress, setProgress] = useState(null);
  const [sliderValue, setSliderValue] = useState(0);
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  const ref = useRef();
  return (
    <TouchableOpacity
      onPress={() => {
        setOpenController(true);
      }}
      className={`w-[100%] ${
        fullScreen ? 'h-[100%]' : 'h-[200px]'
      } relative bg-black`}>
      <Video
        paused={pause}
        ref={ref}
        onEnd={x => {
          // setSliderValue(0);
          ref.current.seek(0);
          setPause(true);
        }}
        onProgress={x => {
          setProgress(x);
          setSliderValue(x.currentTime);
        }}
        onSeek={x => {
          console.log('check on seek', x);
        }}
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Course%20Cover%20Videos%2FENGLISH%20HANDWRITING%20COURSE%20STRUCTURE%20VIDEO.mp4?alt=media&token=8ccbe67d-3655-43da-be89-0fa482b32682',
        }}
        className={`"w-[100%] ${fullScreen ? 'h-[100%]' : 'h-[200px]'}`}
        resizeMode="contain"
        rate={speed}
      />
      {openController && (
        <TouchableOpacity
          onPress={() => {
            setOpenController(false);
          }}
          style={{backgroundColor: 'rgba(0,0,0,0.1)'}}
          className="h-[100%] w-[100%] absolute">
          <View className="h-[100%] w-[100%] flex flex-row gap-x-3 justify-center items-center">
            <TouchableOpacity
              onPress={() => {
                ref.current.seek(parseInt(progress.currentTime) - 10);
              }}>
              <Image
                source={Backward}
                style={{
                  height: 40,
                  width: 40,
                  tintColor: 'white',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPause(!pause);
              }}>
              <Image
                source={pause ? Play : Pause}
                style={{
                  height: 40,
                  width: 40,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                ref.current.seek(parseInt(progress.currentTime) + 10);
              }}>
              <Image
                source={Foreward}
                style={{
                  height: 40,
                  width: 40,

                  tintColor: 'white',
                }}
              />
            </TouchableOpacity>
          </View>
          <View className="absolute w-[100%] h-[100%] flex flex-row justify-end items-start top-3 right-3">
            <TouchableOpacity
              onPress={() => {
                console.log('chec', settings);
                setSettings(!settings);
              }}>
              <Image
                source={Setting}
                style={{
                  height: 35,
                  width: 35,
                }}
              />
            </TouchableOpacity>
          </View>
          <View className="w-[100%] absolute bottom-0 px-3 flex flex-col justify-center items-start">
            <View className="w-[100%] flex flex-row justify-between items-center">
              <Text className="text-white text-[18px]">
                {format(progress.currentTime)} /{' '}
                {format(progress.seekableDuration)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (fullScreen) {
                    Orientation.lockToPortrait();
                  } else {
                    Orientation.lockToLandscape();
                  }
                  setFullScreen(!fullScreen);
                }}>
                <Image
                  source={!fullScreen ? Fullsize : Minisize}
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              </TouchableOpacity>
            </View>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              thumbTintColor="white"
              maximumValue={progress.seekableDuration}
              value={sliderValue}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              // onValueChange={x => {
              //   ref.current.seek(x);
              // }}
              onSlidingStart={() => {
                setPause(true);
              }}
              onSlidingComplete={value => {
                debouncedSeek(value);
                setSliderValue(value);
                // ref.current.seek(value);
                // setPause(false);
              }}
            />
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export const VideoPlayer = () => {
  const [clicked, setClicked] = useState(false);
  const [puased, setPaused] = useState(false);
  const [progress, setProgress] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);
  const ref = useRef();
  const format = seconds => {
    let mins = parseInt(seconds / 60)
      .toString()
      .padStart(2, '0');
    let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  return (
    <TouchableOpacity
      onPress={() => {
        console.log('clicking');
        setClicked(true);
      }}
      style={{width: '100%', height: fullScreen ? '100%' : 200}}>
      <Video
        ref={ref}
        onProgress={x => {
          setProgress(x);
        }}
        paused={puased}
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/younglabs-8c353.appspot.com/o/Course%20Cover%20Videos%2FENGLISH%20HANDWRITING%20COURSE%20STRUCTURE%20VIDEO.mp4?alt=media&token=8ccbe67d-3655-43da-be89-0fa482b32682',
        }}
        style={{width: '100%', height: fullScreen ? '100%' : 200}}
        resizeMode="contain"
      />
      {clicked && (
        <TouchableOpacity className="bg-[rgb(0,0,0,5)] flex justify-center items-center w-[100%] h-[100%] absolute">
          <View className="flex flex-row">
            <TouchableOpacity
              onPress={() => {
                ref.current.seek(parseInt(progress.currentTime) - 10);
              }}>
              <Image
                source={Backward}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: 'white',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPaused(!puased);
              }}>
              <Image
                source={puased ? Play : Pause}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: 'white',
                  marginLeft: 50,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                ref.current.seek(parseInt(progress.currentTime) + 10);
              }}>
              <Image
                source={Foreward}
                style={{
                  height: 30,
                  width: 30,
                  tintColor: 'white',
                  marginLeft: 50,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
              position: 'absolute',
              bottom: 0,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <Text style={{color: 'white'}}>{format(progress.currentTime)}</Text>
            <Slider
              style={{width: '80%', height: 40}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
              onValueChange={x => {
                ref.current.seek(x);
              }}
            />
            <Text style={{color: 'white'}}>
              {format(progress.seekableDuration)}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
              width: '100%',
              position: 'absolute',
              top: 0,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                if (fullScreen) {
                  Orientation.lockToPortrait();
                } else {
                  Orientation.lockToLandscape();
                }
                setFullScreen(!fullScreen);
              }}>
              <Image
                source={!fullScreen ? Fullsize : Minisize}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: 'white',
                }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};