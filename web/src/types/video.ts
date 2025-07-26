export type Video = {
  id: string;
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
  duration?: number;
  uploadedAt: Date;
  updatedAt: Date;
}

export type VideoInput = {
  title: string;
  description: string;
  file: File;
  thumbnail?: File;
}