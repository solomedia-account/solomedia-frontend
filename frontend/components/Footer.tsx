import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-mag-black border-t border-mag-accent/30">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src="/logo.jpg"
                  alt="SoloMedia"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-display font-bold text-mag-white tracking-tight">
                SOLO<span className="text-mag-accent">MEDIA</span>
              </span>
            </div>
            <p className="text-mag-gray text-base">
              Your destination for African culture and diaspora stories.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://web.facebook.com/solomediacm/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-mag-gray hover:text-mag-accent transition-colors hover:scale-110 transform duration-300"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="https://www.tiktok.com/@solomagofficial" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-mag-gray hover:text-mag-accent transition-colors hover:scale-110 transform duration-300"
                aria-label="TikTok"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.linkedin.com/company/solomedia-africa/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-mag-gray hover:text-mag-accent transition-colors hover:scale-110 transform duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a 
                href="https://instagram.com/solomedia_network/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-mag-gray hover:text-mag-accent transition-colors hover:scale-110 transform duration-300"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://wa.me/23408148525199" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-mag-gray hover:text-mag-accent transition-colors hover:scale-110 transform duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-mag-white font-display font-bold text-lg mb-6 uppercase tracking-wider">Categories</h3>
            <ul className="space-y-3">
              <li><Link href="/category/fashion" className="magazine-link text-sm">Fashion</Link></li>
              <li><Link href="/category/arts" className="magazine-link text-sm">Arts</Link></li>
              <li><Link href="/category/music" className="magazine-link text-sm">Music</Link></li>
              <li><Link href="/category/film" className="magazine-link text-sm">Film</Link></li>
              <li><Link href="/category/technology" className="magazine-link text-sm">Technology</Link></li>
              <li><Link href="/category/investor-dynamics" className="magazine-link text-sm">Investor Dynamics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-mag-white font-display font-bold text-lg mb-6 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="magazine-link text-sm">About Us</Link></li>
              <li><Link href="/contact" className="magazine-link text-sm">Contact</Link></li>
              <li><Link href="/advertise" className="magazine-link text-sm">Advertise</Link></li>
              <li><Link href="/careers" className="magazine-link text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-mag-white font-display font-bold text-lg mb-6 uppercase tracking-wider">Newsletter</h3>
            <p className="text-mag-gray text-base mb-6">Stay updated with the latest stories from the diaspora.</p>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-mag-black-light border-2 border-mag-gray-light/30 rounded-none px-4 py-3 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body"
              />
              <button className="magazine-button px-4 py-3">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-mag-gray-light/20 mt-12 pt-8 text-center text-mag-gray text-sm">
          <p>&copy; 2024 SoloMedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
