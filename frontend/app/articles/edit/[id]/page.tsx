'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articlesApi, categoriesApi, uploadApi } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Save, ArrowLeft, Eye, FileText, Tag, Image as ImageIcon, Upload, Video, Link as LinkIcon } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export default function EditArticlePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentMedia, setUploadingContentMedia] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    categoryId: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    isFeatured: false,
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    if (user && !['admin', 'editor', 'author'].includes(user.role)) {
      router.push('/dashboard');
      return;
    }

    loadArticle();
    loadCategories();
  }, [token, user, router, articleId]);

  const loadArticle = async () => {
    if (!token) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const data = await articlesApi.getArticleById(articleId, token);
      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        categoryId: data.categoryId,
        tags: data.tags?.join(', ') || '',
        featuredImage: data.featuredImage || '',
        status: data.status,
        isFeatured: data.isFeatured || false,
      });
    } catch (error) {
      console.error('Failed to load article:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.excerpt.trim()) newErrors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (!formData.categoryId) newErrors.categoryId = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (overrideStatus?: string) => {
    if (!validateForm()) return;
    if (!token) return;

    setSaving(true);
    try {
      const articleData = {
        ...formData,
        status: overrideStatus || formData.status,
        categoryId: formData.categoryId || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      console.log('Updating article ID:', articleId);
      console.log('Article data:', { ...articleData, content: articleData.content?.substring(0, 100) + '...' });
      console.log('User role:', user?.role);
      
      const result = await articlesApi.updateArticle(articleId, articleData, token);
      console.log('Update result:', result);
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to update article:', error);
      alert(`Failed to update article: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    handleSubmit('draft');
  };

  const handlePublish = async () => {
    handleSubmit('published');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingImage(true);
    try {
      const result = await uploadApi.uploadImage(file, token);
      setFormData(prev => ({ ...prev, featuredImage: result.url }));
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const insertAtCursor = (text: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = formData.content;

    const newValue = value.substring(0, start) + text + value.substring(end);
    setFormData(prev => ({ ...prev, content: newValue }));

    // Move cursor after inserted text
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    }, 0);
  };

  const insertContentImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      const alt = prompt('Enter alt text (optional):') || '';
      const imageMarkdown = `
![${alt}](${url})
`;
      insertAtCursor(imageMarkdown);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingContentMedia(true);
    try {
      const result = await uploadApi.uploadImage(file, token);
      const alt = prompt('Enter alt text for the image (optional):') || '';
      const imageMarkdown = `
![${alt}](${result.url})
`;
      insertAtCursor(imageMarkdown);
    } catch (error) {
      console.error('Failed to upload content image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingContentMedia(false);
    }
  };

  const handleContentVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingContentMedia(true);
    try {
      const result = await uploadApi.uploadVideo(file, token);
      const videoMarkdown = `
<video controls width="100%">
  <source src="${result.url}" type="video/mp4">
  Your browser does not support the video tag.
</video>
`;
      insertAtCursor(videoMarkdown);
    } catch (error) {
      console.error('Failed to upload content video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploadingContentMedia(false);
    }
  };

  const insertContentVideo = () => {
    const url = prompt('Enter video URL (YouTube, Vimeo, or direct video link):');
    if (url) {
      let videoMarkdown = '';
      
      // Check if it's a YouTube URL
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        const videoId = url.includes('youtu.be') 
          ? url.split('/').pop() 
          : new URL(url).searchParams.get('v');
        videoMarkdown = `
<div class="video-container">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
</div>
`;
      } 
      // Check if it's a Vimeo URL
      else if (url.includes('vimeo.com')) {
        const videoId = url.split('/').pop();
        videoMarkdown = `
<div class="video-container">
  <iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>
</div>
`;
      }
      // Direct video link
      else {
        videoMarkdown = `
<video controls width="100%">
  <source src="${url}" type="video/mp4">
  Your browser does not support the video tag.
</video>
`;
      }
      
      insertAtCursor(videoMarkdown);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      const text = prompt('Enter link text:') || url;
      const linkMarkdown = `[${text}](${url})`;
      insertAtCursor(linkMarkdown);
    }
  };

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-950 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Article Not Found</h1>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-soloyellow hover:text-soloyellow-dark"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user || !['admin', 'editor', 'author'].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-950 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setPreview(!preview)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Eye size={20} />
                  <span>{preview ? 'Edit' : 'Preview'}</span>
                </button>
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handlePublish}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-soloyellow hover:bg-soloyellow-dark text-black px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  <FileText size={20} />
                  <span>Publish</span>
                </button>
              </div>
            </div>

            {!preview ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-white font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter article title..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
                  />
                  {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-white font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-slug"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
                  />
                  {errors.slug && <p className="text-red-400 text-sm mt-1">{errors.slug}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-white font-medium mb-2">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-soloyellow"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-white font-medium mb-2">Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description of the article..."
                    rows={3}
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow resize-none"
                  />
                  {errors.excerpt && <p className="text-red-400 text-sm mt-1">{errors.excerpt}</p>}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-white font-medium mb-2">Content</label>
                  
                  {/* Content Toolbar */}
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-900 border border-gray-800 rounded-t-lg">
                    <button
                      type="button"
                      onClick={insertContentImage}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                    >
                      <ImageIcon size={16} />
                      <span>Image URL</span>
                    </button>
                    <label className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm cursor-pointer">
                      <Upload size={16} />
                      <span>{uploadingContentMedia ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleContentImageUpload}
                        disabled={uploadingContentMedia}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={insertContentVideo}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                    >
                      <Video size={16} />
                      <span>Video URL</span>
                    </button>
                    <label className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm cursor-pointer">
                      <Upload size={16} />
                      <span>{uploadingContentMedia ? 'Uploading...' : 'Upload Video'}</span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleContentVideoUpload}
                        disabled={uploadingContentMedia}
                        className="hidden"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={insertLink}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                    >
                      <LinkIcon size={16} />
                      <span>Link</span>
                    </button>
                  </div>

                  <textarea
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here... Use the toolbar above to insert images, videos, and links."
                    rows={15}
                    className="w-full bg-gray-900 border border-gray-800 border-t-0 rounded-b-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow resize-none font-mono text-sm"
                  />
                  {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-white font-medium mb-2">Tags (comma-separated)</label>
                  <div className="relative">
                    <Tag size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="tech, tutorial, news"
                      className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
                    />
                  </div>
                </div>

                {/* Featured Image */}
                <div>
                  <label className="block text-white font-medium mb-2">Featured Image</label>
                  
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                        <Upload size={20} />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>
                      <span className="text-gray-400 text-sm">or paste URL below</span>
                    </div>

                    {/* URL Input */}
                    <div className="relative">
                      <ImageIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData(prev => ({ ...prev, featuredImage: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-soloyellow"
                      />
                    </div>

                    {/* Image Preview */}
                    {formData.featuredImage && (
                      <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800">
                        <img
                          src={formData.featuredImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                  <h3 className="text-white font-medium mb-4">Article Options</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-soloyellow focus:ring-soloyellow focus:ring-offset-gray-900"
                      />
                      <span className="text-white">Featured Article</span>
                    </label>

                    <div>
                      <label className="block text-white font-medium mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-soloyellow"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <h1 className="text-4xl font-bold text-white mb-4">{formData.title || 'Untitled'}</h1>
                {formData.excerpt && (
                  <p className="text-gray-400 text-lg mb-6">{formData.excerpt}</p>
                )}
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-white">{formData.content || 'No content yet...'}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
