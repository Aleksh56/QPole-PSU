import styled from '@emotion/styled';
import { Rem } from '@/utils/convertToRem';
import { designTokens } from '@/constants/designTokens';

export const StyledButton = styled('button')(() => ({
  fontSize: Rem(16),
  backgroundColor: designTokens.colors.primaryBlue,
  color: '#fff',
  border: 'none',
  padding: `${Rem(16)} ${Rem(30)}`,
  borderRadius: designTokens.borderRadius.buttonBorder,
  cursor: 'pointer',
}));
