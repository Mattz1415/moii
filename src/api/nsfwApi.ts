import { axiosClient } from './axiosClient';
import type { NekoHentaiItem, NekoReleaseItem, NekoDetailData } from '../types/nsfw';

export const nsfwApi = {
  getLatestHentai: async (page = 1) => {
    const res = await axiosClient.get<{
      status: string;
      source?: string;
      pagination?: {
        current_page: number;
        total_pages: number;
        has_next: boolean;
      };
      data: NekoHentaiItem[];
    }>(`/anime/nekopoi/latest-hentai?page=${page}`);
    return res.data;
  },

  getLatestJav: async (page = 1) => {
    const res = await axiosClient.get<{
      status: string;
      source?: string;
      pagination?: {
        current_page: number;
        total_pages: number;
        has_next: boolean;
      };
      data: NekoHentaiItem[];
    }>(`/anime/nekopoi/latest-jav?page=${page}`);
    return res.data;
  },

  getHentaiList: async () => {
    const res = await axiosClient.get<{
      status: string;
      data: NekoHentaiItem[];
    }>('/anime/nekopoi/hentai-list');
    return res.data;
  },

  getNekoReleases: async (page = 1) => {
    const res = await axiosClient.get<{
      status: string;
      result: NekoReleaseItem[];
    }>(`/anime/neko/release/${page}`);
    return res.data;
  },

  searchNeko: async (query: string) => {
    const res = await axiosClient.get<{
      status: string;
      result: NekoReleaseItem[];
    }>(`/anime/neko/search/${encodeURIComponent(query)}`);
    return res.data;
  },

  getNekoDetail: async (url: string) => {
    const res = await axiosClient.get<NekoDetailData>(
      `/anime/neko/get?url=${encodeURIComponent(url)}`
    );
    return res.data;
  },
};
