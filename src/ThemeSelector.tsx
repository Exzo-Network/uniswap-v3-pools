import React, { useMemo, useState } from 'react';

import { useAppSettings } from './AppSettingsProvider';
import SunIcon from './icons/Sun';
import MoonIcon from './icons/Moon';
import Menu from './ui/Menu/Menu';
import SystemIcon from './icons/SystemIcon';
import classNames from 'classnames';

interface ThemeSelectorProps {
  className?: string;
}

function ThemeSelector({ className }: ThemeSelectorProps) {
  const { theme, setTheme } = useAppSettings();
  const [selectorExpanded, setSelectorExpanded] = useState(false);

  const computedTheme = useMemo(() => {
    if (theme === '') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
  }, [theme]);

  const handleSelection = (val: string) => {
    setTheme(val);
    setSelectorExpanded(false);
  };

  return (
    <div
      className={classNames(
        'p-3 rounded-md border relative border-element-10 text-high flex flex-shrink-0',
        className,
      )}
    >
      <button
        className="flex items-center focus:outline-none"
        onClick={() => setSelectorExpanded(!selectorExpanded)}
      >
        {computedTheme === 'light' ? <SunIcon /> : <MoonIcon />}
      </button>

      {selectorExpanded && (
        <Menu onClose={() => setSelectorExpanded(false)} className="top-12 left-0 w-32 shadow-lg">
          <button
            className="flex items-center justify-between w-24 my-1"
            onClick={() => handleSelection('light')}
          >
            <SunIcon />
            <span className="ml-2 w-4/5 text-left">Light</span>
          </button>
          <button
            className="flex items-center justify-between w-24 my-1"
            onClick={() => handleSelection('dark')}
          >
            <MoonIcon />
            <span className="ml-2 w-4/5 text-left">Dark</span>
          </button>
          <button
            className="flex items-center justify-between w-24 my-1"
            onClick={() => handleSelection('')}
          >
            <SystemIcon />
            <span className="ml-2 w-4/5 text-left">System</span>
          </button>
        </Menu>
      )}
    </div>
  );
}

export default ThemeSelector;
