// src/hooks/useChoices.js
import { useEffect } from 'react';
import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.min.css';

const useChoices = (ref, options = {}) => {
  useEffect(() => {
    if (!ref?.current) return;

    const instance = new Choices(ref.current, {
      removeItemButton: true,
      shouldSort: false,
      ...options,
    });

    return () => {
      instance.destroy();
    };
  }, [ref, options]);
};

export default useChoices;
