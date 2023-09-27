import React, {useState} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';
import {i18nContext} from '../context/lang.context';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import Modal from './modal.component';

const languages = {
  'en-IN': 'en',
  hi: 'hi',
};

const LanguageSelection = () => {
  const {currentLang, setLocalLang} = i18nContext();
  const [open, setOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState({top: 0});

  const onLayout = e => {
    const {height, y} = e.nativeEvent.layout;
    setSelectedPosition({top: height + y, right: 16});
  };

  const selectedLanguage = languages[currentLang];

  const updateCurrentLanguage = lan => {
    setLocalLang(lan);
    handleOpen();
  };

  const handleOpen = () => setOpen(p => !p);

  return (
    <View>
      <View style={styles.buttonWrapper}>
        <Pressable
          style={styles.langButton}
          onLayout={onLayout}
          onPress={handleOpen}>
          <TextWrapper>{selectedLanguage}</TextWrapper>
        </Pressable>
        <Modal visible={open} onRequestClose={handleOpen}>
          <Pressable style={styles.modalContainer} onPress={handleOpen}>
            <View style={[styles.select, selectedPosition]}>
              <Pressable
                style={[
                  styles.btnSelectLang,
                  {
                    backgroundColor:
                      selectedLanguage === 'en' ? '#eee' : 'transparent',
                  },
                ]}
                onPress={() => updateCurrentLanguage('en-IN')}>
                <TextWrapper>English</TextWrapper>
              </Pressable>
              <Pressable
                style={[
                  styles.btnSelectLang,
                  {
                    backgroundColor:
                      selectedLanguage === 'hi' ? '#eee' : 'transparent',
                  },
                ]}
                onPress={() => updateCurrentLanguage('hi')}>
                <TextWrapper>Hindi</TextWrapper>
              </Pressable>
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

export default LanguageSelection;

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingVertical: 16,
    paddingRight: 16,
    alignItems: 'flex-end',
  },
  langButton: {
    width: 36,
    height: 36,
    borderRadius: 36,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  select: {
    minWidth: 120,
    maxHeight: 248,
    position: 'absolute',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  btnSelectLang: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
});
