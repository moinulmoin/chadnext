export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  image: string;
  shortBio: string;
};

export interface payload {
  name: string;
  email: string;
  shortBio: string;
  image?: string;
}
