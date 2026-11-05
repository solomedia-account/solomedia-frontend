import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - SoloMedia',
  description: 'Sign in to your SoloMedia account to access your dashboard, manage your articles, and engage with the African diaspora community.',
  openGraph: {
    title: 'Sign In - SoloMedia',
    description: 'Sign in to your SoloMedia account to access your dashboard, manage your articles, and engage with the African diaspora community.',
    url: 'https://solomedia.onrender.com/login',
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}