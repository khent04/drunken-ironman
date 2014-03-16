# --- !Ups

CREATE TABLE IF NOT EXISTS sticky_notes (
  id SERIAL PRIMARY KEY,
  text varchar (256)
);


# --- !Downs

DROP TABLE IF EXISTS sticky_notes;

