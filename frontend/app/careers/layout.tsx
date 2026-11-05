import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | SoloMedia Network',
  description: 'Join SoloMedia Network and be part of Africa\'s story. We\'re looking for passionate storytellers, innovators, and visionaries to help us bridge the gap between Africa and the diaspora. Build a career that matters.',
  openGraph: {
    title: 'Careers | SoloMedia Network',
    description: 'Join SoloMedia Network and be part of Africa\'s story. We\'re looking for passionate storytellers and innovators.',
    url: 'https://solomedianet.com/careers',
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}