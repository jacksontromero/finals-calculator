'use client';

import { SidebarTrigger } from './ui/sidebar';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Topbar() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  function toggleTheme() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <></>;
  }

  return (
    <div className="flex flex-row justify-between">
      <SidebarTrigger />
      <Button variant="ghost" size="icon" onClick={() => toggleTheme()}>
        {resolvedTheme === 'light' ? (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
        )}
      </Button>
    </div>
  );
}
