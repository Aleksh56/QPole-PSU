import React from 'react';
import AuthIllustrationImage from '@assets/loginIllustration.svg';
import { IllustrationGridWrapper } from './styled';
import { Link } from 'react-router-dom';

const AuthIllustration = () => {
  return (
    <IllustrationGridWrapper item>
      <Link to="/">QPole</Link>
      <img src={AuthIllustrationImage} alt="Illustration" />
    </IllustrationGridWrapper>
  );
};

export default AuthIllustration;
