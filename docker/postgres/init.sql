CREATE TABLE IF NOT EXISTS question (
    uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id bigint,
    title text NOT NULL,
    body text NOT NULL,
    score int,
    created_at timestamp without time zone default now(),
    content_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED
);

CREATE INDEX idx_question_content_tsvector ON question USING gin(content_tsvector);

CREATE TABLE IF NOT EXISTS answer (
    uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id bigint,
    question_uuid uuid REFERENCES question(uuid),
    body text NOT NULL,
    score int,
    accepted boolean,
    created_at timestamp without time zone default now(),
    content_tsvector tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED
);

CREATE INDEX idx_answer_content_tsvector ON answer USING gin(content_tsvector);
