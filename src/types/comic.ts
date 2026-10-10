export interface ComicListItem {
  title: string;
  slug: string;
  image: string;
  type?: string; // Manga, Manhwa, Manhua
  color?: string; // Warna, Black & White
  rating?: string;
  chapters?: {
    title: string;
    slug: string;
  }[];
}

export interface ComicDetailData {
  id?: string;
  title: string;
  image: string;
  rating?: string;
  votes?: string;
  detail?: {
    alternativeTitle?: string;
    status?: string;
    author?: string;
    illustrator?: string;
    graphic?: string;
    theme?: string;
    type?: string;
    official?: string;
  };
  genres?: {
    title: string;
    slug: string;
  }[];
  synopsis?: string;
  chapters?: {
    title: string;
    slug: string;
    date?: string;
  }[];
}

export interface ChapterImageData {
  id?: number | string;
  url: string;
}

export interface ComicChapterData {
  id?: string;
  title: string;
  thumbnail?: string;
  navigation?: {
    prev?: string | null;
    next?: string | null;
  };
  allChapterSlug?: string;
  images?: ChapterImageData[];
  komikInfo?: {
    title?: string;
    slug?: string;
  };
}

export interface ComicGenreItem {
  title: string;
  slug: string;
}
