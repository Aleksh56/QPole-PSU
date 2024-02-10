import { useState, useCallback } from 'react';

const useModalState = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const openModal = () => setIsOpen(true);

  const toggleModal = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

  return { isOpen, toggleModal, openModal };
};

export default useModalState;
