'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { profileApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Camera, MapPin, Globe, Link as LinkIcon, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    headline: '',
    about: '',
    location: '',
    website: '',
    expertise: [] as string[],
    interests: [] as string[],
  });

  useEffect(() => {
    if (token) {
      loadProfile();
    }
  }, [token]);

  const loadProfile = async () => {
    if (!token) return;
    try {
      const data = await profileApi.getOwnProfile(token);
      setProfile(data);
      setFormData({
        displayName: data.displayName || '',
        headline: data.headline || '',
        about: data.about || '',
        location: data.location || '',
        website: data.website || '',
        expertise: data.expertise || [],
        interests: data.interests || [],
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await profileApi.updateProfile(formData, token);
      await loadProfile();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        displayName: profile.displayName || '',
        headline: profile.headline || '',
        about: profile.about || '',
        location: profile.location || '',
        website: profile.website || '',
        expertise: profile.expertise || [],
        interests: profile.interests || [],
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-gray-900 rounded-2xl p-8 mb-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-soloyellow to-soloyellow-dark flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-soloblack">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 bg-soloyellow p-2 rounded-full">
                      <Camera size={16} className="text-soloblack" />
                    </button>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-1">
                      {profile?.displayName || user?.name}
                    </h1>
                    {profile?.headline && (
                      <p className="text-soloyellow mb-2">{profile.headline}</p>
                    )}
                    <div className="flex items-center space-x-4 text-gray-400 text-sm">
                      {profile?.location && (
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {profile.location}
                        </span>
                      )}
                      {profile?.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-soloyellow">
                          <LinkIcon size={14} className="mr-1" />
                          {profile.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <X size={18} />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      <span>Edit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Profile Content */}
            <div className="bg-gray-900 rounded-2xl p-8">
              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={formData.headline}
                      onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                      placeholder="e.g., Content Creator & Writer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      About
                    </label>
                    <textarea
                      value={formData.about}
                      onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                        placeholder="City, Country"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-6 py-3 bg-soloyellow text-soloblack rounded-lg hover:bg-soloyellow-dark transition-colors disabled:opacity-50"
                    >
                      <Save size={18} />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile?.about && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">About</h3>
                      <p className="text-gray-300">{profile.about}</p>
                    </div>
                  )}

                  {profile?.expertise && profile.expertise.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.expertise.map((skill: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-soloyellow/20 text-soloyellow rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile?.interests && profile.interests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests.map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {user?.stats && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-soloyellow">{user.stats.articlesPublished}</div>
                          <div className="text-sm text-gray-400">Articles</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-soloyellow">{user.stats.articlesViews}</div>
                          <div className="text-sm text-gray-400">Views</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-soloyellow">{user.stats.followers}</div>
                          <div className="text-sm text-gray-400">Followers</div>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-soloyellow">{user.stats.following}</div>
                          <div className="text-sm text-gray-400">Following</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
