import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from '@/hooks/useSession';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}

interface ProviderProps {
  children: React.ReactNode;
}

export const Provider: React.FC<ProviderProps> = ({ children }) => (
  <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
    <SessionProvider>
      <NextUIProvider>
        <div className="bg-[#f0f0f0] dark:bg-[#0f0f0f]">{children}</div>
      </NextUIProvider>
      <Toaster />
    </SessionProvider>
  </ThemeProvider>
);
