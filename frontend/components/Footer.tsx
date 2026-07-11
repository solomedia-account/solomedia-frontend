import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-soloyellow/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.jpg"
                  alt="SoloMedia"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-2xl font-display font-bold text-white">
                SOLO<span className="text-soloyellow">MEDIA</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Your destination for African culture and diaspora stories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-soloyellow transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-soloyellow transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-soloyellow transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-soloyellow transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/category/fashion" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Fashion</Link></li>
              <li><Link href="/category/arts" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Arts</Link></li>
              <li><Link href="/category/music" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Music</Link></li>
              <li><Link href="/category/film" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Film</Link></li>
              <li><Link href="/category/technology" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Technology</Link></li>
              <li><Link href="/category/investor-dynamics" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Investor Dynamics</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Contact</Link></li>
              <li><Link href="/advertise" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Advertise</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-soloyellow transition-colors text-sm">Careers</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Stay updated with the latest stories from the diaspora.</p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
              />
              <button className="bg-soloyellow text-soloblack px-4 py-2 rounded-lg font-semibold hover:bg-soloyellow-dark transition-colors">
                <Mail size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; 2024 SoloMedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
