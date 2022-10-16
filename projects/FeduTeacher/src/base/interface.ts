import DPlayer from "dplayer";

interface User {
  user: any;
}

export { User };

export interface FormTable {
  validate: (call: (valid: boolean) => void) => void;
}

interface VideoPlayerOptions {
  live?: boolean;
  autoPlay?: boolean;
}
export interface VideoPlayer {
  init: (url: string, options: VideoPlayerOptions) => DPlayer;
}

export interface Menu {
  name: string;
  color: string;
  icon: string;
  show: boolean;
  title: string;
}

export interface ImgResponse {
  url: string;
  blob: Blob;
}
