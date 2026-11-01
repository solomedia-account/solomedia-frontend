import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers - SoloMedia',
  description: 'Join the SoloMedia team and help shape narratives that connect Africa to the world. We are hiring creative professionals across media, tech, and business roles.',
  openGraph: {
    title: 'Careers - SoloMedia',
    description: 'Join the SoloMedia team and help shape narratives that connect Africa to the world.',
    url: 'https://solomedia.onrender.com/careers',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}