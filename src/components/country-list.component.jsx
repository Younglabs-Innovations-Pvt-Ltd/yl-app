import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Pressable,
  Image,
  TextInput,
} from 'react-native';
import TextWrapper from './text-wrapper.component';
import {COLORS, FONTS} from '../assets/theme/theme';
import Spinner from './spinner.component';

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all';

const CountryList = ({visible, onChangeVisible, onSelect}) => {
  if (!visible) return null;
  const [countryData, setCountryData] = useState([]);
  const [updatedData, setUpdatedData] = useState(countryData);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const countriesData = async () => {
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
  }, []);

  useEffect(() => {
    const filteredCountry = countryData.filter(counrty =>
      counrty.name.official.toLowerCase().includes(search.toLowerCase()),
    );
    setUpdatedData(filteredCountry);
  }, [search, countryData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search"
          style={styles.search}
          selectionColor={COLORS.black}
          placeholderTextColor={COLORS.black}
          value={search}
          onChangeText={e => setSearch(e)}
        />
        <Pressable
          style={styles.btnClose}
          onPress={() => onChangeVisible(false)}>
          <TextWrapper color={COLORS.black} fw="600">
            Close
          </TextWrapper>
        </Pressable>
      </View>

      {loading && <Spinner style={{alignSelf: 'center'}} />}

      <FlatList
        data={updatedData}
        keyExtractor={country => country.name.official}
        renderItem={({item}) => {
          return (
            <Pressable
              key={item.name.official}
              style={({pressed}) => [
                styles.listItem,
                pressed && {backgroundColor: '#eee'},
              ]}
              onPress={() => onSelect(item)}>
              <Image source={{uri: item.flags.png}} style={styles.flag} />
              <TextWrapper>{item.name.official}</TextWrapper>
            </Pressable>
          );
        }}
      />
    </View>
  );
};

export default CountryList;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    zIndex: 1000,
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
    gap: 6,
    justifyContent: 'center',
    borderColor: 'red',
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
});
