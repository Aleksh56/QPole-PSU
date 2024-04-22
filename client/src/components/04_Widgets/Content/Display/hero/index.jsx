import React from 'react';
import Header from '../../../Navigation/Menus/mainHeader';
import SecondaryButton from '@/components/07_Shared/UIComponents/Buttons/secBtn';
import {
  StyledHero,
  StyledHeroContainer,
  StyledHeroImage,
  StyledHeroTextHeading,
  StyledHeroTextSubHeading,
  StyledHeroTextWrapper,
} from './styled';
import SurveyImage from '@assets/survey.svg';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, useTheme } from '@mui/material';

const Hero = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <Header />
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
  );
};

export default Hero;
