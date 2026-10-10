import { axiosClient } from './axiosClient';
import type {
  ComicListItem,
  ComicDetailData,
  ComicChapterData,
  ComicGenreItem,
} from '../types/comic';

export const comicApi = {
  getLatestComics: async (page = 1) => {
    const res = await axiosClient.get<{
      success: boolean;
      pagination: {
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        nextPage: number | null;
      };
      komikList: ComicListItem[];
    }>(`/comic/komikindo/latest/${page}`);
    return res.data;
  },

  getComicDetail: async (slug: string) => {
    const res = await axiosClient.get<{
      success: boolean;
      data: ComicDetailData;
    }>(`/comic/komikindo/detail/${slug}`);
    return res.data;
  },

  getChapter: async (slug: string) => {
    const res = await axiosClient.get<{
      success: boolean;
      data: ComicChapterData;
    }>(`/comic/komikindo/chapter/${slug}`);
    return res.data;
  },

  searchComics: async (query: string, page = 1) => {
    const res = await axiosClient.get<{
      success: boolean;
      pagination?: {
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
      };
      komikList: ComicListItem[];
    }>(`/comic/komikindo/search/${encodeURIComponent(query)}/${page}`);
    return res.data;
  },

  getGenres: async () => {
    const res = await axiosClient.get<{
      success: boolean;
      genreList: ComicGenreItem[];
    }>('/comic/komikindo/genres');
    return res.data;
  },
};
