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
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const muiTheme = useTheme();
  const { t } = useTranslation();
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
              <SecondaryButton caption={t('button.createForFree')} />
            </StyledHeroTextWrapper>
            <StyledHeroImage src={SurveyImage} alt="Hero Image" />
          </StyledHero>
        </StyledHeroContainer>
      </ThemeProvider>
    </>
  );
};

export default Hero;
