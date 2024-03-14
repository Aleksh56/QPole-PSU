import React from 'react';
import Header from '../Header';
import SecondaryButton from '@/shared/SecondaryButton';
import {
  StyledHero,
  StyledHeroContainer,
  StyledHeroImage,
  StyledHeroTextHeading,
  StyledHeroTextSubHeading,
  StyledHeroTextWrapper,
} from './styled';
import { ThemeProvider, useTheme } from '@mui/material';
import SurveyImage from '@assets/survey.svg';

const Hero = () => {
  const muiTheme = useTheme();
  return (
    <>
      <Header />
      <ThemeProvider theme={muiTheme}>
        <StyledHeroContainer>
          <StyledHero>
            <StyledHeroTextWrapper>
              <StyledHeroTextHeading>
                Конструктор
                <br />
                опросов и анкет
              </StyledHeroTextHeading>
              <StyledHeroTextSubHeading>
                Бесплатно соберите ответы коллег, клиентов или потенциальной аудитории всего за пару
                кликов!
              </StyledHeroTextSubHeading>
              <SecondaryButton caption="Создать бесплатно" />
            </StyledHeroTextWrapper>
            <StyledHeroImage src={SurveyImage} alt="Hero Image" />
          </StyledHero>
        </StyledHeroContainer>
      </ThemeProvider>
    </>
  );
};

export default Hero;
