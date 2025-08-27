"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";

function ColorSchemeSync() {
  const { theme, resolvedTheme } = useTheme();
  useEffect(() => {
    const t = (theme ?? resolvedTheme) === "dark" ? "dark" : "light";
    document.documentElement.style.colorScheme = t;
  }, [theme, resolvedTheme]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ColorSchemeSync />
    </ThemeProvider>
  );
}
