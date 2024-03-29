import React from 'react';
import { StyledCardsWrapper, StyledSection, StyledSectionHeading } from './styled';
import ServicesCard from '../../06_Entities/ServicesCard';
import { v4 } from 'uuid';
import { servicesCardsData } from '@/data/fields';

const ServicesSection = () => {
  return (
    <StyledSection className="services">
      <StyledSectionHeading variant="h4">Какие задачи решает сервис ?</StyledSectionHeading>
      <StyledCardsWrapper>
        {servicesCardsData.map((item) => {
          return <ServicesCard key={v4()} caption={item.caption} buttons={item.buttons} />;
        })}
      </StyledCardsWrapper>
    </StyledSection>
  );
};

export default ServicesSection;
