import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export const useColorSchemeListener = () => {
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  const handleAppearanceChange = ({ colorScheme }) => {
    setColorScheme(colorScheme);
  };

  useEffect(() => {
    const listener = Appearance.addChangeListener(handleAppearanceChange);

    return () => {
        listener.remove();
    };
  }, []);

  return colorScheme;
};