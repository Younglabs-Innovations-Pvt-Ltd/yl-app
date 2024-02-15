import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';

const ShowSnackbar = ({text}) => {
  const {textColors} = useSelector(state => state.appTheme);
  return Snackbar.show({
    text,
    textColor: textColors.textSecondary,
    duration: Snackbar.LENGTH_LONG,
  });
};

export default ShowSnackbar;
