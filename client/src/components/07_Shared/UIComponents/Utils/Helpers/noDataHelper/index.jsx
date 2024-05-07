import {
  StyledButton,
  StyledDescription,
  StyledHeroWrapper,
  StyledInfoWrapper,
  StyledLeftColumn,
  StyledTypography,
} from './styled';

const NoDataHelper = ({
  title = '',
  description,
  btnCaption = '',
  handler = () => {},
  image = '',
}) => {
  return (
    <StyledHeroWrapper>
      <StyledLeftColumn>
        <StyledTypography variant={'h4'}>{title}</StyledTypography>
        <StyledInfoWrapper>
          {description && <StyledDescription variant={'body1'}>{description}</StyledDescription>}
          {btnCaption && <StyledButton onClick={() => handler(true)}>{btnCaption}</StyledButton>}
        </StyledInfoWrapper>
      </StyledLeftColumn>
      <img src={image} alt={`${image}`} />
    </StyledHeroWrapper>
  );
};

export default NoDataHelper;
