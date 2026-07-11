'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Search, User, Bell, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import CategoryDropdown from './CategoryDropdown';
import { api } from '@/lib/api';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get('/categories');
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
              />
            </div>
            <span className="text-2xl font-display font-bold text-white">
              SOLO<span className="text-soloyellow">MEDIA</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setHoveredCategory(String(category.id))}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="text-gray-300 hover:text-soloyellow transition-colors block"
                >
                  {category.name}
                </Link>
                {hoveredCategory === String(category.id) && (
                  <CategoryDropdown
                    categoryId={String(category.id)}
                    isOpen={true}
                    onClose={() => setHoveredCategory(null)}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-300 hover:text-soloyellow transition-colors">
              <Search size={20} />
            </button>
            
            {isAuthenticated ? (
              <>
                <Link href="/notifications" className="p-2 text-gray-300 hover:text-soloyellow transition-colors relative">
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
            
            <button 
              className="md:hidden p-2 text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
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
                  <Link href="/dashboard" className="text-gray-300 hover:text-soloyellow transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-300 hover:text-soloyellow transition-colors">
                    Profile
                  </Link>
                  <Link href="/notifications" className="text-gray-300 hover:text-soloyellow transition-colors">
                    Notifications
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-300 hover:text-soloyellow transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-soloyellow font-semibold">
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
