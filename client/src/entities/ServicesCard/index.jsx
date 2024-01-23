import React from 'react';
import ServicesLabel from '../../shared/ServicesLabel';
import { StyledCard, StyledCardHeading, StyledLabelWrapper } from './styled';

const ServicesCard = ({ caption = '', buttons = [] }) => {
  return (
    <StyledCard>
      <img src="#" alt="" />
      <StyledCardHeading variant="h6">{caption}</StyledCardHeading>
      <StyledLabelWrapper>
        {buttons.map((btn) => {
          return <ServicesLabel caption={btn} />;
        })}
      </StyledLabelWrapper>
    </StyledCard>
  );
};

export default ServicesCard;
