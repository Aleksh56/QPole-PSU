import React from 'react';
import {
  StyledButton,
  StyledDescription,
  StyledHeroWrapper,
  StyledInfoWrapper,
  StyledLeftColumn,
  StyledTypography,
} from './styled';
import CreatePoleIllustration from '@assets/createPole.svg';

const AppCreateFirstPole = ({ settings = {} }) => {
  const handleOpenCreatePoleModal = () => {};

  return (
    <StyledHeroWrapper>
      <StyledLeftColumn>
        <StyledTypography variant={'h4'}>{settings.title}</StyledTypography>
        <StyledInfoWrapper>
          <StyledDescription variant={'body1'}>
            {settings.description}
          </StyledDescription>
          <StyledButton onClick={handleOpenCreatePoleModal}>
            {settings.buttonCaption}
          </StyledButton>
        </StyledInfoWrapper>
      </StyledLeftColumn>
      <img src={CreatePoleIllustration} alt="Описание изображения" />
    </StyledHeroWrapper>
  );
};

export default AppCreateFirstPole;
