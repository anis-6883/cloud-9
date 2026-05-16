"use client";

import { SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { LuSunMoon } from "react-icons/lu";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (theme === "light") {
    return <SunIcon className='size-6 cursor-pointer' onClick={() => setTheme("dark")} />;
  } else {
    return <LuSunMoon className='size-6 cursor-pointer dark:text-white' onClick={() => setTheme("light")} />;
  }
}
