import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BASE_URL} from '@env';
import auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {authSelector} from '../store/auth/selector';

const MyTickets = () => {
  const [myTickets, ssetMyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const {user} = useSelector(authSelector);

  const fetchCustomerTickets = async () => {
    try {
      const token = await auth().currentUser.getIdToken();
      const API_URL = `${BASE_URL}/admin/tickets/getticketscustomer`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          leadId: user?.leadId,
        }),
      });
      if (response.status === 200) {
        const result = await response.json();
        ssetMyTickets(result?.tickets);
      } else {
        Showtoast({
          text: 'Something went wrong while fetching tickets',
          toast,
          type: 'danger',
        });
      }
      setLoading(false);
    } catch (error) {}
  };
  useEffect(() => {
    fetchCustomerTickets();
  }, []);

  return <View style={styles.container}></View>;
};

export default MyTickets;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
