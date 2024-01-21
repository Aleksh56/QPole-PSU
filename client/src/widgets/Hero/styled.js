import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

const heroBaseStyles = {
  display: 'grid',
  height: '100vh',
  maxWidth: Rem(1200),
  margin: '0 auto',
  padding: '0 15px',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'left',
};

const breakpoints = {
  medium: 1024,
};

export const StyledHeroContainer = styled(Box)(() => ({
  position: 'relative',
  height: '100vh',
  backgroundColor: 'rgba(172, 220, 255, 0.2)',
}));

export const StyledHero = styled(Box)(({ theme }) => ({
  ...heroBaseStyles,
  gridTemplateColumns: '1fr',
  paddingTop: Rem(60),
  [theme.breakpoints.up('sm')]: {
    paddingTop: Rem(120),
  },
  [theme.breakpoints.up('md')]: {
    ...heroBaseStyles,
    gridTemplateColumns: '1fr 1fr',
  },
}));

export const StyledHeroTextWrapper = styled(Box)(({ theme }) => ({
  justifySelf: 'center',
  maxWidth: Rem(650),
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    justifySelf: 'start',
    maxWidth: Rem(550),
    textAlign: 'left',
  },
}));

export const StyledHeroTextHeading = styled('h2')(({ theme }) => ({
  fontSize: Rem(45),
  lineHeight: Rem(45),
  marginBottom: Rem(15),
  [theme.breakpoints.up('sm')]: {
    fontSize: Rem(52),
    lineHeight: Rem(52),
    marginBottom: Rem(20),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: Rem(60),
    lineHeight: Rem(60),
    marginBottom: Rem(25),
  },
}));

export const StyledHeroTextSubHeading = styled('p')(() => ({
  fontSize: Rem(20),
  lineHeight: Rem(30),
  marginBottom: Rem(25),
  color: designTokens.colors.primaryBlack,
  opacity: '.7',
}));

export const StyledHeroImage = styled('img')(() => ({
  maxWidth: '100%',
  height: 'auto',
  justifySelf: 'end',
}));
