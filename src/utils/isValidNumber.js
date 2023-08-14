import libphonenumber from 'google-libphonenumber';

export const isValidNumber = (phone, countryCode) => {
  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

  try {
    const parsedNumber = phoneUtil.parse(phone, countryCode);
    return phoneUtil.isValidNumber(parsedNumber);
  } catch (error) {
    console.log('valid number error', error);
    return false;
  }
};
