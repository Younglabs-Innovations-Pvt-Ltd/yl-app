export const Showtoast = ({text, toast, type, placement, duration}) => {
  const prop = {
    type: type || 'normal',
    placement: placement || 'top',
    duration: duration || 4000,
    offset: 60,
    offsetBottom:80,
    animationType: 'slide-in',
  };
  toast.hideAll()
  toast.show(text, prop);
};
