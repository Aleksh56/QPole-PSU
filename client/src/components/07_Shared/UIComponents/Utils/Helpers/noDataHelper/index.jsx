import React from 'react';
import {
  StyledDescription,
  StyledHeroWrapper,
  StyledInfoWrapper,
  StyledLeftColumn,
  StyledButton,
  StyledTypography,
} from './styled';

const NoDataHelper = ({
  title = '',
  description,
  btnCaption = '',
  handler = () => {},
  image = '',
}) => {
  return (
    <StyledHeroWrapper>
      <StyledLeftColumn>
        <StyledTypography variant={'h4'}>{title}</StyledTypography>
        <StyledInfoWrapper>
          {description && <StyledDescription variant={'body1'}>{description}</StyledDescription>}
          {btnCaption && <StyledButton onClick={() => handler(true)}>{btnCaption}</StyledButton>}
        </StyledInfoWrapper>
      </StyledLeftColumn>
      <img src={image} alt={`${image} - image`} />
    </StyledHeroWrapper>
  );
};

export default NoDataHelper;
