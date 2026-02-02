import { Metadata } from 'next';
import './globals.css';

export const metadata = {
  title: 'IckyAI.net - Sales Organization Platform',
  description: 'Cloud-synced sales organization web app with real-time pipeline tracking and smart follow-up reminders',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
