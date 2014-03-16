# --- !Ups

CREATE TABLE IF NOT EXISTS sticky_notes (
  id SERIAL PRIMARY KEY,
  text varchar (256),
  created_at TIMESTAMP
);

INSERT INTO sticky_notes (text,created_at) VALUES ('note A',NOW());
INSERT INTO sticky_notes (text,created_at) VALUES ('note B',NOW());
INSERT INTO sticky_notes (text,created_at) VALUES ('note C',NOW());

# --- !Downs

DROP TABLE IF EXISTS sticky_notes;

