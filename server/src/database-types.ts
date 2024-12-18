// Contains types representing the database schema, for use with the Kysely library.

import { Insertable, Selectable } from "kysely";

export interface Database {
  answer: AnswerTable;
  question: QuestionTable;
}

export interface QuestionTable {
  uuid?: string;
  id?: number;
  title: string;
  body: string;
  content_tsvector?: string;
  created_at?: Date;
}

export interface AnswerTable {
  uuid?: string;
  id?: number;
  body: string;
  question_uuid: string;
  created_at?: Date;
}

export type Question = Selectable<QuestionTable>;
export type NewQuestion = Insertable<QuestionTable>;

export type Answer = Selectable<AnswerTable>;
export type NewAnswer = Insertable<AnswerTable>;
