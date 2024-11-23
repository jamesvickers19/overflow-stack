CREATE TABLE IF NOT EXISTS question (
    uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id bigint,
    title text NOT NULL,
    body text NOT NULL,
    score int,
    created_at timestamp without time zone default now()
);

CREATE TABLE IF NOT EXISTS answer (
    uuid uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    id bigint,
    question_uuid uuid REFERENCES question(uuid),
    body text NOT NULL,
    score int,
    accepted boolean,
    created_at timestamp without time zone default now()
);