import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, Pressable, Image} from 'react-native';
import Spinner from './spinner.component';
import Input from './input.component';
import TextWrapper from './text-wrapper.component';

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all';

const BottomModal = ({open, onSelect}) => {
  const [loading, setLoading] = useState(false);
  const [countriesData, setCountriesData] = useState([]);
  const [updatedData, setUpdatedData] = useState(countriesData);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!open) return;
    const getCountriesData = async () => {
      if (countriesData.length > 0) return;

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

        setCountriesData(countries);
        setLoading(false);
      } catch (error) {
        console.log('countries data error', error);
      }
    };

    getCountriesData();
  }, [open]);

  useEffect(() => {
    const filteredCountry = countriesData.filter(counrty =>
      counrty.name.official.toLowerCase().includes(search.toLowerCase()),
    );
    setUpdatedData(filteredCountry);
  }, [search, countriesData]);

  return (
    <View>
      <View style={{flex: 1}}>
        <Input
          placeholder="Search..."
          noBorder={true}
          value={search}
          onChangeText={e => setSearch(e)}
        />
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
                <TextWrapper>{item.name.common}</TextWrapper>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

export default BottomModal;

const styles = StyleSheet.create({
  flag: {
    width: 24,
    height: 24,
  },
  listItem: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
  },
});
