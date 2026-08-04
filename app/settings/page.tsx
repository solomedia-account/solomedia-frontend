'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { preferencesApi } from '@/lib/api';
import { Bell, Mail, Moon, Sun, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
  const { token } = useAuth();
  const [preferences, setPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (token) {
      loadPreferences();
    }
  }, [token]);

  const loadPreferences = async () => {
    if (!token) return;
    try {
      const data = await preferencesApi.getPreferences(token);
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setMessage('');
    try {
      await preferencesApi.updatePreferences(preferences, token);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setMessage('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (key: string) => {
    setPreferences({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Settings
              </h1>
              <p className="text-gray-400">
                Manage your account preferences and notifications.
              </p>
            </div>

            {message && (
              <div className={`mb-6 px-4 py-3 rounded-lg ${
                message.includes('success') 
                  ? 'bg-green-500/10 border border-green-500 text-green-500' 
                  : 'bg-red-500/10 border border-red-500 text-red-500'
              }`}>
                {message}
              </div>
            )}

            <div className="space-y-6">
              {/* Notifications Section */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Bell size={24} className="mr-3 text-soloyellow" />
                  Notifications
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Email Notifications</h3>
                      <p className="text-gray-400 text-sm">Receive email updates about your account</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailNotifications')}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        preferences?.emailNotifications ? 'bg-soloyellow' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                          preferences?.emailNotifications ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Newsletter</h3>
                      <p className="text-gray-400 text-sm">Subscribe to our newsletter for the latest stories</p>
                    </div>
                    <button
                      onClick={() => handleToggle('newsletter')}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        preferences?.newsletter ? 'bg-soloyellow' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                          preferences?.newsletter ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Appearance Section */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  {preferences?.darkMode ? <Moon size={24} className="mr-3 text-soloyellow" /> : <Sun size={24} className="mr-3 text-soloyellow" />}
                  Appearance
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Dark Mode</h3>
                      <p className="text-gray-400 text-sm">Use dark theme across the site</p>
                    </div>
                    <button
                      onClick={() => handleToggle('darkMode')}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        preferences?.darkMode ? 'bg-soloyellow' : 'bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                          preferences?.darkMode ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Language Section */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <Globe size={24} className="mr-3 text-soloyellow" />
                  Language
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Language
                  </label>
                  <select
                    value={preferences?.language || 'en'}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-soloyellow"
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="pt">Português</option>
                    <option value="sw">Kiswahili</option>
                  </select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-soloyellow text-soloblack rounded-lg hover:bg-soloyellow-dark transition-colors disabled:opacity-50 font-semibold"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
