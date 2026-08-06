'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { articlesApi, categoriesApi, uploadApi } from '@/lib/api';
import { Save, ArrowLeft, Eye, FileText, Tag, Image as ImageIcon, Upload, Link as LinkIcon, Bold, Italic, List, Quote, Code, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CreateArticlePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingContentMedia, setUploadingContentMedia] = useState(false);

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

    loadCategories();
  }, [token, user, router]);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
      if (data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }));
      }
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

  const handleSubmit = async (e: React.FormEvent, overrideStatus?: string) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!token) return;

    setLoading(true);
    try {
      const articleData = {
        ...formData,
        status: overrideStatus || formData.status,
        categoryId: formData.categoryId || undefined,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      console.log('Submitting article with status:', articleData.status);
      await articlesApi.createArticle(articleData, token);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to create article:', error);
      alert(`Failed to create article: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    handleSubmit(new Event('submit') as any, 'draft');
  };

  const handlePublish = async () => {
    handleSubmit(new Event('submit') as any, 'published');
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

  const insertFormat = (format: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'h1':
        formattedText = `\n# ${selectedText || 'Heading 1'}\n`;
        break;
      case 'h2':
        formattedText = `\n## ${selectedText || 'Heading 2'}\n`;
        break;
      case 'h3':
        formattedText = `\n### ${selectedText || 'Heading 3'}\n`;
        break;
      case 'ul':
        formattedText = `\n- ${selectedText || 'List item'}\n`;
        break;
      case 'ol':
        formattedText = `\n1. ${selectedText || 'List item'}\n`;
        break;
      case 'quote':
        formattedText = `\n> ${selectedText || 'Quote'}\n`;
        break;
      case 'code':
        formattedText = `\`\`\`\n${selectedText || 'code'}\n\`\`\``;
        break;
      case 'hr':
        formattedText = `\n---\n`;
        break;
      default:
        return;
    }

    const newValue = formData.content.substring(0, start) + formattedText + formData.content.substring(end);
    setFormData(prev => ({ ...prev, content: newValue }));

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + formattedText.length;
      textarea.focus();
    }, 0);
  };

  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      const text = prompt('Enter link text:') || url;
      const linkMarkdown = `[${text}](${url})`;
      insertAtCursor(linkMarkdown);
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploadingContentMedia(true);
    try {
      const isVideo = file.type.startsWith('video/');
      const result = isVideo 
        ? await uploadApi.uploadVideo(file, token)
        : await uploadApi.uploadImage(file, token);
      
      if (isVideo) {
        const videoMarkdown = `
<video controls width="100%">
  <source src="${result.url}" type="video/mp4">
  Your browser does not support the video tag.
</video>
`;
        insertAtCursor(videoMarkdown);
      } else {
        const alt = prompt('Enter alt text for the image (optional):') || '';
        const imageMarkdown = `
![${alt}](${result.url})
`;
        insertAtCursor(imageMarkdown);
      }
    } catch (error) {
      console.error('Failed to upload content media:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setUploadingContentMedia(false);
    }
  };

  if (!user || !['admin', 'editor', 'author'].includes(user.role)) {
    return null;
  }

  return (
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
                  disabled={loading}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={20} />
                  <span>Save Draft</span>
                </button>
                <button
                  onClick={handlePublish}
                  disabled={loading}
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
                  <div className="flex flex-wrap items-center gap-2 mb-2 p-3 bg-gray-900 border border-gray-800 rounded-t-lg">
                    {/* Text Formatting */}
                    <div className="flex items-center space-x-1 border-r border-gray-700 pr-3">
                      <button
                        type="button"
                        onClick={() => insertFormat('bold')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Bold"
                      >
                        <Bold size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('italic')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Italic"
                      >
                        <Italic size={16} />
                      </button>
                    </div>

                    {/* Headings */}
                    <div className="flex items-center space-x-1 border-r border-gray-700 pr-3">
                      <button
                        type="button"
                        onClick={() => insertFormat('h1')}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm font-bold"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('h2')}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm font-bold"
                        title="Heading 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('h3')}
                        className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm font-bold"
                        title="Heading 3"
                      >
                        H3
                      </button>
                    </div>

                    {/* Lists */}
                    <div className="flex items-center space-x-1 border-r border-gray-700 pr-3">
                      <button
                        type="button"
                        onClick={() => insertFormat('ul')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Bullet List"
                      >
                        <List size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('ol')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Numbered List"
                      >
                        <span className="font-bold">1.</span>
                      </button>
                    </div>

                    {/* Other Formatting */}
                    <div className="flex items-center space-x-1 border-r border-gray-700 pr-3">
                      <button
                        type="button"
                        onClick={() => insertFormat('quote')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Quote"
                      >
                        <Quote size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('code')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Code Block"
                      >
                        <Code size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormat('hr')}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Horizontal Rule"
                      >
                        <Minus size={16} />
                      </button>
                    </div>

                    {/* Link */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={insertLink}
                        className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors"
                        title="Insert Link"
                      >
                        <LinkIcon size={16} />
                      </button>
                    </div>

                    {/* Media Upload */}
                    <div className="flex items-center space-x-1 ml-auto">
                      <label className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm cursor-pointer">
                        <ImageIcon size={16} />
                        <span>{uploadingContentMedia ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleContentImageUpload}
                          disabled={uploadingContentMedia}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const url = prompt('Enter media URL (image or video):');
                          if (url) {
                            const alt = prompt('Enter alt text (optional):') || '';
                            const isVideo = url.match(/\.(mp4|webm|ogg)$/i) || url.includes('youtube') || url.includes('vimeo');
                            if (isVideo) {
                              let videoMarkdown = '';
                              if (url.includes('youtube.com') || url.includes('youtu.be')) {
                                const videoId = url.includes('youtu.be') 
                                  ? url.split('/').pop() 
                                  : new URL(url).searchParams.get('v');
                                videoMarkdown = `\n<div class="video-container">\n  <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>\n</div>\n`;
                              } else if (url.includes('vimeo.com')) {
                                const videoId = url.split('/').pop();
                                videoMarkdown = `\n<div class="video-container">\n  <iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allowfullscreen></iframe>\n</div>\n`;
                              } else {
                                videoMarkdown = `\n<video controls width="100%">\n  <source src="${url}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n`;
                              }
                              insertAtCursor(videoMarkdown);
                            } else {
                              const imageMarkdown = `\n![${alt}](${url})\n`;
                              insertAtCursor(imageMarkdown);
                            }
                          }
                        }}
                        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded transition-colors text-sm"
                      >
                        <LinkIcon size={16} />
                        <span>Media URL</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Write your article content here... Use the toolbar above for formatting and media insertion."
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
  );
}
