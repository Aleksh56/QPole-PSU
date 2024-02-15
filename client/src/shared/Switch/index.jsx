import React from 'react';
import { IOSSwitch } from './styled';

const CustomSwitch = ({ focusVisibleClassName, onChange = () => {} }) => {
  return (
    <IOSSwitch
      focusVisibleClassName={focusVisibleClassName}
      disableRipple
      onChange={onChange}
      sx={{ m: 1 }}
    />
  );
};

export default CustomSwitch;
