// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface APIResponse<T> {
  status: string;
  creator: string;
  statusCode: number;
  statusMessage: string;
  message: string;
  ok: boolean;
  data: T;
  pagination: Pagination | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface Pagination {
  currentPage: number;
  hasPrevPage: boolean;
  prevPage: number | null;
  hasNextPage: boolean;
  nextPage: number | null;
  totalPages: number;
}

// ─── Genre ────────────────────────────────────────────────────────────────────

export interface Genre {
  title: string;
  genreId: string;
  href: string;
  otakudesuUrl: string;
}

// ─── Anime (List Item) ───────────────────────────────────────────────────────

export interface Anime {
  title: string;
  poster: string;
  episodes: number;
  releaseDay?: string;
  latestReleaseDate?: string;
  lastReleaseDate?: string;
  animeId: string;
  href: string;
  otakudesuUrl?: string;
  score?: string;
  status?: string;
  genreList?: Genre[];
}

// ─── Home Data ────────────────────────────────────────────────────────────────

export interface HomeData {
  ongoing: {
    href: string;
    otakudesuUrl: string;
    animeList: Anime[];
  };
  completed: {
    href: string;
    otakudesuUrl: string;
    animeList: Anime[];
  };
}

// ─── Anime Detail ─────────────────────────────────────────────────────────────

export interface AnimeDetail {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  producers: string;
  type: string;
  status: string;
  episodes: number | null;
  duration: string;
  aired: string;
  studios: string;
  batch: string | null;
  synopsis: {
    paragraphs: string[];
    connections: { title: string; href: string }[];
  };
  genreList: Genre[];
  episodeList: EpisodeItem[];
  recommendedAnimeList: RecommendedAnime[];
}

// ─── Episode (in anime detail episode list) ──────────────────────────────────

export interface EpisodeItem {
  title: string;
  eps: number;
  date: string;
  episodeId: string;
  href: string;
  otakudesuUrl: string;
}

// ─── Recommended Anime ───────────────────────────────────────────────────────

export interface RecommendedAnime {
  title: string;
  poster: string;
  animeId: string;
  href: string;
  otakudesuUrl: string;
}

// ─── Episode Detail (Streaming Page) ─────────────────────────────────────────

export interface EpisodeDetail {
  title: string;
  animeId: string;
  releaseTime: string;
  defaultStreamingUrl: string;
  hasPrevEpisode: boolean;
  prevEpisode: EpisodeNav | null;
  hasNextEpisode: boolean;
  nextEpisode: EpisodeNav | null;
  server: {
    qualities: StreamQuality[];
  };
  downloadUrl: {
    qualities: DownloadQuality[];
  };
  info: {
    credit: string;
    encoder: string;
    duration: string;
    type: string;
    genreList: Genre[];
    episodeList: EpisodeItem[];
  };
}

// ─── Episode Navigation ──────────────────────────────────────────────────────

export interface EpisodeNav {
  title: string;
  episodeId: string;
  href: string;
  otakudesuUrl: string;
}

// ─── Streaming Server ────────────────────────────────────────────────────────

export interface StreamQuality {
  title: string;
  serverList: StreamServer[];
}

export interface StreamServer {
  title: string;
  serverId: string;
  href: string;
}

// ─── Download ────────────────────────────────────────────────────────────────

export interface DownloadQuality {
  title: string;
  size: string;
  urls: DownloadLink[];
}

export interface DownloadLink {
  title: string;
  url: string;
}

// ─── Schedule ────────────────────────────────────────────────────────────────

export interface ScheduleDay {
  day: string;
  anime_list: ScheduleAnime[];
}

export interface ScheduleAnime {
  title: string;
  slug: string;
  url: string;
  poster: string;
  source?: string;
}

// ─── Donghua ─────────────────────────────────────────────────────────────────

export interface DonghuaItem {
  title: string;
  slug: string;
  poster: string;
  status: string;
  type: string;
  current_episode?: string;
  href: string;
  anichinUrl: string;
}

export interface DonghuaHomeData {
  latest_release: DonghuaItem[];
  completed_donghua: DonghuaItem[];
}

// ─── Search Result ───────────────────────────────────────────────────────────

export interface SearchAnime {
  title: string;
  poster: string;
  status: string;
  score: string;
  animeId: string;
  href: string;
  otakudesuUrl?: string;
  genreList?: Genre[];
  source?: string;
}

export interface SearchData {
  animeList: SearchAnime[];
}

// ─── Genre Page Data ─────────────────────────────────────────────────────────

export interface GenreListData {
  genreList: Genre[];
}

export interface GenreAnimeData {
  animeList: Anime[];
}

// ─── Batch Download ──────────────────────────────────────────────────────────

export interface BatchData {
  title: string;
  poster: string;
  japanese: string;
  score: string;
  status: string;
  downloadUrl: {
    qualities: DownloadQuality[];
  };
}

// ─── Server Embed Response ───────────────────────────────────────────────────

export interface ServerEmbedData {
  url: string;
}
