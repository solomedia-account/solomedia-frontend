import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - SoloMedia',
  description: 'Access your SoloMedia dashboard to manage your articles, view analytics, and control your account settings.',
  openGraph: {
    title: 'Dashboard - SoloMedia',
    description: 'Access your SoloMedia dashboard to manage your articles, view analytics, and control your account settings.',
    url: 'https://solomedia.onrender.com/dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}