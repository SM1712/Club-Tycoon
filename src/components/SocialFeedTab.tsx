import React, { useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { SocialFeedSystem } from '../systems/SocialFeedSystem';
import { MessageSquare, Heart, Repeat, Sparkles, Flame, AtSign } from 'lucide-react';

export const SocialFeedTab: React.FC = () => {
  const { userClub, lastMatch, currentWeek } = useGame();

  const posts = useMemo(() => {
    if (!userClub) return [];
    return SocialFeedSystem.generatePosts(userClub, lastMatch, currentWeek);
  }, [userClub, lastMatch, currentWeek]);

  if (!userClub) return null;

  return (
    <section className="tab-pane active" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '780px', margin: '0 auto' }}>
      {/* HEADER BANNER */}
      <div style={{ background: '#ffffff', border: '2px solid #18181b', borderRadius: '12px', padding: '1rem 1.25rem', boxShadow: '2.5px 3px 0px #18181b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ width: '42px', height: '42px', background: '#fef08a', border: '1.5px solid #18181b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1.5px 1.5px 0px #18181b' }}>
            <MessageSquare size={22} color="#18181b" />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#18181b' }}>
              Redes Sociales & Memes del Club
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#52525b', margin: 0, fontWeight: 600 }}>
              Reacciones de la afición en vivo, rumores y tendencias virales de la comarca
            </p>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', background: '#dcfce7', border: '1px solid #18181b', borderRadius: '12px', color: '#15803d' }}>
          🔴 En Directo
        </span>
      </div>

      {/* FEED LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {posts.map(post => (
          <div
            key={post.id}
            style={{
              background: '#ffffff',
              border: '2px solid #18181b',
              borderRadius: '12px',
              padding: '1rem 1.15rem',
              boxShadow: '2.5px 3px 0px #18181b',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {/* Author bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: post.avatarBg,
                    border: '1.5px solid #18181b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    color: '#18181b'
                  }}
                >
                  {post.authorName.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#18181b', fontFamily: 'var(--font-heading)' }}>
                    {post.authorName}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 600 }}>
                    {post.handle} • {post.timeAgo}
                  </span>
                </div>
              </div>

              {post.tag && (
                <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', background: '#fef08a', border: '1px solid #18181b', borderRadius: '6px', color: '#18181b' }}>
                  {post.tag}
                </span>
              )}
            </div>

            {/* Content text */}
            <p style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', color: '#18181b', margin: '0.2rem 0', lineHeight: 1.4, fontWeight: 500 }}>
              {post.content}
            </p>

            {/* Interaction bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', borderTop: '1px solid #e4e4e7', paddingTop: '0.4rem', marginTop: '0.2rem', fontSize: '0.78rem', color: '#52525b', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Heart size={14} color="#ef4444" fill="#ef4444" /> {post.likes}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <Repeat size={14} color="#16a34a" /> {post.retweets}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
