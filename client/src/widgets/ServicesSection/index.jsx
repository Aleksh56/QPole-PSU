import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  StyledCardsWrapper,
  StyledSection,
  StyledSectionHeading,
} from './styled';
import { ServicesCardsData } from './data/ServicesCardsData';
import ServicesCard from '../../entities/ServicesCard';
import { v4 } from 'uuid';

const ServicesSection = () => {
  return (
    <StyledSection className="services">
      <StyledSectionHeading variant="h4">
        Какие задачи решает сервис ?
      </StyledSectionHeading>
      <StyledCardsWrapper>
        {ServicesCardsData.map((item) => {
          return (
            <ServicesCard
              key={v4()}
              caption={item.caption}
              buttons={item.buttons}
            />
          );
        })}
      </StyledCardsWrapper>
    </StyledSection>
  );
};

export default ServicesSection;
