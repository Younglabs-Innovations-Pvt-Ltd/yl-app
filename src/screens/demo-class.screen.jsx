import {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Header from '../components/header.components';
import CountDown from '../components/countdown.component';
import Seperator from '../components/seperator.component';
import Button from '../components/Button.component';
import {TextInput} from 'react-native-gesture-handler';
import {joinClassOnZoom} from '../natiive-modules/zoom-modules';

const getTimeRemaining = () => {
  const countDownTime = new Date('2023-07-07T11:30:00.000Z').getTime();
  const now = new Date().getTime();

  const remainingTime = countDownTime - now;

  const days = Math.floor((remainingTime / (1000 * 60 * 60 * 24)) % 24);
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  if (remainingTime <= 0) {
    return {days: 0, hours: 0, minutes: 0, seconds: 0, remainingTime: 0};
  }

  return {days, hours, minutes, seconds, remainingTime};
};

const DemoClassScreen = ({route}) => {
  const {
    params: {data},
  } = route;

  const [childName, setChildName] = useState('');
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining());
  const [isTimeover, setIsTimeover] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining();
      // remaining time <= 0
      // set timeover true
      // clear interval
      if (remaining.remainingTime <= 0) {
        setIsTimeover(true);
        clearInterval(timer);
        return;
      }

      // set time to show
      setTimeLeft(remaining);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // Join Class
  const handleJoinClass = async () => {
    if (!data || !childName) {
      console.log('No class data found');
      return;
    }

    try {
      const {meetingId, meetingPassword} = data;
      const res = await joinClassOnZoom(meetingId, meetingPassword);
      console.log('Join Class', res);
    } catch (error) {
      console.log('Join class error', error);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {/* Logo */}
        <View style={{width: '100%', alignItems: 'center'}}>
          <Image
            source={require('../images/YoungLabsLogo.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>
        <View style={styles.box}>
          <Text style={styles.heading}>Welcome to YoungLabs</Text>
          <Seperator />
          <CountDown timeLeft={timeLeft} />
          <Seperator />
          {isTimeover ? (
            data ? (
              <>
                <TextInput
                  placeholder="Child Name"
                  selectionColor="#000"
                  style={styles.input}
                  value={childName}
                  onChangeText={e => setChildName(e)}
                />
                <Seperator />
                <Button onPress={handleJoinClass} bg="#3CCF4E">
                  Join Class
                </Button>
              </>
            ) : (
              <Text>Not coming through url</Text>
            )
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  logo: {
    width: 136,
    height: 136,
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  container: {
    paddingTop: 48,
    paddingHorizontal: 12,
  },
  box: {
    maxWidth: 540,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
  },
});
