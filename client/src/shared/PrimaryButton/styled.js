import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';
import { colorConfig } from '@/app/template/config/color.config';

export const StyledButton = styled('button')(() => ({
  fontSize: Rem(16),
  backgroundColor: 'transparent',
  color: colorConfig.primaryBlue,
  border: `${Rem(1)} solid ${colorConfig.primaryBlue}`,
  padding: `${Rem(10)} ${Rem(24)}`,
  borderRadius: designTokens.borderRadius.buttonBorder,
  cursor: 'pointer',
}));
