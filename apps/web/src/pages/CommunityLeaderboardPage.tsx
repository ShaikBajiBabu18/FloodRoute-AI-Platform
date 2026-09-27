import React, { useState } from 'react';
import { ContributionBadge, LeaderboardEntry } from '@floodroute/shared';
import { Award, Trophy, Medal, Shield, Sparkles, Heart, Users, CheckCircle, ArrowRight } from 'lucide-react';

const COMMUNITY_BADGES: ContributionBadge[] = [
  {
    id: 'badge-01',
    name: 'Flood Reporter',
    description: 'Submitted 5+ accurate geotagged waterlogging hazard reports with photos.',
    icon: 'droplets',
    tier: 'BRONZE',
  },
  {
    id: 'badge-02',
    name: 'Verified Volunteer',
    description: 'Ground reports corroborated and verified by NDRF/State Disaster Analysts.',
    icon: 'shield-check',
    tier: 'SILVER',
  },
  {
    id: 'badge-03',
    name: 'Community Guardian',
    description: 'Provided life-safety alerts that guided 200+ commuters away from flooded corridors.',
    icon: 'award',
    tier: 'GOLD',
  },
  {
    id: 'badge-04',
    name: 'Emergency Helper',
    description: 'Directed citizens to open shelters and verified medical triage bed availability.',
    icon: 'heart',
    tier: 'SENTINEL',
  },
];

const LEADERBOARD_USERS: LeaderboardEntry[] = [
  { rank: 1, name: 'Team Heroshi', district: 'Chennai', reportsSubmitted: 34, reportsVerified: 31, points: 2850, badge: 'Community Guardian' },
  { rank: 2, name: 'Ananya Deshmukh', district: 'Mumbai Suburban', reportsSubmitted: 29, reportsVerified: 27, points: 2420, badge: 'Community Guardian' },
  { rank: 3, name: 'Karthik Raja', district: 'Chennai', reportsSubmitted: 24, reportsVerified: 22, points: 1980, badge: 'Verified Volunteer' },
  { rank: 4, name: 'Manish Baruah', district: 'Kamrup Metro', reportsSubmitted: 21, reportsVerified: 19, points: 1750, badge: 'Verified Volunteer' },
  { rank: 5, name: 'Pooja Hegde', district: 'Bengaluru Urban', reportsSubmitted: 18, reportsVerified: 17, points: 1520, badge: 'Emergency Helper' },
  { rank: 6, name: 'Sunil Kumar', district: 'Patna', reportsSubmitted: 15, reportsVerified: 14, points: 1260, badge: 'Flood Reporter' },
  { rank: 7, name: 'Farhan Akhtar', district: 'Hyderabad', reportsSubmitted: 13, reportsVerified: 11, points: 980, badge: 'Flood Reporter' },
];

export const CommunityLeaderboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs uppercase tracking-wider">
          <Trophy className="w-3.5 h-3.5" />
          Citizen Sentinel Community Network
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-heading text-white">
          Community Badges & Leaderboard
        </h1>
        <p className="text-sm text-slate-400">
          Recognizing the citizens, field volunteers, and civic guardians who map live flood hazards and protect commuters across India.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Civic Contribution Badges
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMUNITY_BADGES.map((badge) => (
            <div
              key={badge.id}
              className="p-6 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/50 shadow-xl space-y-3 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                  <Award className="w-6 h-6" />
                </div>
                <span
                  className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    badge.tier === 'SENTINEL'
                      ? 'bg-rose-500 text-white'
                      : badge.tier === 'GOLD'
                      ? 'bg-amber-400 text-slate-950'
                      : badge.tier === 'SILVER'
                      ? 'bg-slate-300 text-slate-950'
                      : 'bg-amber-700 text-white'
                  }`}
                >
                  {badge.tier}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-heading">{badge.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-3xl p-6 sm:p-8 bg-slate-900/90 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Top Citizen Sentinels
          </h2>
          <span className="text-xs text-slate-400 font-mono">Updated in Real-Time</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                <th className="pb-3 pl-3">Rank</th>
                <th className="pb-3">Citizen Reporter</th>
                <th className="pb-3">District</th>
                <th className="pb-3 text-center">Reports</th>
                <th className="pb-3 text-center">Verified</th>
                <th className="pb-3 text-right">Civic Score</th>
                <th className="pb-3 text-right pr-3">Honor Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {LEADERBOARD_USERS.map((u) => (
                <tr key={u.rank} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pl-3 font-mono">
                    {u.rank === 1 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold">1</span>
                    ) : u.rank === 2 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-bold">2</span>
                    ) : u.rank === 3 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white font-bold">3</span>
                    ) : (
                      <span className="text-slate-500 font-bold">#{u.rank}</span>
                    )}
                  </td>
                  <td className="py-3.5 font-bold text-slate-100 flex items-center gap-2">
                    {u.name}
                  </td>
                  <td className="py-3.5 text-slate-400">{u.district}</td>
                  <td className="py-3.5 text-center font-mono text-slate-300">{u.reportsSubmitted}</td>
                  <td className="py-3.5 text-center font-mono text-emerald-400">{u.reportsVerified}</td>
                  <td className="py-3.5 text-right font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
                    {u.points.toLocaleString()} pts
                  </td>
                  <td className="py-3.5 text-right pr-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 text-cyan-300">
                      {u.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit Report Callout */}
        <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Earn Sentinel Badges & Protect Your Neighborhood</h4>
            <p className="text-xs text-slate-400">Report flooded roads, submerged culverts, and waterlogged streets to alert your community.</p>
          </div>
          <a
            href="/report-hazard"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            Report Hazard Now <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
