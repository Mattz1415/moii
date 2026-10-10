export interface BaseApiResponse<T> {
  status?: string;
  creator?: string;
  statusCode?: number;
  statusMessage?: string;
  message?: string;
  ok?: boolean;
  data: T;
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    nextPage?: number | null;
    prevPage?: number | null;
  } | null;
}

export interface AnimeItem {
  title: string;
  poster: string;
  episodes?: number | string | null;
  releaseDay?: string;
  latestReleaseDate?: string;
  score?: string;
  lastReleaseDate?: string;
  animeId: string;
  href?: string;
  otakudesuUrl?: string;
  status?: string;
  type?: string;
}

export interface HomeAnimeData {
  ongoing: {
    href: string;
    otakudesuUrl: string;
    animeList: AnimeItem[];
  };
  completed: {
    href: string;
    otakudesuUrl: string;
    animeList: AnimeItem[];
  };
}

export interface ScheduleDay {
  day: string;
  anime_list: {
    title: string;
    slug: string;
    url: string;
    poster: string;
  }[];
}

export interface AnimeGenre {
  title: string;
  genreId: string;
  href: string;
  otakudesuUrl?: string;
}

export interface EpisodeListItem {
  title: string;
  eps?: number | string;
  date?: string;
  episodeId: string;
  href?: string;
  otakudesuUrl?: string;
}

export interface AnimeDetailData {
  title: string;
  poster: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  episodes?: number | null;
  duration?: string;
  aired?: string;
  studios?: string;
  batch?: {
    title?: string;
    batchId?: string;
    href?: string;
    otakudesuUrl?: string;
  } | null;
  synopsis?: {
    paragraphs?: string[];
    connections?: string[];
  } | string;
  genreList?: AnimeGenre[];
  episodeList?: EpisodeListItem[];
  recommendedAnimeList?: AnimeItem[];
}

export interface StreamServerItem {
  title: string;
  serverId: string;
  href?: string;
  url?: string;
}

export interface StreamQuality {
  title: string;
  serverList: StreamServerItem[];
}

export interface DownloadUrlMirror {
  title: string;
  url: string;
}

export interface DownloadQuality {
  title: string;
  size?: string;
  urls: DownloadUrlMirror[];
}

export interface EpisodeDetailData {
  title: string;
  animeId: string;
  releaseTime?: string;
  defaultStreamingUrl?: string;
  hasPrevEpisode?: boolean;
  prevEpisode?: {
    title?: string;
    episodeId?: string;
    href?: string;
  } | null;
  hasNextEpisode?: boolean;
  nextEpisode?: {
    title?: string;
    episodeId?: string;
    href?: string;
  } | null;
  server?: {
    qualities: StreamQuality[];
  };
  downloadUrl?: {
    qualities: DownloadQuality[];
  };
  info?: {
    credit?: string;
    encoder?: string;
    duration?: string;
    type?: string;
    genre?: string;
    episode?: string;
  };
}

export interface DonghuaHomeItem {
  title: string;
  slug: string;
  poster: string;
  episode?: string;
  type?: string;
  status?: string;
}

export interface DonghuaEpisodeData {
  episode: string;
  streaming?: {
    main_url?: {
      name: string;
      url: string;
    };
    servers?: {
      name: string;
      url: string;
    }[];
  };
  downloads?: {
    resolution: string;
    links: {
      server: string;
      url: string;
    }[];
  }[];
}
