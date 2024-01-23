import React from 'react';
import {
  StyledButton,
  StyledDescription,
  StyledHeroWrapper,
  StyledInfoWrapper,
  StyledLeftColumn,
  StyledTypography,
} from './styled';
import CreatePoleIllustration from '@assets/createPole.svg';
import CreatePoleModal from '@/widgets/CreatePoleModal';

const AppCreateFirstPole = ({ settings = {} }) => {
  const handleOpenCreatePoleModal = () => {};

  const yourData = {
    buttons: [
      {
        image: 'путь_к_изображению_1',
        title: 'Тест викторина',
        caption:
          'Есть правильные и неправильные ответы. Считается кол-во баллов',
      },
      {
        image: 'путь_к_изображению_2',
        title: 'Личностный тест',
        caption:
          'Нет правильных ответов. Результаты привязываются к вариантам ответов',
      },
      {
        image: 'путь_к_изображению_3',
        title: 'Квиз опросник',
        caption:
          'Возможность ветвления и начисление баллов за определенные ответы',
      },
    ],
  };

  return (
    <StyledHeroWrapper>
      {/* <CreatePoleModal
        isOpen={true}
        onClose={() => {}}
        title={'Выберите тип создаваемого опроса'}
        buttons={yourData.buttons}
      /> */}
      <StyledLeftColumn>
        <StyledTypography variant={'h4'}>{settings.title}</StyledTypography>
        <StyledInfoWrapper>
          <StyledDescription variant={'body1'}>
            {settings.description}
          </StyledDescription>
          <StyledButton onClick={handleOpenCreatePoleModal}>
            {settings.buttonCaption}
          </StyledButton>
        </StyledInfoWrapper>
      </StyledLeftColumn>
      <img src={CreatePoleIllustration} alt="Описание изображения" />
    </StyledHeroWrapper>
  );
};

export default AppCreateFirstPole;
