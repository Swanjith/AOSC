import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function CommunityHighlight() {
  const [selectedItem, setSelectedItem] = useState(null);

  // More authentic, casual data
  const updates = [
    {
      id: 1,
      title: "SOSC Podcast is back!",
      desc: "We're doing weekly chats about whatever's on our minds - code, careers, random tech stuff",
      tag: "podcast",
      bgColor: "#f5f5f5",
      textColor: "#2d2d2d",
      members: 127,
      lastActive: "2 days ago"
    },
    {
      id: 2,
      title: "WebDev Workshop",
      desc: "Two days of building stuff from scratch. Bring your laptop and some snacks",
      tag: "workshop",
      bgColor: "#f5f5f5",
      textColor: "#2d2d2d",
      date: "Oct 17-18",
      spots: 23
    },
    {
      id: 3,
      title: "Hit 1k stars! 🎉",
      desc: "Our little project somehow got popular. Thanks everyone who starred it!",
      tag: "milestone",
      bgColor: "#f5f5f5",
      textColor: "#2d2d2d",
      count: "1,247",
      repo: "sosc-web"
    },
    {
      id: 4,
      title: "Design meetup",
      desc: "Figma tips, design systems, and probably arguing about fonts",
      tag: "design",
      bgColor: "#f5f5f5",
      textColor: "#2d2d2d",
      nextMeeting: "Friday 6pm",
      regulars: 15
    },
    {
      id: 5,
      title: "Hackathon prep",
      desc: "Getting ready for the big one next month. Team formation happening now",
      tag: "hackathon",
      bgColor: "#f5f5f5",
      textColor: "#2d2d2d",
      teams: 8,
      deadline: "Feb 15"
    }
  ];

  return (
    <div className="py-16 px-4 max-w-6xl mx-auto">
      {/* Casual header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">UPDATES</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-3">
          What's happening around here
        </h2>
        <p className="text-gray-600 text-lg">
          Latest updates from our communities and events
        </p>
      </div>

      {/* Intentionally messy but organized layout */}
      <div className="space-y-6">
        {/* First row - big + small */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="md:col-span-2 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: updates[0].bgColor, color: updates[0].textColor }}
            onClick={() => setSelectedItem(updates[0])}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${updates[0].bgColor === '#ffffff' ? 'bg-black/10 text-black' : 'bg-white/20 text-white'}`}>
                {updates[0].tag}
              </span>
              <div className="text-right text-sm opacity-90">
                <div>{updates[0].members} members</div>
                <div className="text-xs">{updates[0].lastActive}</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">{updates[0].title}</h3>
            <p className="opacity-90 leading-relaxed">{updates[0].desc}</p>
          </div>

          <div
            className="p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: updates[1].bgColor, color: updates[1].textColor }}
            onClick={() => setSelectedItem(updates[1])}
          >
            <span className={`text-xs px-2 py-1 rounded-full ${updates[1].bgColor.includes('f5f5f5') ? 'bg-gray-800/20 text-gray-800' : 'bg-white/20 text-white'}`}>
              {updates[1].tag}
            </span>
            <h3 className="text-xl font-bold mt-4 mb-3">{updates[1].title}</h3>
            <p className="opacity-90 text-sm mb-4">{updates[1].desc}</p>
            <div className="text-sm">
              <div className="font-medium">{updates[1].date}</div>
              <div className="opacity-75">{updates[1].spots} spots left</div>
            </div>
          </div>
        </div>

        {/* Second row - small + big */}
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: updates[2].bgColor, color: updates[2].textColor }}
            onClick={() => setSelectedItem(updates[2])}
          >
            <span className={`text-xs px-2 py-1 rounded-full ${updates[2].bgColor === '#ffffff' ? 'bg-black/10 text-black' : 'bg-white/20 text-white'}`}>
              {updates[2].tag}
            </span>
            <div className="mt-4 mb-3">
              <div className="text-3xl font-bold">{updates[2].count}</div>
              <div className="text-sm opacity-75">GitHub stars</div>
            </div>
            <h3 className="text-lg font-bold mb-2">{updates[2].title}</h3>
            <p className="opacity-90 text-sm">{updates[2].desc}</p>
          </div>

          <div
            className="md:col-span-2 p-6 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform"
            style={{ backgroundColor: updates[3].bgColor, color: updates[3].textColor }}
            onClick={() => setSelectedItem(updates[3])}
          >
            <div className="flex justify-between items-start mb-4">
              <span className={`text-xs px-2 py-1 rounded-full ${updates[3].bgColor === '#ffffff' ? 'bg-black/10 text-black' : 'bg-white/20 text-white'}`}>
                {updates[3].tag}
              </span>
              <div className="text-right text-sm opacity-90">
                <div>{updates[3].nextMeeting}</div>
                <div className="text-xs">{updates[3].regulars} regulars</div>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">{updates[3].title}</h3>
            <p className="opacity-90 leading-relaxed">{updates[3].desc}</p>
          </div>
        </div>

        {/* Third row - single wide */}
        <div
          className="p-6 rounded-xl cursor-pointer hover:scale-[1.01] transition-transform"
          style={{ backgroundColor: updates[4].bgColor, color: updates[4].textColor }}
          onClick={() => setSelectedItem(updates[4])}
        >
          <div className="flex justify-between items-start mb-4">
            <span className={`text-xs px-2 py-1 rounded-full ${updates[4].bgColor.includes('e5e5e5') ? 'bg-gray-800/20 text-gray-800' : 'bg-white/20 text-white'}`}>
              {updates[4].tag}
            </span>
            <div className="text-right text-sm opacity-90">
              <div>{updates[4].teams} teams formed</div>
              <div className="text-xs">Deadline: {updates[4].deadline}</div>
            </div>
          </div>
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-3">{updates[4].title}</h3>
            <p className="opacity-90 leading-relaxed">{updates[4].desc}</p>
          </div>
        </div>
      </div>

      {/* Simple modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{selectedItem.tag}</span>
              <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold mb-3">{selectedItem.title}</h3>
            <p className="text-gray-600 mb-4">{selectedItem.desc}</p>
            <div className="text-sm text-gray-500 space-y-1">
              {selectedItem.members && <div>Members: {selectedItem.members}</div>}
              {selectedItem.date && <div>Date: {selectedItem.date}</div>}
              {selectedItem.count && <div>Stars: {selectedItem.count}</div>}
              {selectedItem.nextMeeting && <div>Next: {selectedItem.nextMeeting}</div>}
              {selectedItem.teams && <div>Teams: {selectedItem.teams}</div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}