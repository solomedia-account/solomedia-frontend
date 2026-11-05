import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - SoloMedia',
  description: 'Join SoloMedia community to share your stories, connect with the African diaspora, and contribute to our growing platform.',
  openGraph: {
    title: 'Create Account - SoloMedia',
    description: 'Join SoloMedia community to share your stories, connect with the African diaspora, and contribute to our growing platform.',
    url: 'https://solomedia.onrender.com/register',
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}