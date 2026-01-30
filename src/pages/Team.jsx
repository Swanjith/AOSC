import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import TeamMemberCard from '@/components/team/TeamMemberCard';
import TeamMemberList from '@/components/team/TeamMemberList';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTeamGitHubData } from '@/utils/serverlessCache';
import { teamMembers } from '@/data/teamMembers';

export default function Team() {
  const [membersWithGitHubData, setMembersWithGitHubData] = useState([]);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState(true);

  const { data: members, isLoading } = useQuery({
    queryKey: ['team-members'],
    queryFn: () => base44.entities.TeamMember.list('order'),
    initialData: [],
  });

  // Use API members if available, otherwise use shared team members data
  const baseMembers = members.length > 0 ? members : teamMembers;

  // Fetch GitHub data using serverless function
  useEffect(() => {
    const fetchAllGitHubData = async () => {
      setIsLoadingGitHub(true);
      try {
        // Get GitHub data from serverless function
        const githubDataArray = await fetchTeamGitHubData();
        
        // Merge with base member data
        const membersWithData = baseMembers.map(member => {
          const githubData = githubDataArray.find(
            gh => gh.username.toLowerCase() === member.github_username?.toLowerCase()
          );
          
          return {
            ...member,
            ...githubData,
            // Keep original member data as fallback
            name: member.name || githubData?.name,
            lastSeen: githubData?.lastSeen || 'unknown',
            status: githubData?.status || 'away',
            currentProject: githubData?.currentProject || 'exploring',
            publicRepos: githubData?.publicRepos || 0,
            followers: githubData?.followers || 0,
            bio: githubData?.bio || null
          };
        });
        
        setMembersWithGitHubData(membersWithData);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        // Use base members as fallback
        setMembersWithGitHubData(baseMembers);
      } finally {
        setIsLoadingGitHub(false);
      }
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