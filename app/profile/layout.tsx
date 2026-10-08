import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile - SoloMedia',
  description: 'Manage your SoloMedia profile, update your personal information, and customize your public profile settings.',
  openGraph: {
    title: 'My Profile - SoloMedia',
    description: 'Manage your SoloMedia profile, update your personal information, and customize your public profile settings.',
    url: 'https://solomedia.onrender.com/profile',
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}