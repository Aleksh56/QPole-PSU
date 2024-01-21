import React, { useState } from 'react';
import styled from 'styled-components';

const StyledBurgerMenu = styled.div`
  cursor: pointer;
`;

const BurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <StyledBurgerMenu onClick={handleToggleMenu}>
        Burger Menu
      </StyledBurgerMenu>
    </>
  );
};

export default BurgerMenu;
