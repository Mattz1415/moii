import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, AlertCircle, Search, Flame } from 'lucide-react';
import { animeApi } from '../api/animeApi';
import { AnimeCard } from '../components/cards/AnimeCard';
import { SkeletonCard } from '../components/cards/SkeletonCard';
import { Tabs } from '../components/ui/Tabs';

export const SchedulePage: React.FC = () => {
  const { data: scheduleData, isLoading, isError } = useQuery({
    queryKey: ['animeSchedule'],
    queryFn: () => animeApi.getSchedule(),
  });

  const schedules = useMemo(() => scheduleData?.data || [], [scheduleData]);

  // Map English JS day to Indonesian day matching API
  const todayIndoDay = useMemo(() => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date().getDay()];
  }, []);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [scheduleSearch, setScheduleSearch] = useState<string>('');

  // Derived active day without triggering cascading effect render
  const activeDay = useMemo(() => {
    if (selectedDay) return selectedDay;
    if (schedules.length > 0) {
      const match = schedules.find((s) => s.day === todayIndoDay);
      return match ? match.day : schedules[0].day;
    }
    return todayIndoDay || 'Senin';
  }, [selectedDay, schedules, todayIndoDay]);

  const tabs = useMemo(() => {
    return schedules.map((item) => ({
      id: item.day,
      label: item.day === todayIndoDay ? `${item.day} (Today)` : item.day,
      count: item.anime_list.length,
    }));
  }, [schedules, todayIndoDay]);

  const currentSchedule = schedules.find((s) => s.day === activeDay);

  const displayedAnimeList = useMemo(() => {
    if (!currentSchedule) return [];
    if (!scheduleSearch.trim()) return currentSchedule.anime_list;

    const q = scheduleSearch.toLowerCase();
    return currentSchedule.anime_list.filter((a) =>
      a.title.toLowerCase().includes(q)
    );
  }, [currentSchedule, scheduleSearch]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 sm:space-y-8 pb-24">
      {/* Page Header */}
      <div className="space-y-4 border-b border-zinc-850 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>Broadcast Timetable</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
              Weekly Anime Schedule
            </h1>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Track airing days for current seasonal simulcasts. Broadcasts are scheduled in Western Indonesian Time (WIB).
            </p>
          </div>

          {/* Quick Search on Schedule */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder={`Search ${activeDay} titles...`}
              value={scheduleSearch}
              onChange={(e) => setScheduleSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Days Tabs (Touch-scrollable on mobile/tablet) */}
      {tabs.length > 0 && (
        <Tabs
          tabs={tabs}
          activeTab={activeDay}
          onChange={(id) => {
            setSelectedDay(id);
            setScheduleSearch('');
          }}
          className="max-w-full"
        />
      )}

      {/* Grid of Scheduled Anime */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          <SkeletonCard count={12} />
        </div>
      ) : isError ? (
        <div className="p-8 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-xs text-zinc-400">Failed to load weekly schedule timetable.</p>
        </div>
      ) : displayedAnimeList.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {currentSchedule?.day} Airing Roster ({displayedAnimeList.length} Shows)
              </span>
            </div>

            {currentSchedule?.day === todayIndoDay && (
              <span className="px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 font-mono text-[10px] flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500" />
                <span>AIRING TODAY</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {displayedAnimeList.map((anime) => (
              <AnimeCard
                key={anime.slug}
                title={anime.title}
                poster={anime.poster}
                slug={anime.slug}
                releaseDay={currentSchedule?.day}
                type="Simulcast"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-xs text-zinc-500 space-y-2">
          <p>No titles found matching &quot;{scheduleSearch}&quot; for {activeDay}.</p>
          <button
            onClick={() => setScheduleSearch('')}
            className="px-3 py-1.5 text-xs rounded bg-zinc-800 text-zinc-300"
          >
            Clear Filter
          </button>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
