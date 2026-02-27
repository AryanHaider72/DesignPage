export interface ImageGetApiResponse {
  imagesList: ImageListID[];
}

export type ImageListID = {
  urlID: string;
  url: string;
};

export interface ImageApiRequest {
  imgList: ImagesList[];
}

// A single product record
export type ImagesList = {
  url: string;
};

export interface ResponseImageProductData {
  status: string;
  message?: string;
}
