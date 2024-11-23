export type Question = {
  uuid?: string;
  id?: number;
  title: string;
  body: string;
  score: number;
  answers: Answer[];
  createdAt?: Date;
};

export type Answer = {
  uuid?: string;
  id?: number;
  body: string;
  score?: number;
  accepted?: boolean;
  createdAt?: Date;
};
