export type Question = {
  uuid?: string;
  id?: number;
  title: string;
  body: string;
  creation: number;
  score: number;
  answers: Answer[];
};

export type Answer = {
  uuid?: string;
  id?: number;
  body: string;
  //creation: number;
  score?: number;
  accepted?: boolean;
};
