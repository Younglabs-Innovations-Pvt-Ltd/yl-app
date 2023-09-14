import React, {useState, useEffect} from 'react';
import {StyleSheet, View, FlatList, Pressable, Image} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS} from '../utils/constants/colors';
import {FONTS} from '../utils/constants/fonts';
import Spinner from './spinner.component';
import Modal from './modal.component';
import Input from './input.component';
import Icon from './icon.component';

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all';

const CountryList = ({visible, onClose, onSelect}) => {
  const [countryData, setCountryData] = useState([]);
  const [updatedData, setUpdatedData] = useState(countryData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const countriesData = async () => {
      if (countryData.length > 0) return;
      try {
        setLoading(true);
        const response = await fetch(COUNTRIES_URL, {
          method: 'GET',
        });
        const data = await response.json();

        const countries = data.map(country => {
          return {
            name: country.name,
            flags: country.flags,
            callingCode: country.idd,
            countryCode: {
              cca2: country.cca2,
              cca3: country.cca3,
            },
          };
        });

        setCountryData(countries);
        setLoading(false);
      } catch (error) {
        console.log('countries data error', error);
      }
    };

    countriesData();
  }, [visible, countryData]);

  useEffect(() => {
    const filteredCountry = countryData.filter(counrty =>
      counrty.name.official.toLowerCase().includes(search.toLowerCase()),
    );
    setUpdatedData(filteredCountry);
  }, [search, countryData]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TextWrapper fs={18}>Select country</TextWrapper>
          <Pressable style={styles.btnClose} onPress={onClose}>
            <Icon name="close-outline" color={COLORS.black} size={24} />
          </Pressable>
        </View>
        <Input
          placeholder="Search..."
          style={styles.search}
          value={search}
          onChangeText={e => setSearch(e)}
          noBorder={true}
        />
        {loading && <Spinner style={{alignSelf: 'center'}} />}

        <FlatList
          data={updatedData}
          keyExtractor={country => country.name.official}
          renderItem={({item}) => (
            <CountryItem item={item} onSelect={onSelect} />
          )}
        />
      </View>
    </Modal>
  );
};

const CountryItem = ({item, onSelect}) => {
  const handleOnSelect = () => onSelect(item);

  return (
    <Pressable
      key={item.name.official}
      style={({pressed}) => [
        styles.listItem,
        pressed && {backgroundColor: '#eee'},
      ]}
      onPress={handleOnSelect}>
      <Image source={{uri: item.flags.png}} style={styles.flag} />
      <TextWrapper>{item.name.common}</TextWrapper>
    </Pressable>
  );
};

export default CountryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
  },
  listItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
  flag: {
    width: 24,
    height: 24,
  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  btnClose: {
    padding: 4,
    justifyContent: 'center',
  },
  search: {
    flex: 1,
    color: COLORS.black,
    fontFamily: FONTS.roboto,
  },
  btnClose: {
    width: 36,
    height: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
});
