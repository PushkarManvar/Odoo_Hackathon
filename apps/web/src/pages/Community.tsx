import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  ThumbsUp, 
  Bookmark, 
  Copy, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Share2, 
  MessageSquare,
  Check
} from 'lucide-react';

export const Community: React.FC = () => {
  const { communityPosts, toggleUpvotePost, toggleBookmarkPost, createTrip } = useApp();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const tags = ['All', 'Eco Trekking', 'Culinary', 'Budget Travel', 'Vegan', 'Wild Camping'];

  const filteredPosts = communityPosts.filter(post => {
    if (selectedTag === 'All') return true;
    return post.tags.includes(selectedTag);
  });

  const handleCopyItinerary = (post: typeof communityPosts[0]) => {
    createTrip({
      title: `${post.title} (Cloned)`,
      destination: post.destination.split(',')[0] || post.destination,
      country: post.destination.split(',')[1]?.trim() || 'Global',
      coverImage: post.coverImage,
      startDate: '2026-11-01',
      endDate: '2026-11-08',
      status: 'draft',
      budget: 1800,
      travelersCount: 2,
      travelStyle: post.tags,
      description: post.description,
      daysCount: post.durationDays,
      isPublic: false
    });

    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 1500);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b-4 border-on-surface pb-6 space-y-2">
        <h1 className="font-heading font-extrabold text-3xl text-on-surface flex items-center gap-3">
          <Users className="w-8 h-8 text-tertiary" />
          <span>Explorer Community Hub</span>
        </h1>
        <p className="text-xs text-on-surface-variant">
          Discover, upvote, and clone verified sustainable itineraries created by fellow global travelers.
        </p>
      </div>

      {/* Filter Tag Bar */}
      <div className="flex flex-wrap gap-2 bg-surface-container-low p-4 neo-brutal-card-static">
        {tags.map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 text-xs font-heading font-bold rounded-full border-2 transition-all ${
              selectedTag === tag
                ? 'bg-tertiary text-white border-on-surface shadow-brutal-sm'
                : 'bg-surface text-on-surface border-on-surface hover:bg-surface-container-high'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.map(post => (
          <div key={post.id} className="neo-brutal-card bg-surface-container-lowest overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Image */}
            <div className="md:col-span-5 relative h-60 md:h-auto min-h-[220px]">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover border-b-4 md:border-b-0 md:border-r-4 border-on-surface" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-surface text-on-surface border-2 border-on-surface text-xs font-heading font-bold rounded-full shadow-brutal-sm">
                {post.durationDays} Days Trek
              </div>
            </div>

            {/* Content */}
            <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
              <div>
                {/* Author Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <img src={post.authorAvatar} alt={post.authorName} className="w-8 h-8 rounded-full border-2 border-on-surface" />
                    <div>
                      <span className="block font-heading font-bold text-xs text-on-surface">{post.authorName}</span>
                      <span className="block text-[10px] text-on-surface-variant">{post.createdAt}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-tertiary flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {post.destination}
                  </span>
                </div>

                <h3 className="font-heading font-extrabold text-xl text-on-surface mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {post.description}
                </p>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {post.tags.map(t => (
                    <span key={t} className="text-[10px] font-bold px-2 py-0.5 bg-surface-container-high border border-on-surface rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-between items-center pt-3 border-t-2 border-on-surface/20">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleUpvotePost(post.id)}
                    className={`px-3 py-1.5 text-xs font-bold border-2 rounded-md flex items-center gap-1.5 transition-all ${
                      post.hasUpvoted ? 'bg-primary text-white border-on-surface shadow-brutal-sm' : 'bg-surface hover:bg-surface-container-high border-on-surface'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{post.upvotes}</span>
                  </button>

                  <button 
                    onClick={() => toggleBookmarkPost(post.id)}
                    className={`px-3 py-1.5 text-xs font-bold border-2 rounded-md flex items-center gap-1.5 transition-all ${
                      post.hasBookmarked ? 'bg-secondary text-white border-on-surface shadow-brutal-sm' : 'bg-surface hover:bg-surface-container-high border-on-surface'
                    }`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{post.bookmarksCount}</span>
                  </button>
                </div>

                <button 
                  onClick={() => handleCopyItinerary(post)}
                  disabled={copiedPostId === post.id}
                  className="neo-brutal-btn-tertiary px-4 py-1.5 text-xs flex items-center gap-1.5"
                >
                  {copiedPostId === post.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Cloned to My Trips!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Clone Itinerary</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
