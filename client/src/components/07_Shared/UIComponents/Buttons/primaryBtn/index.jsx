import { Link } from 'react-router-dom';

import { StyledButton } from './styled';

const PrimaryButton = ({
  caption = '',
  handleClick = () => {},
  to,
  disabled = false,
  ...linkProps
}) => {
  const buttonElement = to ? (
    <Link to={to} {...linkProps}>
      <StyledButton onClick={handleClick}>{caption}</StyledButton>
    </Link>
  ) : (
    <StyledButton onClick={handleClick} disabled={disabled}>
      {caption}
    </StyledButton>
  );

  return buttonElement;
};

export default PrimaryButton;
