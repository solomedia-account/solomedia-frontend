'use client';

import { useState } from 'react';
import { Mail, MapPin, AlertCircle, ShoppingBag, FileText, Store, Send, MessageCircle } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with SoloMedia. Contact us for inquiries, partnerships, advertising, or any questions about our African diaspora content platform.',
  openGraph: {
    title: 'Contact SoloMedia',
    description: 'Get in touch with SoloMedia for inquiries, partnerships, and advertising.',
    url: 'https://solomedia.onrender.com/contact',
  },
};

const WHATSAPP_NUMBER = '+23408148525199';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-32 bg-mag-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mag-black via-mag-black-light to-mag-black opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-hero md:text-[clamp(3rem, 10vw, 6rem)] font-display font-bold text-mag-white mb-6 leading-tight animate-slide-up">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-mag-gray-light max-w-3xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              Do you have a question, comment, concern, suggestion or news tip to pass along to SoloMedia? Send us a message.
            </p>
          </div>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="py-8 bg-mag-accent">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-4 text-mag-white">
            <AlertCircle size={24} />
            <p className="font-display font-semibold text-center">
              We are currently experiencing a high volume in customer contacts. Our team is working hard to respond as quickly as possible. Thank you for your patience and understanding.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center mb-12">
              <div className="w-3 h-16 bg-mag-accent mr-6"></div>
              <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
                Send a Message
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-mag-white font-display font-bold mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-mag-black border-2 border-mag-gray-light/30 px-4 py-3 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body rounded-none"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-mag-white font-display font-bold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-mag-black border-2 border-mag-gray-light/30 px-4 py-3 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body rounded-none"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-mag-white font-display font-bold mb-2">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  className="w-full bg-mag-black border-2 border-mag-gray-light/30 px-4 py-3 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body rounded-none"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="block text-mag-white font-display font-bold mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full bg-mag-black border-2 border-mag-gray-light/30 px-4 py-3 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body rounded-none resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button type="submit" className="magazine-button w-full flex items-center justify-center space-x-3">
                <span>Send Message</span>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Contact Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="magazine-card p-8">
              <Mail size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">General Inquiries</h3>
              <p className="text-mag-gray mb-4">For general questions, comments, concerns, suggestions, or news tips.</p>
              <a href="mailto:solomonchi96@gmail.com" className="magazine-link text-sm">
                solomonchi96@gmail.com
              </a>
            </div>

            <div className="magazine-card p-8">
              <ShoppingBag size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Order Support</h3>
              <p className="text-mag-gray mb-4">For any order related questions, please contact our support team.</p>
              <span className="text-mag-accent font-display font-bold text-sm uppercase">Contact Support</span>
            </div>

            <div className="magazine-card p-8">
              <MapPin size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Our Location</h3>
              <p className="text-mag-gray mb-4">Visit our office or send mail to our address.</p>
              <p className="text-mag-white font-medium">Up Station, Bamenda, Cameroon</p>
            </div>

            <div className="magazine-card p-8">
              <MessageCircle size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">WhatsApp</h3>
              <p className="text-mag-gray mb-4">For quick responses and direct communication.</p>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="magazine-link text-sm"
              >
                {WHATSAPP_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Special Contact Categories */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Special Inquiries
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="magazine-card p-8">
              <AlertCircle size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Talent Verification</h3>
              <p className="text-mag-gray">
                If you are a photographer/model/stylist and have been unexpectedly solicited to work for SoloMedia, please verify the credentials of the hiring individual or company by contacting us.
              </p>
            </div>

            <div className="magazine-card p-8">
              <FileText size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Data Access Rights</h3>
              <p className="text-mag-gray">
                All Digital Subject Access Rights Request should be filed through our official request process.
              </p>
            </div>

            <div className="magazine-card p-8">
              <Store size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Seller Relations</h3>
              <p className="text-mag-gray">
                Any Seller/Brand related questions can be sent to our Seller Relations Team.
              </p>
            </div>

            <div className="magazine-card p-8">
              <Store size={40} className="text-mag-accent mb-4" />
              <h3 className="text-xl font-display font-bold text-mag-white mb-3">Exhibitors</h3>
              <p className="text-mag-gray mb-4">
                SoloMedia exhibitors or those who want to exhibit at SoloMedia can contact us directly.
              </p>
              <a href="mailto:solomonchi96@gmail.com" className="magazine-link text-sm">
                solomonchi96@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
