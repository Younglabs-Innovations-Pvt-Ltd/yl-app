import React, {useState, useEffect, createContext, useContext} from 'react';
import LocalizedStrings from 'react-native-localization';
import {localizedStrings} from '../localization';
import {localStorage} from '../utils/storage/storage-provider';
import {LOCAL_KEYS} from '../utils/storage/local-storage-keys';

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
      // const lang = await getCurrentLocalLangAsync();
      const lang = localStorage.getString(LOCAL_KEYS.LANGUAGE_KEY);
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
      localStorage.set(LOCAL_KEYS.LANGUAGE_KEY, lang);
      setCurrentLang(lang);
    } catch (error) {
      console.log(error);
    }
  };

  const val = {localLang, currentLang, setLocalLang};

  const RENDER_APP = !loading ? children : null;

  return <Context.Provider value={val}>{RENDER_APP}</Context.Provider>;
};
