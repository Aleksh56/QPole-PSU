import React from 'react';
import { Button } from '@mui/material';
import { StyledNavLink } from './styled';
import { useParams } from 'react-router-dom';

const PoleSettingsMenuButton = ({ icon, label, page }) => {
  const { id } = useParams();
  return (
    <StyledNavLink end to={`/app/tests/${id}/${page}`}>
      <Button component="div" style={{ justifyContent: 'flex-start' }}>
        {label}
      </Button>
    </StyledNavLink>
  );
};

export default PoleSettingsMenuButton;
