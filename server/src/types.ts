// Domain types, separated from the database types for decoupling.

export type Question = {
  uuid?: string;
  id?: number;
  title: string;
  body: string;
  answers: Answer[];
  createdAt?: Date;
};

export type Answer = {
  uuid?: string;
  id?: number;
  body: string;
  createdAt?: Date;
};
