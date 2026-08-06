import { Target, Globe, BookOpen, Users, TrendingUp, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-32 bg-mag-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mag-black via-mag-black-light to-mag-black opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-hero md:text-[clamp(3rem, 10vw, 6rem)] font-display font-bold text-mag-white mb-6 leading-tight animate-slide-up">
              About SoloMedia
            </h1>
            <p className="text-xl md:text-2xl text-mag-gray-light max-w-3xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              Premier entertainment and content production company specializing in Fashion, Modeling, and Acting
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-8">
              <div className="w-3 h-16 bg-mag-accent mr-6"></div>
              <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
                Who We Are
              </h2>
            </div>
            <p className="text-lg text-mag-gray-light leading-relaxed mb-6">
              SoloMedia is a premier entertainment and content production company specializing in Fashion, Modeling, and Acting. We bridge the gap between creative talent and global audiences through our digital studio, producing high-impact Film, Documentary, Music, TV series, Radio, and Digital content.
            </p>
            <p className="text-lg text-mag-gray-light leading-relaxed">
              We offer flexible access to industry expertise—complimentary foundational courses led by seasoned professionals, alongside a premium monthly subscription to our curated Lifestyle Magazines. Our diverse portfolio extends beyond content creation to include Artist Management, Advertising, Publishing, Copyright & Legal Support, and Executive Coaching.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Our Services
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={40} />,
                title: 'Content Production',
                description: 'High-impact Film, Documentary, Music, TV series, Radio, and Digital content production'
              },
              {
                icon: <Globe size={40} />,
                title: 'Digital Studio',
                description: 'Bridging creative talent with global audiences through innovative digital platforms'
              },
              {
                icon: <BookOpen size={40} />,
                title: 'Education & Training',
                description: 'Complimentary foundational courses led by seasoned industry professionals'
              },
              {
                icon: <Users size={40} />,
                title: 'Artist Management',
                description: 'Comprehensive talent management and career development services'
              },
              {
                icon: <Award size={40} />,
                title: 'Publishing & Legal',
                description: 'Copyright protection, publishing services, and legal support for creatives'
              },
              {
                icon: <TrendingUp size={40} />,
                title: 'Executive Coaching',
                description: 'Professional coaching and mentorship for creative industry leaders'
              }
            ].map((service, index) => (
              <div key={index} className="magazine-card p-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-mag-accent mb-6">{service.icon}</div>
                <h3 className="text-xl font-display font-bold text-mag-white mb-4">{service.title}</h3>
                <p className="text-mag-gray">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="gradient-accent clip-diagonal p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-mag-black/10"></div>
              <div className="relative z-10">
                <Target size={64} className="text-mag-white mx-auto mb-8" />
                <h2 className="text-hero font-display font-bold text-mag-white mb-8 uppercase tracking-tight">
                  Our Mission
                </h2>
                <p className="text-xl md:text-2xl text-mag-white/90 font-body leading-relaxed max-w-3xl mx-auto">
                  To become the leading publisher of authentic Afrocentric content, driving sustainable socio-economic growth by showcasing the continent's rich narrative across Business, Politics, Sports, Investment, and Culture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Magazines */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Lifestyle Magazines
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-mag-gray-light leading-relaxed mb-8">
              Subscribe to our premium monthly magazine collection featuring curated content on African fashion, arts, music, film, entertainment, technology, and investor dynamics. Each issue delivers exclusive insights, interviews, and stories from the African diaspora.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="magazine-badge text-sm px-4 py-2">Fashion</div>
              <div className="magazine-badge text-sm px-4 py-2">Arts & Culture</div>
              <div className="magazine-badge text-sm px-4 py-2">Music & Entertainment</div>
              <div className="magazine-badge text-sm px-4 py-2">Film & TV</div>
              <div className="magazine-badge text-sm px-4 py-2">Technology</div>
              <div className="magazine-badge text-sm px-4 py-2">Investment</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
