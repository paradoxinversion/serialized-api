-- XXX: KEEP THIS FILE FOR SCHEMA REFERENCE

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  screen_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  first_name CHAR(60) NOT NULL,
  last_name CHAR(60) NOT NULL,
  password VARCHAR NOT NULL,
  birthdate DATE NOT NULL,
  join_date DATE NOT NULL,
  biography VARCHAR
);

CREATE TABLE genres(
  id SERIAL PRIMARY KEY,
  genre VARCHAR
);
CREATE TABLE roles(
  id SERIAL PRIMARY KEY,
  role VARCHAR NOT NULL
);
CREATE TABLE users_roles(
  user_id INT REFERENCES users(id),
  role_id INT REFERENCES roles(id)
);

CREATE TABLE serials(
  id SERIAL PRIMARY KEY,
  author_id INT REFERENCES users(id),
  name VARCHAR NOT NULL,
  description VARCHAR NOT NULL,
  serial_genre INT REFERENCES genres(id),
  synopsis VARCHAR NOT NULL,
  nsfw BOOLEAN NOT NULL,
  creation_date DATE NOT NULL
);

CREATE TABLE serial_parts(
  id SERIAL PRIMARY KEY,
  serial_id INT REFERENCES serials(id),
  name VARCHAR,
  content VARCHAR NOT NULL,
  creation_date DATE NOT NULL
);

CREATE TABLE serials_ratings(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  rating INT NOT NULL,
  serial_id INT REFERENCES serials(id)
);
CREATE TABLE serial_parts_ratings(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  rating INT NOT NULL,
  serial_id INT REFERENCES serials(id),
  serial_part_id INT REFERENCES serial_parts(id)
);
CREATE TABLE serials_comments(
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  content TEXT NOT NULL,
  serial_id INT REFERENCES serials(id)
 );
 CREATE TABLE serial_parts_comments(
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id),
   content TEXT NOT NULL,
   serial_id INT REFERENCES serials(id),
   serial_part_id INT REFERENCES serial_parts(id)
);
 CREATE TABLE serials_likes(
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id),
   serial_id INT REFERENCES serials(id),
   like_date DATE NOT NULL
 );

 CREATE TABLE serial_parts_likes(
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id),
   serial_id INT REFERENCES serials(id),
   serial_part_id INT REFERENCES serial_parts(id),
   like_date DATE NOT NULL
 );

 CREATE TABLE serial_subscriptions(
   id SERIAL PRIMARY KEY,
   user_id INT REFERENCES users(id),
   serial_id INT REFERENCES serials(id)
 );

 INSERT INTO
   roles(role)
 VALUES
   ('Administrator'),
   ('Reader'),
   ('Author')
