import ArticleCard from '@/components/ArticleCard';
import { api } from '@/lib/api';
import dynamic from 'next/dynamic';
import { Metadata } from 'next';

const StoryCarousel = dynamic(() => import('@/components/StoryCarousel'), {
  loading: () => <div className="h-[600px] bg-mag-black-light animate-pulse" />,
  ssr: true
});

const ParallaxSection = dynamic(() => import('@/components/ParallaxSection'), {
  loading: () => <div className="h-[500px] bg-mag-black-light animate-pulse" />,
  ssr: true
});

export const metadata: Metadata = {
  title: 'Home',
  description: 'Explore the latest in African fashion, arts, music, film, entertainment, technology and investor dynamics. SoloMedia brings you stories from the African diaspora.',
  openGraph: {
    title: 'SoloMedia - Home',
    description: 'Explore the latest in African fashion, arts, music, film, entertainment, technology and investor dynamics.',
    url: 'https://solomedia.onrender.com',
  },
};

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
        <section className="py-16 bg-mag-black">
          <div className="container mx-auto px-6">
            <div className="flex items-center mb-12">
              <div className="w-3 h-16 bg-mag-accent mr-6"></div>
              <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
                Top Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topStories.slice(0, 6).map((article: any, index: number) => (
                <div key={article.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ArticleCard key={article.id} article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Parallax Section - Investor Relations */}
      {investorStory && <ParallaxSection article={investorStory} />}

      {/* Latest Stories Section */}
      {latestStories.length > 0 && (
        <section className="py-16 bg-mag-black-light">
          <div className="container mx-auto px-6">
            <div className="flex items-center mb-12">
              <div className="w-3 h-16 bg-mag-accent mr-6"></div>
              <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
                Latest Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {latestStories.map((article: any, index: number) => (
                <div key={article.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <ArticleCard key={article.id} article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-24 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="gradient-accent clip-diagonal p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-mag-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-hero font-display font-bold text-mag-white mb-6 uppercase tracking-tight">
                Stay Connected
              </h2>
              <p className="text-mag-white/90 text-xl mb-8 max-w-2xl mx-auto font-body">
                Get the latest stories from the African diaspora delivered to your inbox.
              </p>
              <div className="flex max-w-lg mx-auto space-x-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-mag-white/10 border-2 border-mag-white/30 text-mag-white placeholder-mag-white/50 focus:outline-none focus:border-mag-white font-body text-lg rounded-none"
                />
                <button className="magazine-button text-lg px-8 py-4">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
