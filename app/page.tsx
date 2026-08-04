import ArticleCard from '@/components/ArticleCard';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';

const StoryCarousel = dynamic(() => import('@/components/StoryCarousel'), {
  loading: () => <div className="h-96 bg-gray-900 animate-pulse" />,
  ssr: true
});

const ParallaxSection = dynamic(() => import('@/components/ParallaxSection'), {
  loading: () => <div className="h-96 bg-gray-900 animate-pulse" />,
  ssr: true
});

async function getCarouselStories() {
  try {
    const categories = await api.get('/categories', undefined, true);
    const stories = await Promise.all(
      categories.map(async (category: any) => {
        const data = await api.get(`/articles?category=${category.id}&limit=1`, undefined, true);
        return data.articles?.[0] || null;
      })
    );
    const filteredStories = stories.filter((story: any) => story !== null);
    
    // If no stories from categories, get top stories as fallback
    if (filteredStories.length === 0) {
      const data = await api.get('/articles?limit=6', undefined, true);
      return data.articles || [];
    }
    
    return filteredStories;
  } catch (error) {
    return [];
  }
}

async function getTopStories() {
  try {
    const data = await api.get('/articles?limit=6&sort=views', undefined, true);
    return data.articles || [];
  } catch (error) {
    return [];
  }
}

async function getLatestStories() {
  try {
    const data = await api.get('/articles?limit=8&sort=publishedAt', undefined, true);
    return data.articles || [];
  } catch (error) {
    return [];
  }
}

async function getInvestorRelationsStory() {
  try {
    const categories = await api.get('/categories', undefined, true);
    const investorCategory = categories?.find((c: any) => c.slug === 'investor-relations');
    if (investorCategory && investorCategory.id) {
      const data = await api.get(`/articles?category=${investorCategory.id}&limit=1`, undefined, true);
      if (data.articles?.[0]) {
        return data.articles[0];
      }
    }
    
    // Fallback to top story if no investor relations story
    const data = await api.get('/articles?limit=1', undefined, true);
    return data.articles?.[0] || null;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  const carouselStories = await getCarouselStories();
  const topStories = await getTopStories();
  const investorStory = await getInvestorRelationsStory();
  const latestStories = await getLatestStories();

  return (
    <main className="flex-1">
      {/* Story Carousel */}
      <StoryCarousel articles={carouselStories} />

      {/* Top Stories Section */}
      {topStories.length > 0 && (
        <section className="py-12 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center">
              <span className="w-2 h-8 bg-soloyellow mr-4"></span>
              Top Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topStories.slice(0, 6).map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parallax Section - Investor Relations */}
      {investorStory && <ParallaxSection article={investorStory} />}

      {/* Latest Stories Section */}
      {latestStories.length > 0 && (
        <section className="py-12 bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-display font-bold mb-8 flex items-center">
              <span className="w-2 h-8 bg-soloyellow mr-4"></span>
              Latest Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestStories.map((article: any) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-soloyellow to-soloyellow-dark rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-display font-bold text-soloblack mb-4">
              Stay Connected
            </h2>
            <p className="text-soloblack/80 mb-6 max-w-xl mx-auto">
              Get the latest stories from the African diaspora delivered to your inbox.
            </p>
            <div className="flex max-w-md mx-auto space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-soloblack placeholder-soloblack/50 focus:outline-none focus:ring-2 focus:ring-soloblack"
              />
              <button className="bg-soloblack text-soloyellow px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
