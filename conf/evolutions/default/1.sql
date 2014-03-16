# --- !Ups

CREATE TABLE IF NOT EXISTS sticky_notes (
  id SERIAL PRIMARY KEY,
  text varchar (256),
  px INT,
  py INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('note A',10,100,NOW(),NOW());
INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('note B',200,200,NOW(),NOW());
INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('note C',50,300,NOW(),NOW());

# --- !Downs

DROP TABLE IF EXISTS sticky_notes;

