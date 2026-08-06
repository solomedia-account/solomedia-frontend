'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Bell, LogOut, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, memo } from 'react';
import CategoryDropdown from './CategoryDropdown';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setCategoriesLoading(true);
    api.get('/categories')
      .then(setCategories)
      .catch(() => {})
      .finally(() => setCategoriesLoading(false));
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
    <header className="sticky top-0 z-50 bg-mag-black/95 backdrop-blur-md border-b border-mag-accent/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.jpg"
                alt="SoloMedia"
                fill
                className="object-contain transition-transform duration-300 group-hover:scale-110"
                sizes="48px"
                priority
              />
            </div>
            <span className="text-3xl font-display font-bold text-white tracking-tight">
              SOLO<span className="text-mag-accent group-hover:text-mag-accent-hover transition-colors">MEDIA</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1 flex-nowrap">
            {categoriesLoading ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-6 bg-mag-gray-light/30 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-mag-gray-light/30 rounded animate-pulse"></div>
                <div className="w-16 h-6 bg-mag-gray-light/30 rounded animate-pulse"></div>
              </div>
            ) : (
              categories.map((category) => (
                <div
                  key={category.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredCategory(String(category.id))}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <Link 
                    href={`/category/${category.slug}`} 
                    className="magazine-link text-sm px-4 py-2 relative"
                  >
                    {category.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-mag-accent transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                  {hoveredCategory === String(category.id) && (
                    <CategoryDropdown categoryId={String(category.id)} isOpen onClose={() => setHoveredCategory(null)} />
                  )}
                </div>
              ))
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-3 text-mag-white hover:text-mag-accent transition-colors hover:bg-mag-black-light rounded-lg" 
              aria-label="Search"
            >
              <Search size={22} />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="p-3 text-mag-white hover:text-mag-accent transition-colors hover:bg-mag-black-light rounded-lg relative" aria-label="Notifications">
                  <Bell size={22} />
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-mag-accent rounded-full animate-pulse"></span>
                </Link>
                <div className="hidden md:flex items-center space-x-1">
                  <Link href="/dashboard" className="magazine-link text-sm px-4 py-2">Dashboard</Link>
                  <Link href="/profile" className="magazine-link text-sm px-4 py-2">Profile</Link>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-2 text-mag-white hover:text-mag-accent transition-colors p-3 hover:bg-mag-black-light rounded-lg"
                    aria-label="Sign out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="hidden md:flex items-center space-x-2 magazine-button text-sm px-6 py-3">
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}
            
            <button className="lg:hidden p-3 text-mag-white hover:text-mag-accent transition-colors hover:bg-mag-black-light rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-t border-mag-gray-light/20 py-6 animate-slide-up">
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full bg-mag-black-light border-2 border-mag-gray-light/30 rounded-none px-6 py-4 pl-14 text-mag-white placeholder-mag-gray focus:outline-none focus:border-mag-accent font-body text-lg transition-colors"
                  autoFocus
                />
                <Search size={24} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-mag-gray" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-mag-gray hover:text-mag-accent transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </form>
          </div>
        )}

        {mobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-mag-gray-light/20 animate-slide-up">
            <nav className="flex flex-col space-y-2">
              {categoriesLoading ? (
                <div className="flex flex-col space-y-2">
                  <div className="w-full h-12 bg-mag-gray-light/30 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-mag-gray-light/30 rounded animate-pulse"></div>
                  <div className="w-full h-12 bg-mag-gray-light/30 rounded animate-pulse"></div>
                </div>
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="magazine-link text-lg px-4 py-3 hover:bg-mag-black-light rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))
              )}
              <div className="border-t border-mag-gray-light/20 my-4"></div>
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="magazine-link text-lg px-4 py-3 hover:bg-mag-black-light rounded-lg" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className="magazine-link text-lg px-4 py-3 hover:bg-mag-black-light rounded-lg" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link href="/notifications" className="magazine-link text-lg px-4 py-3 hover:bg-mag-black-light rounded-lg" onClick={() => setMobileMenuOpen(false)}>Notifications</Link>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="magazine-link text-lg px-4 py-3 hover:bg-mag-black-light rounded-lg text-left">Sign Out</button>
                </>
              ) : (
                <Link href="/login" className="magazine-button text-center text-lg px-6 py-4" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
