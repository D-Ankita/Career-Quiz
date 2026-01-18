import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Career Discovery Game | Find Your Path',
  description: 'A fun, gamified quiz to help 10th graders discover their ideal 11th stream and career path',
  keywords: ['career', 'quiz', 'stream selection', 'JEE', 'NEET', 'education', 'India'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-pattern min-h-screen safe-bottom">
        {children}
      </body>
    </html>
  );
}
