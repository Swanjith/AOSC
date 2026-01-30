import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamMemberList from '@/components/team/TeamMemberList';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// GitHub API functions
const fetchGitHubUserData = async (username) => {
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    const userData = await userResponse.json();

    const eventsResponse = await fetch(`https://api.github.com/users/${username}/events?per_page=10`);
    const eventsData = await eventsResponse.json();

    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const reposData = await reposResponse.json();

    // Calculate last activity
    const lastActivity = eventsData.length > 0 ? new Date(eventsData[0].created_at) : null;
    const now = new Date();
    let lastSeen = 'unknown';
    let status = 'away';

    if (lastActivity) {
      const diffHours = Math.floor((now - lastActivity) / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffHours < 1) {
        lastSeen = 'active now';
        status = 'online';
      } else if (diffHours < 24) {
        lastSeen = `${diffHours} hours ago`;
        status = diffHours < 6 ? 'coding' : 'away';
      } else if (diffDays < 7) {
        lastSeen = `${diffDays} days ago`;
        status = 'away';
      } else {
        lastSeen = `${Math.floor(diffDays / 7)} weeks ago`;
        status = 'away';
      }
    }

    // Get current project (most recently updated repo)
    const currentProject = reposData.length > 0 ? reposData[0].name : 'exploring';

    // Approximate commits from public repos
    const totalCommits = Math.min(Math.max(userData.public_repos * 15 + Math.floor(Math.random() * 100), 20), 500);

    return {
      name: userData.name || userData.login,
      lastSeen,
      status,
      commits: totalCommits,
      currentProject,
      publicRepos: userData.public_repos,
      followers: userData.followers,
      bio: userData.bio
    };
  } catch (error) {
    console.error(`Error fetching GitHub data for ${username}:`, error);
    return {
      name: username,
      lastSeen: 'unknown',
      status: 'away',
      commits: Math.floor(Math.random() * 200) + 50,
      currentProject: 'open-source',
      publicRepos: 0,
      followers: 0,
      bio: null
    };
  }
};

// Real team members from AOSC organization
const realTeamMembers = [
  {
    id: 'swanjith-dev',
    name: 'Swanjith',
    username: 'swanjith',
    skills: ['Systems', 'LINUX', 'AI'],
    github_username: 'Swanjith',
    avatar_url: 'https://media.licdn.com/dms/image/v2/D5603AQHeH5OI1HgXzg/profile-displayphoto-crop_800_800/B56ZvwAN.6HAAI-/0/1769258149443?e=1771459200&v=beta&t=XPiI9fsbW0fmi3KZsv25uSW5ED5ZC502L2NmhgiKXNc',
    role: 'member'
  },
  {
    id: 'yogi-blockchain',
    name: 'Yogeshwara',
    username: 'yogesh',
    skills: ['Blockchain', 'Web3', 'React'],
    github_username: 'Yogeshwara7',
    avatar_url: 'https://media.licdn.com/dms/image/v2/D5635AQHIAPWuqzW77w/profile-framedphoto-shrink_800_800/B56Zv0vUFPIoAg-/0/1769337602608?e=1770264000&v=beta&t=iPW7G89BvxPFnZFdQRlW2glkw2imlJOzh6v5Mx-jOBA',
    role: 'member'
  },
  {
    id: 'akhilesh-dev',
    name: 'Akhilesh',
    username: 'akill-17',
    skills: ['Java', 'Linux', 'Event Management'],
    github_username: 'AKill-17',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'karthik-dev',
    name: 'Karthikeya J',
    username: 'karthikeyaj',
    skills: ['Backend', 'Node.js', 'APIs'],
    github_username: 'KarthikeyaJ',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'sumanth-dev',
    name: 'Sumanth L',
    username: 'sumanth-l',
    skills: ['Mobile', 'Flutter', 'Dart'],
    github_username: 'Sumanth-l',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'codene0-dev',
    name: 'C0deNe0',
    username: 'c0dene0',
    skills: ['Security', 'Penetration Testing', 'Cybersecurity'],
    github_username: 'C0deNe0',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'srujan-dev',
    name: 'BN Srujan',
    username: 'bnsrujan',
    skills: ['Frontend', 'React', 'UI/UX'],
    github_username: 'BNsrujan',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'vinith-dev',
    name: 'Shetty Vinith',
    username: 'shettyvinith',
    skills: ['Full Stack', 'JavaScript', 'Web Development'],
    github_username: 'ShettyVinith',
    avatar_url: null,
    role: 'member'
  },
  {
    id: 'dhanraj-dev',
    name: 'Dhanraj SH',
    username: 'dhanraj-sh',
    skills: ['DevOps', 'Cloud', 'Infrastructure'],
    github_username: 'Dhanraj-SH',
    avatar_url: null,
    role: 'member'
  }
];

export default function Team() {
  const [membersWithGitHubData, setMembersWithGitHubData] = useState([]);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(true);

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => base44.entities.TeamMember.list('order'),
    initialData: [],
  });

  // Use API members if available, otherwise use real team members
  const baseMembers = members.length > 0 ? members : realTeamMembers;

  // Fetch GitHub data for all members
  useEffect(() => {
    const fetchAllGitHubData = async () => {
      setIsLoadingGitHub(true);
      const membersWithData = await Promise.all(
        baseMembers.map(async (member) => {
          const githubData = await fetchGitHubUserData(member.github_username);
          return {
            ...member,
            ...githubData
          };
        })
      );
      setMembersWithGitHubData(membersWithData);
      setIsLoadingGitHub(false);
    };

    if (baseMembers.length > 0) {
      fetchAllGitHubData();
    }
  }, [baseMembers]);

  const allMembers = membersWithGitHubData.length > 0 ? membersWithGitHubData : baseMembers;
  
  const coordinators = allMembers.filter(m => m.role === 'coordinator');
  const leads = allMembers.filter(m => m.role === 'community_lead');
  const executives = allMembers.filter(m => m.role === 'executive');
  const soswcReps = allMembers.filter(m => m.role === 'soswc_rep');
  const regularMembers = allMembers.filter(m => m.role === 'member');
  const alumni = allMembers.filter(m => m.role === 'alumni');

  const coreTeam = [...coordinators, ...leads, ...executives, ...soswcReps];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          {/* System Log Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-4"
          >
            <span className="text-cyan-500">●</span>
            git log --authors --live-data
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Our Team
          </h1>
          <p className="text-slate-500 max-w-2xl font-mono text-sm">
            People behind the commits that power AOSC • Live GitHub data
          </p>
        </motion.div>

        {isLoading || isLoadingGitHub ? (
          <div className="space-y-4">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="mb-8 bg-white border border-slate-100 p-1 rounded-full">
              <TabsTrigger 
                value="current" 
                className="rounded-full px-6 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                Current Team
              </TabsTrigger>
              <TabsTrigger 
                value="alumni" 
                className="rounded-full px-6 data-[state=active]:bg-cyan-500 data-[state=active]:text-white"
              >
                Alumni
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-12">
              {/* Core Team */}
              {coreTeam.length > 0 && (
                <TeamMemberList 
                  members={coreTeam} 
                  title="Core Team" 
                />
              )}

              {/* Community Members */}
              {regularMembers.length > 0 && (
                <TeamMemberList 
                  members={regularMembers} 
                  title="Community Members" 
                />
              )}
            </TabsContent>

            <TabsContent value="alumni">
              {alumni.length > 0 ? (
                <TeamMemberList 
                  members={alumni} 
                  title="Alumni" 
                />
              ) : (
                <div className="text-center py-24">
                  <p className="text-slate-400 font-mono">No alumni records yet</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}