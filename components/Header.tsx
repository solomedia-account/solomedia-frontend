'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Bell, LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, memo } from 'react';
import CategoryDropdown from './CategoryDropdown';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Film', slug: 'film' },
  { id: 2, name: 'Technology', slug: 'technology' },
  { id: 3, name: 'Investor Relations', slug: 'investor-relations' },
];

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>(FALLBACK_CATEGORIES);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/categories').then(setCategories).catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-soloblack/95 backdrop-blur-sm border-b border-soloyellow/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.jpg"
                alt="SoloMedia"
                fill
                className="object-contain"
                sizes="40px"
                priority
              />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              SOLO<span className="text-soloyellow">MEDIA</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(String(category.id))}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link href={`/category/${category.slug}`} className="text-gray-300 hover:text-soloyellow transition-colors block">
                  {category.name}
                </Link>
                {hoveredCategory === String(category.id) && (
                  <CategoryDropdown categoryId={String(category.id)} isOpen onClose={() => setHoveredCategory(null)} />
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-300 hover:text-soloyellow transition-colors" 
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="p-2 text-gray-300 hover:text-soloyellow transition-colors relative" aria-label="Notifications">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-soloyellow rounded-full"></span>
                </Link>
                <div className="hidden md:flex items-center space-x-3">
                  <Link href="/dashboard" className="text-gray-300 hover:text-soloyellow transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-300 hover:text-soloyellow transition-colors">
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-gray-300 hover:text-soloyellow transition-colors"
                    aria-label="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="hidden md:flex items-center space-x-2 bg-soloyellow text-soloblack px-4 py-2 rounded-lg font-semibold hover:bg-soloyellow-dark transition-colors">
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}
            
            <button className="md:hidden p-2 text-gray-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-gray-800 py-4">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
                  autoFocus
                />
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="text-gray-300 hover:text-soloyellow transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-gray-300 hover:text-soloyellow transition-colors" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className="text-gray-300 hover:text-soloyellow transition-colors" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link href="/notifications" className="text-gray-300 hover:text-soloyellow transition-colors" onClick={() => setMobileMenuOpen(false)}>Notifications</Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-gray-300 hover:text-soloyellow transition-colors">Sign Out</button>
                </>
              ) : (
                <Link href="/login" className="text-soloyellow font-semibold" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
