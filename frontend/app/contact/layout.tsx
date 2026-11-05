import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | SoloMedia Network',
  description: 'Connect with SoloMedia Network - your bridge to African stories and diaspora connections. Whether you have questions, partnership ideas, or want to share your story, we\'re here to listen. Reach out and let\'s build something meaningful together.',
  openGraph: {
    title: 'Contact Us | SoloMedia Network',
    description: 'Connect with SoloMedia Network - your bridge to African stories and diaspora connections.',
    url: 'https://solomedianet.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}