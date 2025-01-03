import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/AppSidebar';
import { ThemeProvider } from '@/components/theme-provider';
import Topbar from '@/components/topbar/Topbar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Final Grade Calculator',
  description:
    'Calculator for what grade you need on an assignment to get a specific grade in a class.  Supports multiple classes, grading schemes that make use of buckets/weights for different types of assignments, dropping/drops for the lowest assignments per bucket, and simulating average performance on assignments.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          // disableTransitionOnChange
        >
          <SidebarProvider>
            <AppSidebar />

            <main className="w-full">
              <Topbar />
              {children}
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
