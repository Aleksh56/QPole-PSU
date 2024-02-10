import React from 'react';
import { IOSSwitch } from './styled';

const CustomSwitch = ({ focusVisibleClassName }) => {
  return (
    <IOSSwitch
      focusVisibleClassName={focusVisibleClassName}
      disableRipple
      sx={{ m: 1 }}
    />
  );
};

export default CustomSwitch;
