import React from 'react';
import {
  StyledDescription,
  StyledHeroWrapper,
  StyledInfoWrapper,
  StyledLeftColumn,
  StyledTypography,
} from './styled';
import PollResultsSVG from '@assets/Analytics.svg';

const NoResultsPoll = () => {
  const settings = {
    title: 'Результатов еще нет',
    description: 'Результаты появятся после первого прохождения опроса',
  };
  return (
    <StyledHeroWrapper>
      <StyledLeftColumn>
        <StyledTypography variant={'h4'}>{settings.title}</StyledTypography>
        <StyledInfoWrapper>
          <StyledDescription variant={'body1'}>{settings.description}</StyledDescription>
        </StyledInfoWrapper>
      </StyledLeftColumn>
      <img src={PollResultsSVG} alt="Описание изображения" />
    </StyledHeroWrapper>
  );
};

export default NoResultsPoll;
