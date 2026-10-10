export interface NekoHentaiItem {
  title: string;
  slug: string;
  url?: string;
  image?: string;
  thumbnail?: string;
  uploaded?: string;
  genres?: string[];
  type?: string;
  views?: string;
}

export interface NekoReleaseItem {
  title: string;
  url: string;
  slug?: string;
  thumb?: string;
  uploadDate?: string;
}

export interface NekoDetailData {
  title: string;
  stream_url?: string;
  streams?: {
    name: string;
    url: string;
  }[];
  synopsis?: string;
  thumbnail?: string;
  info?: {
    producers?: string;
    genre?: string;
    duration?: string;
    type?: string;
    status?: string;
  };
  downloads?: {
    resolution: string;
    links: {
      server: string;
      url: string;
    }[];
  }[];
}
