import './globals.css';

export const metadata = {
  title: 'IckyAI - Sales Intelligence',
  description: 'AI-powered sales coaching and pipeline management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
