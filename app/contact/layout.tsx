import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - SoloMedia',
  description: 'Get in touch with SoloMedia for general inquiries, support, talent verification, and special requests. We are here to help.',
  openGraph: {
    title: 'Contact Us - SoloMedia',
    description: 'Get in touch with SoloMedia for general inquiries, support, talent verification, and special requests. We are here to help.',
    url: 'https://solomedia.onrender.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}