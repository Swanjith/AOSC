import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Github, ExternalLink, User, Clock } from 'lucide-react';

const TeamMemberRow = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-white border border-slate-100 rounded-xl p-6 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Left: Skills */}
        <div className="flex flex-wrap gap-2 md:min-w-[200px]">
          {member.skills && member.skills.length > 0 ? (
            member.skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs uppercase font-medium border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 transition-colors"
              >
                {skill}
              </Badge>
            ))
          ) : (
            <Badge
              variant="outline"
              className="text-xs uppercase font-medium border-slate-200 text-slate-500 bg-slate-50"
            >
              Developer
            </Badge>
          )}
        </div>

        {/* Center: Name & GitHub Stats */}
        <div className="flex-1 md:text-center">
          <motion.h3
            className="text-xl md:text-2xl font-bold text-slate-900 group-hover:translate-x-1 transition-transform duration-200"
            whileHover={{ x: 4 }}
          >
            {member.name}
          </motion.h3>
          {member.title && (
            <p className="text-sm text-slate-500 mt-1">{member.title}</p>
          )}
          
          {/* GitHub Stats - only show valid data */}
          {(() => {
            const validLastSeen = member.lastSeen && member.lastSeen !== 'unknown' && member.lastSeen !== 'NaN';
            const validStatus = member.status && member.status !== 'unknown';
            
            // Only show the stats container if we have at least one valid piece of data
            if (!validLastSeen && !validStatus) return null;
            
            return (
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-500">
                {validLastSeen && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {member.lastSeen}
                  </span>
                )}
                {validStatus && (
                  <div className={`w-2 h-2 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' :
                    member.status === 'coding' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }`}></div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Right: GitHub + Photo */}
        <div className="flex items-center gap-4 md:min-w-[200px] md:justify-end">
          {/* GitHub Link */}
          {member.github_username && (
            <a
              href={`https://github.com/${member.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors group/link"
            >
              <Github className="w-4 h-4" />
              <span className="group-hover/link:underline font-mono">
                {member.github_username}
              </span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
            </a>
          )}

          {/* Profile Photo */}
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-200 flex-shrink-0 flex items-center justify-center">
            {member.avatar_url ? (
              <img
                src={member.avatar_url}
                alt={`${member.name} profile`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <User className="w-6 h-6 text-slate-400" />
            )}
          </div>
        </div>
      </div>

      {/* Hover background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/0 via-cyan-50/20 to-cyan-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none" />
    </motion.div>
  );
};

export default function TeamMemberList({ members, title }) {
  if (!members || members.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      {title && (
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-slate-900 mb-6"
        >
          {title}
        </motion.h2>
      )}
      
      <div className="space-y-3">
        {members.map((member, index) => (
          <TeamMemberRow key={member.id || index} member={member} index={index} />
        ))}
      </div>
    </section>
  );
}