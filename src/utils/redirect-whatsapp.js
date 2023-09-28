export const getWhatsappRedirectUrl = text => {
  const phoneNumber = '+919289029696';
  let url = '';

  if (Platform.OS === 'android') {
    url = `whatsapp://send?phone=${phoneNumber}&text=${text}`;
  } else if (Platform.OS === 'ios') {
    url = `whatsapp://wa.me/${phoneNumber}&text=${text}`;
  }

  return url;
};
