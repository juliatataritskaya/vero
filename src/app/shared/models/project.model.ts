export interface IProject {
  id: number;
  name: string;
  description: string;
  miniImageUrl: string;
  imageUrls: Array<string>;
  videoUrl: string;
  arObjectInfo: object;
  planInfo: object;
  rooms: Array<object>;
}
