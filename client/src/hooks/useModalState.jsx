import { useState, useCallback } from 'react';

const useModalState = (defaultValue = false) => {
  const [isOpen, setIsOpen] = useState(defaultValue);

  const toggleModal = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

  return { isOpen, toggleModal };
};

export default useModalState;
