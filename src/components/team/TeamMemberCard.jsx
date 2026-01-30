import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Github } from 'lucide-react';

const roleColors = {
  coordinator: 'bg-amber-100 text-amber-700',
  community_lead: 'bg-purple-100 text-purple-700',
  executive: 'bg-blue-100 text-blue-700',
  member: 'bg-indigo-100 text-indigo-700',
  alumni: 'bg-gray-100 text-gray-700',
  soswc_rep: 'bg-pink-100 text-pink-700',
};

const roleLabels = {
  coordinator: 'Faculty Co-ordinator',
  community_lead: 'Community Lead',
  executive: 'Executive Member',
  member: 'Community Member',
  alumni: 'Alumni',
  soswc_rep: 'SOSWC Representative',
};

export default function TeamMemberCard({ member, index, size = 'normal' }) {
  const isLarge = size === 'large';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className={`bg-white rounded-2xl ${isLarge ? 'p-8' : 'p-5'} border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300 text-center cursor-hover`}
    >
      {/* Avatar */}
      <div className={`${isLarge ? 'w-32 h-32' : 'w-20 h-20'} mx-auto mb-4 rounded-full overflow-hidden bg-slate-100 ring-4 ring-slate-50`}>
        <img
          src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
          alt={member.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Name */}
      <h3 className={`font-bold text-slate-900 ${isLarge ? 'text-xl' : 'text-base'} mb-1`}>
        {member.name}
      </h3>

      {/* Role/Title */}
      <p className="text-slate-500 text-sm mb-3">
        {member.title || roleLabels[member.role] || member.role}
      </p>

      {/* GitHub Link */}
      {member.github_username && (
        <a
          href={`https://github.com/${member.github_username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-700 transition-colors font-medium cursor-hover"
        >
          <Github className="w-3.5 h-3.5" />
          @{member.github_username}
        </a>
      )}

      {/* Skills */}
      {member.skills && member.skills.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-4">
          {member.skills.slice(0, 2).map((skill, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs bg-slate-100 text-slate-600"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
}