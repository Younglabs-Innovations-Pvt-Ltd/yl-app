import React, {useContext, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

const NetworkContext = React.createContext();

export const useNetworkContext = () => useContext(NetworkContext);

const TAG = 'NETWORK STATE CONTEXT';

export const NetworkProvider = ({children}) => {
  const [isConnected, setIsConnected] = useState(true);

  const setCurrentNetworkState = state => setIsConnected(state);

  const checkNetworkState = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    } catch (error) {
      console.log(TAG, error);
    }
  };

  const value = {
    isConnected,
    setCurrentNetworkState,
    checkNetworkState,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};
