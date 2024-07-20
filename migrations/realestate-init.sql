SET timezone = 'America/Buenos_Aires';

DROP TABLE IF EXISTS post_status_history;
DROP TABLE IF EXISTS price_listing_history;
DROP TABLE IF EXISTS post;


--
--  1. Create enums
--
CREATE TYPE ammenity_property AS ENUM('none', 'own', 'community');
CREATE TYPE parking_type AS ENUM('none', 'driveway', 'garage');
CREATE TYPE supported_currencies AS ENUM('ARS', 'USD', 'EUR');
CREATE TYPE listing_status AS ENUM('ON_SALE', 'SOLD', 'ON_HOLD');


--
--  2. Create tables
--
CREATE TABLE post (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255) UNIQUE NOT NULL,
  square_meters SMALLINT NOT NULL,
  bedrooms SMALLINT NOT NULL,
  bathrooms SMALLINT NOT NULL,
  life_quality_index DECIMAL(4, 2),
  has_porch BOOLEAN NOT NULL,
  pool_type ammenity_property NOT NULL,
  barbeque_area ammenity_property NOT NULL,
  parking_space parking_type NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  status listing_status NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  currency supported_currencies NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ
);
COMMENT ON COLUMN post.life_quality_index IS 'Based on https://icv.conicet.gov.ar/ data';

CREATE TABLE post_status_history (
  id SERIAL PRIMARY KEY,
  status listing_status NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_id
    FOREIGN KEY (post_id) 
      REFERENCES post(id)
      ON DELETE CASCADE
);

CREATE TABLE price_listing_history (
  id SERIAL PRIMARY KEY,
  price DECIMAL(10, 2) NOT NULL,
  currency supported_currencies NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_post_id
    FOREIGN KEY (post_id) 
      REFERENCES post(id)
      ON DELETE CASCADE
);


--
-- 3. Create database users
--
CREATE USER app_node WITH ENCRYPTED PASSWORD 'DefaultAppNode.123';
GRANT SELECT, INSERT, UPDATE ON TABLE post TO app_node;
GRANT SELECT, INSERT, UPDATE ON TABLE post_status_history TO app_node;
GRANT SELECT, INSERT, UPDATE ON TABLE price_listing_history TO app_node;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE post_id_seq TO app_node;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE post_status_history_id_seq TO app_node;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE price_listing_history_id_seq TO app_node;


--
-- 4. Populate with initial data
--
INSERT INTO post (id, title, address, square_meters, bedrooms, bathrooms, life_quality_index, has_porch, pool_type, barbeque_area, parking_space, created_at, status, price, currency) VALUES
  (1, 'Recreational house in Plomer, Buenos Aires (village located along route 6)', 'Los Alamos 300, Plomer, General Las Heras, Buenos Aires, Argentina', 1600, 3, 1, 6.28, true, 'own', 'none', 'driveway', '2024-02-08 14:09:02.000000-03', 'ON_SALE', 100000.00, 'USD'),
  (2, 'House in General Las Heras', 'Neumi Buzzi 46, General Las Heras, Buenos Aires, Argentina', 240, 2, 1, 6.55, true, 'none', 'none', 'driveway', '2024-02-15 13:29:03.000000-03', 'SOLD', 47000.00, 'USD'),
  (3, '2 dorm house on sale with pool + guest house in Villars', 'España 400, Villars, General Las Heras, Buenos Aires, Argentina', 280, 4, 3, 6.3, true, 'own', 'own', 'driveway', '2024-01-05 19:27:20.000000-03', 'ON_HOLD', 95000.00, 'USD');

INSERT INTO post_status_history (id, status, post_id, created_at) VALUES
  (1, 'ON_SALE', 1, '2024-02-08 14:09:02.000000-03'),
  (2, 'ON_SALE', 2, '2024-02-15 13:29:03.000000-03'),
  (3, 'ON_HOLD', 2, '2024-02-20 22:19:38.000000-03'),
  (4, 'SOLD', 2, '2024-02-21 11:19:21.000000-03'),
  (5, 'ON_SALE', 3, '2024-01-05 19:27:20.000000-03'),
  (6, 'ON_HOLD', 3, '2024-01-26 13:44:10.000000-03');

INSERT INTO price_listing_history (id, price, currency, post_id, created_at) VALUES
  (1, 110000.00, 'USD', 1, '2024-02-08 14:09:02.000000-03'),
  (2, 100000.00, 'USD', 1, '2024-02-10 15:31:00.000000-03'),
  (3, 47000.00, 'USD', 2, '2024-02-15 13:29:03.000000-03'),
  (4, 95000.00, 'USD', 3, '2024-01-05 19:27:20.000000-03');
