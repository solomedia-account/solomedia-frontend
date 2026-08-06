import { Target, Users, TrendingUp, Award, CheckCircle, Star } from 'lucide-react';

export default function AdvertisePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-32 bg-mag-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mag-black via-mag-black-light to-mag-black opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <h1 className="text-hero md:text-[clamp(2.5rem, 8vw, 5rem)] font-display font-bold text-mag-white mb-6 leading-tight animate-slide-up">
              Put Your Brand in Front of Africa's Most Influential Decision-Makers
            </h1>
            <p className="text-xl md:text-2xl text-mag-gray-light max-w-4xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              SoloMedia connects your business to a curated audience of high-capacity diaspora investors, entrepreneurs, and professionals actively seeking opportunities across Business, Politics, Sports, and Infrastructure. Advertise where the money is looking.
            </p>
          </div>
        </div>
      </section>

      {/* Who Are Our Subscribers */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Who Are Our Subscribers?
            </h2>
          </div>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-mag-gray-light leading-relaxed mb-8">
              Your advert will not reach casual scrollers. It reaches our exclusive community of verified subscribers—a demographic comprised of:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Users size={48} />,
                title: 'Diaspora Investors',
                description: 'Africans in Europe, North America, and the Gulf looking to repatriate capital.'
              },
              {
                icon: <Award size={48} />,
                title: 'C-Suite Executives',
                description: 'Business leaders scouting for expansion into West & Central African markets.'
              },
              {
                icon: <Target size={48} />,
                title: 'Policy Influencers',
                description: 'NGO leaders, political analysts, and legal professionals shaping the continent\'s future.'
              }
            ].map((item, index) => (
              <div key={index} className="magazine-card p-8 text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-mag-accent mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-display font-bold text-mag-white mb-4">{item.title}</h3>
                <p className="text-mag-gray">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto mt-12">
            <div className="gradient-accent clip-diagonal p-8 text-center">
              <p className="text-lg text-mag-white font-body">
                <span className="font-display font-bold text-2xl">92%</span> of our subscribers are actively researching investment sectors (Real Estate, Agritech, Energy, Fintech, and Infrastructure) within the next 12 months. They consume our documentaries, magazines, and courses to understand the cultural and economic landscape before they write a cheque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Advertisers Get */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              What Advertisers Get
            </h2>
          </div>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-mag-gray-light leading-relaxed mb-8">
              When you partner with SoloMedia, you aren't just buying a banner. You are buying contextual credibility.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: <Star size={40} />,
                title: 'Prime Placement',
                description: 'Your brand appears alongside our premium content (Documentaries on African infrastructure, Magazine features on Economic Growth, and Expert-led Business Courses).'
              },
              {
                icon: <Target size={40} />,
                title: 'Native Integration',
                description: 'We can integrate your brand story into our editorial content—think sponsored deep-dives into your sector, featured interviews with your CEO, or case-study documentaries.'
              },
              {
                icon: <TrendingUp size={40} />,
                title: 'Direct Lead Gen',
                description: 'We provide you with anonymized engagement data and click-through metrics so you can track exactly how many investors are interacting with your offer.'
              },
              {
                icon: <Users size={40} />,
                title: 'Diaspora-Focused Targeting',
                description: 'Your ad is pushed specifically to subscribers with IP addresses in the diaspora, ensuring you are not wasting budget on local foot-traffic when you want foreign capital.'
              }
            ].map((item, index) => (
              <div key={index} className="magazine-card p-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-mag-accent mb-4">{item.icon}</div>
                <h3 className="text-xl font-display font-bold text-mag-white mb-3">{item.title}</h3>
                <p className="text-mag-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Advertise With Us */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Why Advertise With Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Trusted Curator',
                description: 'We don\'t produce random content. We produce Afrocentric intelligence. Investors trust us to filter the noise.'
              },
              {
                title: 'Direct Line to the Diaspora',
                description: 'Traditional African media doesn\'t reach the diaspora effectively. We do. Our subscriber base is 65% internationally based.'
              },
              {
                title: 'Content that Converts',
                description: 'Our audience consumes our content to make decisions. When they see your ad alongside a documentary on African infrastructure, they are already in an "investment mindset."'
              }
            ].map((item, index) => (
              <div key={index} className="magazine-card p-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CheckCircle size={40} className="text-mag-accent mb-4" />
                <h3 className="text-xl font-display font-bold text-mag-white mb-3">{item.title}</h3>
                <p className="text-mag-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Breakdown */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Package Breakdown: Which one suits your goals?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'BRONZE',
                price: '50,000 XOF',
                icon: '📊',
                description: 'Perfect for testing the waters. Get your brand seen by our high-value readership without a long-term commitment.',
                bestFor: 'Best for service providers (Law firms, Consultancies).',
                features: ['Brand visibility', 'High-value readership', 'Flexible commitment']
              },
              {
                name: 'SILVER',
                price: '200,000 XOF',
                icon: '🥈',
                description: 'Ideal for established companies launching a specific project (e.g., a new real estate development or a tech IPO).',
                bestFor: 'The newsletter blast and social boosts actively drive investors to your landing page.',
                features: ['Newsletter blast', 'Social media boosts', 'Lead generation', 'Project promotion']
              },
              {
                name: 'GOLD',
                price: '350,000 XOF',
                icon: '🥇',
                description: 'For serious players. This is a strategic partnership.',
                bestFor: 'We don\'t just show your ad; we explain why you are the best investment through a custom-produced documentary and cover story.',
                features: ['Custom documentary', 'Cover story feature', 'CEO positioning', 'Thought leadership', 'Full partnership']
              }
            ].map((pkg, index) => (
              <div key={index} className={`magazine-card p-8 relative animate-slide-up ${index === 2 ? 'border-mag-accent border-2' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
                {index === 2 && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-mag-accent text-mag-white px-4 py-1 text-sm font-display font-bold uppercase">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl mb-4">{pkg.icon}</div>
                <h3 className="text-2xl font-display font-bold text-mag-white mb-2">{pkg.name}</h3>
                <p className="text-3xl font-display font-bold text-mag-accent mb-4">{pkg.price}</p>
                <p className="text-mag-gray mb-4">{pkg.description}</p>
                <p className="text-mag-gray-light text-sm mb-6">{pkg.bestFor}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3 text-mag-white">
                      <CheckCircle size={18} className="text-mag-accent flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className="magazine-button w-full text-center">
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Story */}
      <section className="py-24 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-accent clip-diagonal p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-mag-black/10"></div>
              <div className="relative z-10">
                <Star size={48} className="text-mag-white mb-6" />
                <h2 className="text-headline font-display font-bold text-mag-white mb-8 uppercase tracking-wider">
                  Client Success Story
                </h2>
                <blockquote className="text-xl md:text-2xl text-mag-white/90 font-body leading-relaxed mb-8 italic">
                  "We used Solomedia's Gold package to promote our Agritech fund to the diaspora. Within two weeks of the documentary airing, we received 47 qualified leads from France and the US, resulting in three major capital injections. They understand the investor psyche better than any agency in West Africa."
                </blockquote>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-mag-white/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-display font-bold text-mag-white">MD</span>
                  </div>
                  <div>
                    <p className="text-mag-white font-display font-bold">M. Diallo</p>
                    <p className="text-mag-white/80">Director of Investment, Agro-Capital Group</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
