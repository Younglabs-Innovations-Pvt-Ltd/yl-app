import React, {useEffect} from 'react';
import {useNetInfo} from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setIsConnected} from '../store/network/reducer';

const NetworkContext = React.createContext();

export const NetworkProvider = ({children}) => {
  const dispatch = useDispatch();
  const {isConnected} = useNetInfo();

  useEffect(() => {
    dispatch(setIsConnected(isConnected));
  }, [isConnected]);

  return (
    <NetworkContext.Provider value={{}}>{children}</NetworkContext.Provider>
  );
};
