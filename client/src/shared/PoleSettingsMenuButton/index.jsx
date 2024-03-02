import React from 'react';
import { Button } from '@mui/material';
import { StyledButton, StyledNavLink } from './styled';
import { useParams } from 'react-router-dom';

const PoleSettingsMenuButton = ({ icon: Icon, label, page, disabled }) => {
  const { id } = useParams();
  return (
    <StyledNavLink
      end
      to={`/app/tests/${id}/${page}`}
      className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
      isDisabled={disabled}
    >
      <StyledButton
        startIcon={<Icon />}
        component="div"
        style={{ justifyContent: 'flex-start' }}
        disabled={disabled}
        isDisabled={disabled}
      >
        {label}
      </StyledButton>
    </StyledNavLink>
  );
};

export default PoleSettingsMenuButton;
