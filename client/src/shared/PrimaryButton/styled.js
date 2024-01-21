import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const StyledButton = styled('button')(() => ({
  fontSize: Rem(16),
  backgroundColor: 'transparent',
  color: designTokens.colors.primaryBlue,
  border: `${Rem(1)} solid ${designTokens.colors.primaryBlue}`,
  padding: `${Rem(10)} ${Rem(24)}`,
  borderRadius: designTokens.borderRadius.buttonBorder,
  cursor: 'pointer',
}));
