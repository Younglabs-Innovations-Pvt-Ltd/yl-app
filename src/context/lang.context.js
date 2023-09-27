import React, {useState, useEffect, createContext, useContext} from 'react';
import LocalizedStrings from 'react-native-localization';
import {localizedStrings} from '../localization';
import {
  getCurrentLocalLangAsync,
  setCurrentLocalLangAsync,
} from '../utils/storage/storage-provider';

const Context = createContext();
const localLang = new LocalizedStrings(localizedStrings);

export const i18nContext = () => useContext(Context);

export const I18NProvider = ({children}) => {
  const [currentLang, setCurrentLang] = useState('en-IN');
  const [loading, setLoading] = useState(true);

  localLang.setLanguage(currentLang);

  useEffect(() => {
    getCurrentLocalLang();
  }, []);

  const getCurrentLocalLang = async () => {
    try {
      const lang = await getCurrentLocalLangAsync();
      if (lang) {
        setCurrentLang(lang);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const setLocalLang = async lang => {
    try {
      await setCurrentLocalLangAsync(lang);
      setCurrentLang(lang);
    } catch (error) {
      console.log(error);
    }
  };

  const val = {localLang, currentLang, setLocalLang};

  const RENDER_APP = !loading ? children : null;

  return <Context.Provider value={val}>{RENDER_APP}</Context.Provider>;
};
