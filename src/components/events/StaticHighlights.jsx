import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, X, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const HighlightModal = ({ isOpen, onClose, item, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl max-w-4xl w-full my-8"
      >
        {/* Header with Image */}
        <div className="relative">
          {item.image_url ? (
            <div className="h-64 md:h-80 overflow-hidden rounded-t-2xl">
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-2xl flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold">
                    {type === 'community' ? '🎙️' : '🎯'}
                  </span>
                </div>
                <h2 className="text-3xl font-bold">{item.name || item.title}</h2>
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
          {/* Date Badge */}
          {item.date && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{item.date}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="mb-4">
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              {type === 'community' ? 'MEDIA' : item.category?.toUpperCase() || 'EVENT'}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
            {item.title}
          </h3>

          {/* Blog Content */}
          {item.blogContent ? (
            <div className="prose prose-slate max-w-none">
              {item.blogContent.map((section, idx) => (
                <div key={idx} className="mb-6">
                  {section.type === 'paragraph' && (
                    <p className="text-slate-600 leading-relaxed mb-4">{section.content}</p>
                  )}
                  {section.type === 'heading' && (
                    <h4 className="text-xl font-semibold text-slate-900 mb-3 mt-6">{section.content}</h4>
                  )}
                  {section.type === 'list' && (
                    <ul className="list-disc list-inside space-y-2 text-slate-600 mb-4">
                      {section.items.map((listItem, i) => (
                        <li key={i}>{listItem}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed mb-8">
              {item.description}
            </p>
          )}

          {/* Image Gallery */}
          {item.gallery && item.gallery.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Event Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {item.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-gray-200">
                    <img 
                      src={img} 
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {item.features && item.features.length > 0 && (
            <div className="space-y-4 mt-8">
              <h4 className="font-semibold text-slate-900">Key Highlights:</h4>
              {item.features.map((feature, idx) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-2">
                  <h5 className="font-medium text-slate-900">{feature.title}</h5>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Stats */}
          {item.stats && (
            <div className="grid grid-cols-3 gap-4 mt-8 p-6 bg-slate-50 rounded-xl">
              {item.stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CommunityCard = ({ community, onReadEntry, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
  >
    {/* Header */}
    <div className="relative h-52 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-4xl font-bold mb-1">{community.name}</div>
        <div className="flex items-center justify-end absolute bottom-3 right-3">
          <div className="w-8 h-8 border-2 border-white/30 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border border-white/50 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border border-white/70 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-4 left-4">
        <Badge className="bg-pink-100 text-pink-700">Media</Badge>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <h3 className="font-bold text-gray-900 text-xl mb-2">
        {community.title}
      </h3>

      <p className="text-gray-500 text-sm line-clamp-3 mb-4">
        {community.description}
      </p>

      <button
        onClick={onReadEntry}
        className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-slate-700 transition-colors group text-sm"
      >
        READ ENTRY
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
);

const EventHighlightCard = ({ event, onReadEntry, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 group"
  >
    <div className="relative h-52 overflow-hidden">
      <img
        src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
        alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-4 left-4">
        <Badge className="bg-cyan-100 text-cyan-700">
          {event.category?.replace('_', ' ') || 'Event'}
        </Badge>
      </div>
      <div className="absolute top-4 right-4">
        <Badge className="bg-indigo-500 text-white">Featured</Badge>
      </div>
    </div>
    <div className="p-6">
      {event.date && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-3 font-mono">
          <Calendar className="w-3.5 h-3.5" />
          {event.date}
        </div>
      )}
      <h3 className="font-bold text-gray-900 text-xl mb-2">{event.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-3 mb-4">{event.description}</p>
      
      <button
        onClick={onReadEntry}
        className="inline-flex items-center gap-2 text-slate-900 font-semibold hover:text-slate-700 transition-colors group text-sm"
      >
        READ ENTRY
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </motion.div>
);

export default function StaticHighlights({ searchTerm = '', category = 'all' }) {
  const [modalState, setModalState] = useState({ isOpen: false, item: null, type: null });

  // Static highlight data
  const highlights = [
    {
      id: 'uipath-workshop',
      type: 'workshop',
      title: "UiPath Automation Workshop",
      description: "An intensive hands-on workshop exploring the power of Robotic Process Automation (RPA) with UiPath, where students learned to automate repetitive tasks and build intelligent workflows.",
      date: "September 24, 2025",
      category: "workshop",
      image_url: "/UI_Path0.jpeg",
      is_featured: true,
      blogContent: [
        {
          type: 'paragraph',
          content: "On September 24, 2025, AOSC hosted an engaging UiPath workshop that introduced students to the world of Robotic Process Automation. The session was designed to provide hands-on experience with UiPath Studio, one of the leading RPA platforms in the industry."
        },
        {
          type: 'heading',
          content: 'What We Covered'
        },
        {
          type: 'paragraph',
          content: "Participants dove deep into automation fundamentals, learning how to design, develop, and deploy software robots that can mimic human actions. The workshop covered everything from basic automation concepts to advanced workflow design patterns."
        },
        {
          type: 'list',
          items: [
            'Introduction to RPA and its real-world applications',
            'UiPath Studio interface and components',
            'Building automated workflows for data entry and web scraping',
            'Working with selectors and UI elements',
            'Error handling and debugging techniques',
            'Best practices for scalable automation'
          ]
        },
        {
          type: 'heading',
          content: 'Key Takeaways'
        },
        {
          type: 'paragraph',
          content: "Students left the workshop with practical skills they could immediately apply to automate repetitive tasks in their daily work. Many participants successfully built their first automation bot during the session, automating tasks like form filling, data extraction, and report generation."
        }
      ],
      stats: [
        { value: '50+', label: 'Participants' },
        { value: '4hrs', label: 'Duration' },
        { value: '15+', label: 'Bots Created' }
      ],
      features: [
        {
          title: "Hands-on Learning",
          description: "Every participant built real automation workflows during the workshop"
        },
        {
          title: "Industry Expert",
          description: "Led by experienced RPA professionals with real-world insights"
        },
        {
          title: "Practical Projects",
          description: "Students automated actual business processes and workflows"
        }
      ]
    },
    {
      id: 'web-dev-workshop',
      type: 'workshop',
      title: "Web Development Bootcamp",
      description: "A comprehensive two-day bootcamp covering modern web development technologies, from HTML/CSS fundamentals to advanced JavaScript frameworks and deployment strategies.",
      date: "October 17-18, 2025",
      category: "workshop",
      image_url: "/Web_dev2.jpg",
      is_featured: true,
      gallery: [
        "/Web_dev0.jpg",
        "/Web_dev1.jpg",
        "/Web_dev2.jpg",
        "/Web_dev3.jpg"
      ],
      blogContent: [
        {
          type: 'paragraph',
          content: "Over two intensive days on October 17-18, 2025, AOSC along with C-Maniax conducted a comprehensive Web Development Bootcamp that took participants from web fundamentals to building full-fledged modern web applications. The workshop was structured to provide both theoretical knowledge and extensive hands-on practice."
        },
        {
          type: 'heading',
          content: 'Day 1: Foundations & Frontend'
        },
        {
          type: 'paragraph',
          content: "The first day focused on building a solid foundation in web technologies. Participants learned HTML5 semantic markup, CSS3 styling techniques including Flexbox and Grid, and responsive design principles. We then progressed to JavaScript fundamentals, DOM manipulation, and event handling."
        },
        {
          type: 'list',
          items: [
            'HTML5 semantic elements and accessibility',
            'CSS3 advanced layouts with Flexbox and Grid',
            'Responsive design and mobile-first approach',
            'JavaScript ES6+ features and best practices',
            'DOM manipulation and event-driven programming',
            'Introduction to React and component-based architecture'
          ]
        },
        {
          type: 'heading',
          content: 'Day 2: Advanced Concepts & Deployment'
        },
        {
          type: 'paragraph',
          content: "The second day elevated the learning with modern frameworks and backend integration. Participants built interactive applications using React, learned state management, server connections, and how to handle requests and responses through backend APIs."
        },
        {
          type: 'list',
          items: [
            'React hooks and state management',
            'Server connection and backend integration',
            'Handling HTTP requests and responses',
            'RESTful API integration and async operations',
            'Git version control and collaboration workflows',
            'Build tools and bundlers (Vite, Webpack)',
            'Deployment strategies (Vercel, Netlify)',
            'Performance optimization and best practices'
          ]
        }
      ],
      stats: [
        { value: '60+', label: 'Participants' },
        { value: '2 Days', label: 'Duration' },
        { value: '4', label: 'Topics Covered' }
      ],
      features: [
        {
          title: "Full-Stack Coverage",
          description: "From HTML basics to React deployment in just two days"
        },
        {
          title: "Live Coding Sessions",
          description: "Build real projects alongside experienced developers"
        },
        {
          title: "Career Guidance",
          description: "Learn industry best practices and portfolio building tips"
        },
        {
          title: "Continued Support",
          description: "Access to resources and community support after the workshop"
        }
      ]
    }
  ];

  // Filter highlights based on search and category
  const filteredHighlights = highlights.filter((item) => {
    const matchesSearch = !searchTerm || 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = category === 'all' || item.category === category;

    return matchesSearch && matchesCategory;
  });

  const openModal = (item, type) => {
    setModalState({ isOpen: true, item, type });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, item: null, type: null });
  };

  if (filteredHighlights.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHighlights.map((item, index) => {
          return item.type === 'community' ? (
            <CommunityCard
              key={item.id}
              community={item}
              onReadEntry={() => openModal(item, 'community')}
              index={index}
            />
          ) : (
            <EventHighlightCard
              key={item.id}
              event={item}
              onReadEntry={() => openModal(item, 'event')}
              index={index}
            />
          );
        })}
      </div>

      <HighlightModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        item={modalState.item}
        type={modalState.type}
      />
    </>
  );
}