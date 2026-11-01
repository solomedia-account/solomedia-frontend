import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise - SoloMedia',
  description: 'Advertise with SoloMedia and reach Africa\'s most influential decision-makers in the diaspora. Connect with high-capacity investors, entrepreneurs, and professionals.',
  openGraph: {
    title: 'Advertise with SoloMedia',
    description: 'Put your brand in front of Africa\'s most influential decision-makers in the diaspora.',
    url: 'https://solomedia.onrender.com/advertise',
  },
};

export default function AdvertiseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}