import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { api } from '@/lib/api';

async function getCategory(slug: string) {
  try {
    const category = await api.get(`/categories/${slug}`);
    return category;
  } catch (error) {
    return null;
  }
}

async function getCategoryArticles(categorySlug: string) {
  try {
    const category = await api.get(`/categories/${categorySlug}`);
    console.log('Category:', category);
    if (!category || !category.id) {
      console.error('Category not found or missing ID');
      return [];
    }
    const data = await api.get(`/articles?category=${category.id}&limit=12`);
    console.log('Articles data:', data);
    console.log('Articles:', data.articles);
    return data.articles || [];
  } catch (error) {
    console.error('Error fetching category articles:', error);
    return [];
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug);
  const articles = await getCategoryArticles(params.slug);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Category Header */}
        <section className="bg-gray-950 py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-4 mb-4">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-soloyellow uppercase tracking-wider text-sm font-semibold">
                Category
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-400 text-lg max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </section>

        {/* Articles Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No articles found in this category yet.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
