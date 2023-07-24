import React, {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const useDataFetcherWithRetry = apiUrl => {
  const timeout = 5000;
  const [isOnline, setIsOnline] = useState(false);

  async function fetchDatawithTimeout() {
    try {
      const response = await fetch(apiUrl);
      return response.json();
    } catch (error) {
      return;
    }
  }
};
