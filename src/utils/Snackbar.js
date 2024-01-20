import Snackbar from 'react-native-snackbar';
import { useSelector } from 'react-redux';

const ShowSnackbar = ({text, action}) => {
  const {textColors} = useSelector(state => state.appTheme);
  Snackbar.show({
    text,
    textColor: textColors.textSecondary,
    duration: Snackbar.LENGTH_LONG,
  });
};

export default ShowSnackbar;
