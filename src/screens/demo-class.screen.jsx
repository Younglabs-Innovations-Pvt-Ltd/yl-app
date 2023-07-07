import {StyleSheet, Text, View} from 'react-native';
import Header from '../components/header.components';

const DemoClassScreen = ({route}) => {
  const {
    params: {data},
  } = route;

  return (
    <View>
      <Header />
      <Text style={styles.heading}>Welcome to Young Labs</Text>
      {data ? (
        <Text>{`Meeting Id = ${data.meetingId} \n Meeting Password = ${data.meetingPassword}`}</Text>
      ) : (
        <Text>Comes from without url</Text>
      )}
    </View>
  );
};

export default DemoClassScreen;

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});
