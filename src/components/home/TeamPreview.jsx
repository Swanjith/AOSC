import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Terminal, User, Code } from 'lucide-react';
import { fetchTeamGitHubData } from '@/utils/serverlessCache';
import { teamMembers } from '@/data/teamMembers';

const TerminalWindow = ({ members, currentMember }) => {
  const [commandHistory, setCommandHistory] = useState([
    '$ ls /team/members',
    'Found 9 active developers...',
    ''
  ]);

  const member = members[currentMember];

  useEffect(() => {
    // Filter out invalid values for dynamic data only
    const filterDynamicValue = (value) => {
      if (value === null || value === undefined || value === 'unknown' || value === 'NaN' ||
        (typeof value === 'number' && isNaN(value))) {
        return null;
      }
      return value;
    };

    const commands = [
      `$ cat /team/${member.username}.profile`,
      `Name: ${member.name}`, // Always show hardcoded name
      filterDynamicValue(member.status) && `Status: ${member.status}`,
      filterDynamicValue(member.lastSeen) && `Last seen: ${member.lastSeen}`,
      filterDynamicValue(member.currentProject) && `Current project: ${member.currentProject}`,
      `Skills: ${member.skills.join(', ')}`, // Always show hardcoded skills
      ''
    ].filter(Boolean); // Remove null/false entries

    setCommandHistory(commands);
  }, [member]);

  return (
    <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 ml-2">team-browser — bash</span>
      </div>

      {/* Terminal Content */}
      <div className="space-y-1">
        {commandHistory.map((line, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`${line.startsWith('$')
              ? 'text-green-400'
              : line.includes(':')
                ? 'text-blue-300'
                : 'text-gray-300'
              }`}
          >
            {line}
          </motion.div>
        ))}

        {/* Blinking cursor */}
        <div className="flex items-center">
          <span className="text-green-400">$ </span>
          <span className="text-white ml-1">_</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-green-400"
          >
            |
          </motion.span>
        </div>
      </div>
    </div>
  );
};

const MemberTabs = ({ members, currentMember, onMemberSelect }) => {
  return (
    <div className="flex gap-1 mb-4">
      {members.map((member, index) => (
        <button
          key={member.id}
          onClick={() => onMemberSelect(index)}
          className={`px-4 py-2 rounded-t-lg font-mono text-sm transition-colors ${index === currentMember
            ? 'bg-gray-900 text-green-400 border-b-2 border-green-400'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${member.status === 'online' ? 'bg-green-500' :
              member.status === 'coding' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}></div>
            {member.username}
          </div>
        </button>
      ))}
    </div>
  );
};

const MemberCard = ({ member }) => {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex flex-col items-center text-center">
        {/* Profile Photo */}
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mb-4 ring-4 ring-gray-100 flex items-center justify-center">
          {member.avatar_url ? (
            <img
              src={member.avatar_url}
              alt={member.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="w-full">
          {/* Name and Status */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
            <div className={`w-3 h-3 rounded-full ${member.status === 'online' ? 'bg-green-500' :
              member.status === 'coding' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}></div>
          </div>

          {/* Username */}
          <div className="flex items-center justify-center gap-4 text-base text-gray-600 mb-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="font-mono">@{member.username}</span>
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {member.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-mono font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* GitHub Link */}
          {member.github_username && (
            <a
              href={`https://github.com/${member.github_username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-base"
            >
              <Code className="w-5 h-5" />
              <span className="font-mono">View Profile</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TeamPreview() {
  const [currentMember, setCurrentMember] = useState(0);
  const [membersWithGitHubData, setMembersWithGitHubData] = useState([]);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(true);
  const fetchedRef = useRef(false); // Prevent React Strict Mode duplication

  const { data: apiMembers, isLoading } = useQuery({
    queryKey: ['team-preview'],
    queryFn: () => base44.entities.TeamMember.filter(
      { role: 'member' },
      'order',
      9
    ),
    initialData: [],
  });

  // Memoize base members to prevent recreation on every render
  const baseMembers = useMemo(() => {
    return apiMembers.length > 0 ? apiMembers.slice(0, 9) : teamMembers;
  }, [apiMembers]);

  // Fetch GitHub data for all members using global cache
  useEffect(() => {
    // Prevent duplicate fetching in React Strict Mode
    if (fetchedRef.current) {
      console.log('Skipping duplicate fetch (React Strict Mode)');
      return;
    }

    const fetchAllGitHubData = async () => {
      console.log('Fetching team data from serverless function');
      fetchedRef.current = true;
      setIsLoadingGitHub(true);

      try {
        // Single call to serverless function gets ALL team data
        const githubDataArray = await fetchTeamGitHubData();
        
        // Merge with base member data
        const membersWithData = baseMembers.map((member) => {
          const githubData = githubDataArray.find(
            data => data.username === member.github_username
          ) || {};

          return {
            ...member, // Keep id, username, github_username, avatar_url, role
            name: member.name, // Hardcoded from terminal members
            skills: member.skills, // Hardcoded from terminal members
            // Dynamic data from serverless API
            lastSeen: githubData.lastSeen || 'unknown',
            status: githubData.status || 'away',
            currentProject: githubData.currentProject || 'unknown',
            publicRepos: githubData.publicRepos || 0,
            followers: githubData.followers || 0,
            bio: githubData.bio || null
          };
        });

        console.log('Successfully merged serverless data with team members');
        setMembersWithGitHubData(membersWithData);
      } catch (error) {
        console.error('Error fetching from serverless:', error);
        // Fallback to base members if serverless fails
        setMembersWithGitHubData(baseMembers);
      } finally {
        setIsLoadingGitHub(false);
      }
    };

    if (baseMembers.length > 0) {
      fetchAllGitHubData();
    }

    // Cleanup function to reset fetch flag if component unmounts
    return () => {
      fetchedRef.current = false;
    };
  }, [baseMembers]);

  const displayMembers = membersWithGitHubData.length > 0 ? membersWithGitHubData : baseMembers;

  // Auto-cycle through members
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMember((prev) => (prev + 1) % displayMembers.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayMembers.length]);

  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4"
        >
          <Terminal className="w-4 h-4 text-green-500" />
          <span className="text-green-500">●</span>
          ./browse_team.sh --live-data
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-slate-900"
            >
              Team Browser
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-slate-500 font-mono text-sm mt-2"
            >
              Live GitHub data • {displayMembers.length} developers online
            </motion.div>
          </div>

          <Link to={createPageUrl('Team')}>
            <Button variant="outline" className="rounded-full group cursor-hover">
              View Full Directory
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Terminal Interface */}
        {isLoading || isLoadingGitHub ? (
          <div className="space-y-4">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-10 w-24 rounded-t-lg" />
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Skeleton className="h-64 rounded-lg" />
              <Skeleton className="h-64 rounded-lg" />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Member Tabs */}
            <MemberTabs
              members={displayMembers}
              currentMember={currentMember}
              onMemberSelect={setCurrentMember}
            />

            <div className="grid md:grid-cols-2 gap-6">
              {/* Terminal Window */}
              <TerminalWindow
                members={displayMembers}
                currentMember={currentMember}
              />

              {/* Member Card */}
              <MemberCard member={displayMembers[currentMember]} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}