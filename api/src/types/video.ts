export interface Video {
  id: string;
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
  duration?: number;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface VideoInput {
  title: string;
  description: string;
  filename: string;
  thumbnail?: string;
}