import { axiosClient } from './axiosClient';
import type {
  BaseApiResponse,
  HomeAnimeData,
  ScheduleDay,
  AnimeGenre,
  AnimeDetailData,
  EpisodeDetailData,
  DonghuaHomeItem,
  DonghuaEpisodeData,
  AnimeItem,
} from '../types/anime';

export const animeApi = {
  // Main Anime (Otakudesu)
  getHome: async () => {
    const res = await axiosClient.get<BaseApiResponse<HomeAnimeData>>('/anime/home');
    return res.data;
  },

  getSchedule: async () => {
    const res = await axiosClient.get<BaseApiResponse<ScheduleDay[]>>('/anime/schedule');
    return res.data;
  },

  getOngoing: async (page = 1) => {
    const res = await axiosClient.get<BaseApiResponse<{ animeList: AnimeItem[] }>>(
      `/anime/ongoing-anime?page=${page}`
    );
    return res.data;
  },

  getCompleted: async (page = 1) => {
    const res = await axiosClient.get<BaseApiResponse<{ animeList: AnimeItem[] }>>(
      `/anime/complete-anime?page=${page}`
    );
    return res.data;
  },

  getGenres: async () => {
    const res = await axiosClient.get<BaseApiResponse<{ genreList: AnimeGenre[] }>>('/anime/genre');
    return res.data;
  },

  getAnimeByGenre: async (genreSlug: string, page = 1) => {
    const res = await axiosClient.get<BaseApiResponse<{ animeList: AnimeItem[] }>>(
      `/anime/genre/${genreSlug}?page=${page}`
    );
    return res.data;
  },

  getAnimeDetail: async (slug: string) => {
    const res = await axiosClient.get<BaseApiResponse<AnimeDetailData>>(`/anime/anime/${slug}`);
    return res.data;
  },

  getEpisode: async (slug: string) => {
    const res = await axiosClient.get<BaseApiResponse<EpisodeDetailData>>(`/anime/episode/${slug}`);
    return res.data;
  },

  getServerUrl: async (serverId: string) => {
    const res = await axiosClient.get<BaseApiResponse<{ url: string }>>(`/anime/server/${serverId}`);
    return res.data;
  },

  getBatch: async (slug: string) => {
    const res = await axiosClient.get<BaseApiResponse<unknown>>(`/anime/batch/${slug}`);
    return res.data;
  },

  searchAnime: async (keyword: string) => {
    const res = await axiosClient.get<BaseApiResponse<{ animeList: AnimeItem[] }>>(
      `/anime/search/${encodeURIComponent(keyword)}`
    );
    return res.data;
  },

  // Donghua
  getDonghuaHome: async () => {
    const res = await axiosClient.get<{
      status: string;
      latest_release: DonghuaHomeItem[];
    }>('/anime/donghua/home');
    return res.data;
  },

  getDonghuaOngoing: async () => {
    const res = await axiosClient.get<{
      status: string;
      ongoing: DonghuaHomeItem[];
    }>('/anime/donghua/ongoing');
    return res.data;
  },

  getDonghuaDetail: async (slug: string) => {
    const res = await axiosClient.get<BaseApiResponse<unknown>>(`/anime/donghua/detail/${slug}`);
    return res.data;
  },

  getDonghuaEpisode: async (slug: string) => {
    const res = await axiosClient.get<DonghuaEpisodeData>(`/anime/donghua/episode/${slug}`);
    return res.data;
  },
};
