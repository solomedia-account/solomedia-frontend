'use client';

import { Video, Edit, Palette, TrendingUp, Scale, Code, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';

const WHATSAPP_NUMBER = '+23408148525199';

export default function CareersPage() {
  const openWhatsApp = (role?: string) => {
    const message = role 
      ? `Application: ${role} – [Your Full Name]`
      : 'Hello, I am interested in career opportunities at SoloMedia';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const jobOpenings = [
    {
      icon: <Video size={48} />,
      emoji: '📹',
      title: 'Multimedia Content Producer (Film & Documentary)',
      location: 'Remote / Hybrid (Lagos, Abidjan, or Accra preferred)',
      type: 'Full-Time',
      whatYoullDo: [
        'Conceptualize, shoot, and edit high-quality video content for documentaries, TV series, and digital campaigns.',
        'Manage the entire production lifecycle from pre-production planning to post-production delivery.',
        'Collaborate with our editorial team to ensure content aligns with our Afrocentric mission.'
      ],
      whoYouAre: [
        '3+ years of experience in video production (portfolio required).',
        'Proficient in Adobe Premiere Pro, Final Cut Pro, or DaVinci Resolve.',
        'A storyteller who understands the nuances of African narratives.'
      ]
    },
    {
      icon: <Edit size={48} />,
      emoji: '✍️',
      title: 'Senior Editor & Publisher (Lifestyle Magazine)',
      location: 'Remote',
      type: 'Full-Time',
      whatYoullDo: [
        'Lead the editorial direction for our monthly Lifestyle Magazine covering Business, Politics, Sports, and Investment.',
        'Commission, edit, and proofread articles from freelance writers and contributors.',
        'Ensure all content is compelling, accurate, and tailored to our diaspora investor audience.'
      ],
      whoYouAre: [
        '5+ years of editorial experience in publishing or journalism.',
        'Exceptional command of English (French is a huge plus).',
        'A keen eye for design and layout (experience with InDesign or similar tools preferred).'
      ]
    },
    {
      icon: <Palette size={48} />,
      emoji: '🎨',
      title: 'Graphic Designer & Brand Visualizer',
      location: 'Remote',
      type: 'Full-Time',
      whatYoullDo: [
        'Design visually stunning layouts for our magazine, social media, advertising materials, and website.',
        'Create motion graphics for video content and promotional campaigns.',
        'Maintain and evolve Solomedia\'s visual identity across all platforms.'
      ],
      whoYouAre: [
        'Proficient in Adobe Creative Suite (Photoshop, Illustrator, InDesign, After Effects).',
        'A strong portfolio showcasing editorial, branding, or motion design work.',
        'Ability to work quickly without compromising quality.'
      ]
    },
    {
      icon: <TrendingUp size={48} />,
      emoji: '📈',
      title: 'Digital Marketing & Audience Growth Manager',
      location: 'Remote',
      type: 'Full-Time',
      whatYoullDo: [
        'Develop and execute multi-channel marketing strategies to grow our subscriber base (free and premium).',
        'Manage our social media presence (Instagram, LinkedIn, YouTube, TikTok) with engaging, platform-specific content.',
        'Run targeted ad campaigns aimed at diaspora investors and business decision-makers.',
        'Analyze data to optimize conversion funnels and ROI.'
      ],
      whoYouAre: [
        '3+ years of digital marketing experience (media or entertainment industry preferred).',
        'Deep understanding of SEO, paid social, email marketing, and analytics tools.',
        'A creative mind with a data-driven approach.'
      ]
    },
    {
      icon: <Scale size={48} />,
      emoji: '⚖️',
      title: 'Legal & Business Affairs Associate',
      location: 'Remote',
      type: 'Part-Time / Freelance (Potential for Full-Time)',
      whatYoullDo: [
        'Draft, review, and negotiate contracts for artist management, copyright, publishing, and advertising deals.',
        'Provide legal guidance on intellectual property rights and content licensing.',
        'Ensure Solomedia complies with media regulations across multiple African jurisdictions.'
      ],
      whoYouAre: [
        'Qualified lawyer with 3+ years of experience in entertainment, media, or corporate law.',
        'Strong understanding of copyright, trademark, and contract law.',
        'Excellent negotiation and communication skills.'
      ]
    },
    {
      icon: <Code size={48} />,
      emoji: '💻',
      title: 'Full-Stack Web Developer (Subscription Platform)',
      location: 'Remote',
      type: 'Full-Time',
      whatYoullDo: [
        'Build and maintain our subscription-based website and mobile-responsive platform.',
        'Integrate payment gateways (CFA, USD, etc.) and manage user authentication.',
        'Optimize site speed, security, and user experience for our growing audience.'
      ],
      whoYouAre: [
        'Proficient in HTML, CSS, JavaScript, and frameworks like React or Vue.js.',
        'Experience with backend technologies (Node.js, Python, or PHP) and databases.',
        'Familiarity with Stripe, Paystack, or similar payment APIs is a huge plus.'
      ]
    }
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-32 bg-mag-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-mag-black via-mag-black-light to-mag-black opacity-50"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <h1 className="text-hero md:text-[clamp(2.5rem, 8vw, 5rem)] font-display font-bold text-mag-white mb-6 leading-tight animate-slide-up">
              Careers
            </h1>
            <p className="text-xl md:text-2xl text-mag-gray-light max-w-4xl animate-slide-up" style={{ animationDelay: '100ms' }}>
              At SoloMedia, we don't just create content—we shape narratives that connect the continent to the world. We are looking for passionate, innovative, and driven individuals to join our diverse team of creators, strategists, and visionaries.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Solomedia */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Why Join SoloMedia?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <TrendingUp size={40} />,
                title: 'Impact',
                description: 'Your work will be seen by thousands of diaspora investors, business leaders, and culture enthusiasts across the globe.'
              },
              {
                icon: <Video size={40} />,
                title: 'Creativity',
                description: 'We are a digital studio that produces Film, Documentaries, Music, TV Series, Radio, and Lifestyle Magazines. Every day is different.'
              },
              {
                icon: <ArrowRight size={40} />,
                title: 'Growth',
                description: 'We are a startup. That means your voice is heard, your ideas matter, and your career grows as fast as you do.'
              },
              {
                icon: <Palette size={40} />,
                title: 'Culture',
                description: 'We are a Pan-African team—developers, marketers, artists, editors, legal minds, and managers—united by a shared mission to drive sustainable socio-economic development through media.'
              }
            ].map((item, index) => (
              <div key={index} className="magazine-card p-8 text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-mag-accent mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-display font-bold text-mag-white mb-4">{item.title}</h3>
                <p className="text-mag-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Openings */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              Current Openings
            </h2>
          </div>
          <div className="max-w-4xl mx-auto mb-12">
            <p className="text-lg text-mag-gray-light leading-relaxed">
              We are hiring for the following roles. If you are ready to bring your energy and expertise to a fast-paced, purpose-driven media startup, we want to hear from you.
            </p>
          </div>
          <div className="space-y-8 max-w-5xl mx-auto">
            {jobOpenings.map((job, index) => (
              <div key={index} className="magazine-card p-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-start space-x-6 mb-6">
                  <div className="text-5xl">{job.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-display font-bold text-mag-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm mb-4">
                      <span className="text-mag-accent font-medium flex items-center">
                        <TrendingUp size={16} className="mr-2" />
                        {job.location}
                      </span>
                      <span className="text-mag-gray font-medium">{job.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <h4 className="text-lg font-display font-bold text-mag-white mb-4 flex items-center">
                      <CheckCircle size={20} className="text-mag-accent mr-2" />
                      What You'll Do
                    </h4>
                    <ul className="space-y-2">
                      {job.whatYoullDo.map((item, i) => (
                        <li key={i} className="text-mag-gray flex items-start">
                          <span className="text-mag-accent mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-display font-bold text-mag-white mb-4 flex items-center">
                      <CheckCircle size={20} className="text-mag-accent mr-2" />
                      Who You Are
                    </h4>
                    <ul className="space-y-2">
                      {job.whoYouAre.map((item, i) => (
                        <li key={i} className="text-mag-gray flex items-start">
                          <span className="text-mag-accent mr-2 mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => openWhatsApp(job.title)}
                  className="magazine-button inline-flex items-center space-x-3"
                >
                  <MessageCircle size={20} />
                  <span>Apply via WhatsApp</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-20 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              How to Apply
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-mag-gray-light leading-relaxed mb-8">
              We believe in keeping things simple, fast, and human.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-mag-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-mag-white font-bold">1</span>
                </div>
                <p className="text-mag-gray">
                  Prepare your CV/Resume and a brief Cover Letter telling us why you are the perfect fit for SoloMedia.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-mag-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-mag-white font-bold">2</span>
                </div>
                <p className="text-mag-gray">
                  If applicable, include links to your Portfolio, GitHub, or previous work samples.
                </p>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-mag-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-mag-white font-bold">3</span>
                </div>
                <p className="text-mag-gray">
                  Send all documents to us via WhatsApp on the number below:
                </p>
              </div>
            </div>
            <div className="gradient-accent clip-diagonal p-8 text-center mb-8">
              <MessageCircle size={48} className="text-mag-white mx-auto mb-4" />
              <p className="text-3xl font-display font-bold text-mag-white mb-2">
                {WHATSAPP_NUMBER}
              </p>
              <p className="text-mag-white/80">
                Please note: We will only respond to applications submitted via WhatsApp. This allows us to connect with you directly, answer your questions instantly, and move through the recruitment process faster.
              </p>
            </div>
            <p className="text-mag-gray-light mb-4">
              When sending your message, please start with the role you are applying for (e.g., "Application: Multimedia Content Producer – [Your Full Name]").
            </p>
          </div>
        </div>
      </section>

      {/* What Happens Next */}
      <section className="py-20 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="flex items-center mb-12">
            <div className="w-3 h-16 bg-mag-accent mr-6"></div>
            <h2 className="text-headline font-display font-bold text-mag-white uppercase tracking-wider">
              What Happens Next?
            </h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {[
                { step: 1, text: 'You send your application via WhatsApp.' },
                { step: 2, text: 'Our recruitment team reviews your profile within 48 hours.' },
                { step: 3, text: 'Shortlisted candidates will be contacted for a quick WhatsApp voice/video interview.' },
                { step: 4, text: 'Successful applicants will receive an offer and onboarding details within 1 week.' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-6 magazine-card p-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="w-16 h-16 bg-mag-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-display font-bold text-mag-white">{item.step}</span>
                  </div>
                  <p className="text-lg text-mag-gray">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Equal Opportunity */}
      <section className="py-16 bg-mag-black-light">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-headline font-display font-bold text-mag-white mb-6 uppercase tracking-wider">
              We Are an Equal Opportunity Employer
            </h2>
            <p className="text-lg text-mag-gray-light leading-relaxed">
              At SoloMedia, we celebrate diversity and are committed to creating an inclusive environment for all employees. We encourage applications from individuals of all backgrounds, genders, nationalities, and abilities—especially those with a deep passion for African culture and development.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-mag-black">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-hero font-display font-bold text-mag-white mb-6">
              Ready to Tell Stories That Matter?
            </h2>
            <button
              onClick={() => openWhatsApp()}
              className="magazine-button text-xl px-12 py-6 inline-flex items-center space-x-4"
            >
              <MessageCircle size={28} />
              <span>APPLY NOW ON WHATSAPP</span>
              <ArrowRight size={28} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
