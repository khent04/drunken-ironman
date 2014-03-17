# --- !Ups

CREATE TABLE IF NOT EXISTS sticky_notes (
  id SERIAL PRIMARY KEY,
  text varchar (256),
  theme_id varchar (16) DEFAULT '',
  px INT,
  py INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('sticky note !',10,100,NOW(),NOW());
INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('sticky note !',200,200,NOW(),NOW());
INSERT INTO sticky_notes (text,px,py,created_at,updated_at) VALUES ('sticky note !',50,300,NOW(),NOW());

# --- !Downs

DROP TABLE IF EXISTS sticky_notes;

