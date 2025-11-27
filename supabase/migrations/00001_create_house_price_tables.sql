/*
# Create House Price Prediction Tables

## 1. New Tables

### predictions
Stores all property price prediction requests and results
- `id` (uuid, primary key)
- `city` (text, not null)
- `locality` (text, not null)
- `pincode` (text)
- `bhk` (integer, not null)
- `total_area` (numeric, not null, in sqft)
- `bathrooms` (integer, not null)
- `floor_number` (integer)
- `total_floors` (integer)
- `property_age` (integer, in years)
- `furnishing_status` (text, not null)
- `parking` (boolean, default false)
- `facing_direction` (text)
- `has_lift` (boolean, default false)
- `has_security` (boolean, default false)
- `has_power_backup` (boolean, default false)
- `predicted_min_price` (numeric)
- `predicted_avg_price` (numeric)
- `predicted_max_price` (numeric)
- `predicted_fair_value` (numeric)
- `price_per_sqft` (numeric)
- `confidence_score` (numeric)
- `created_at` (timestamptz, default now())

### comparables
Stores similar properties data for comparison
- `id` (uuid, primary key)
- `city` (text, not null)
- `locality` (text, not null)
- `bhk` (integer, not null)
- `total_area` (numeric, not null)
- `bathrooms` (integer)
- `property_age` (integer)
- `furnishing_status` (text)
- `price` (numeric, not null)
- `price_per_sqft` (numeric)
- `created_at` (timestamptz, default now())

### market_trends
Stores historical market trend data
- `id` (uuid, primary key)
- `city` (text, not null)
- `locality` (text)
- `month` (text, not null)
- `year` (integer, not null)
- `avg_price` (numeric, not null)
- `avg_price_per_sqft` (numeric)
- `total_transactions` (integer)
- `created_at` (timestamptz, default now())

### training_data
Stores uploaded training datasets for ML model
- `id` (uuid, primary key)
- `file_name` (text, not null)
- `file_size` (integer)
- `upload_date` (timestamptz, default now())
- `status` (text, default 'uploaded')
- `records_count` (integer)

## 2. Security
- No RLS enabled - public access for all tables
- All users can read and write data
- Admin functionality controlled at application level

## 3. Indexes
- Create indexes on frequently queried columns for performance
*/

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  locality text NOT NULL,
  pincode text,
  bhk integer NOT NULL,
  total_area numeric NOT NULL,
  bathrooms integer NOT NULL,
  floor_number integer,
  total_floors integer,
  property_age integer,
  furnishing_status text NOT NULL,
  parking boolean DEFAULT false,
  facing_direction text,
  has_lift boolean DEFAULT false,
  has_security boolean DEFAULT false,
  has_power_backup boolean DEFAULT false,
  predicted_min_price numeric,
  predicted_avg_price numeric,
  predicted_max_price numeric,
  predicted_fair_value numeric,
  price_per_sqft numeric,
  confidence_score numeric,
  created_at timestamptz DEFAULT now()
);

-- Create comparables table
CREATE TABLE IF NOT EXISTS comparables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  locality text NOT NULL,
  bhk integer NOT NULL,
  total_area numeric NOT NULL,
  bathrooms integer,
  property_age integer,
  furnishing_status text,
  price numeric NOT NULL,
  price_per_sqft numeric,
  created_at timestamptz DEFAULT now()
);

-- Create market_trends table
CREATE TABLE IF NOT EXISTS market_trends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL,
  locality text,
  month text NOT NULL,
  year integer NOT NULL,
  avg_price numeric NOT NULL,
  avg_price_per_sqft numeric,
  total_transactions integer,
  created_at timestamptz DEFAULT now()
);

-- Create training_data table
CREATE TABLE IF NOT EXISTS training_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_size integer,
  upload_date timestamptz DEFAULT now(),
  status text DEFAULT 'uploaded',
  records_count integer
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_predictions_city ON predictions(city);
CREATE INDEX IF NOT EXISTS idx_predictions_locality ON predictions(locality);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comparables_city ON comparables(city);
CREATE INDEX IF NOT EXISTS idx_comparables_locality ON comparables(locality);
CREATE INDEX IF NOT EXISTS idx_comparables_bhk ON comparables(bhk);

CREATE INDEX IF NOT EXISTS idx_market_trends_city ON market_trends(city);
CREATE INDEX IF NOT EXISTS idx_market_trends_year ON market_trends(year DESC);

-- Insert sample comparables data for demonstration
INSERT INTO comparables (city, locality, bhk, total_area, bathrooms, property_age, furnishing_status, price, price_per_sqft) VALUES
('Mumbai', 'Andheri West', 2, 850, 2, 5, 'Semi-Furnished', 12500000, 14706),
('Mumbai', 'Andheri West', 2, 900, 2, 3, 'Fully-Furnished', 13500000, 15000),
('Mumbai', 'Andheri West', 3, 1200, 2, 7, 'Semi-Furnished', 18000000, 15000),
('Mumbai', 'Bandra West', 2, 800, 2, 4, 'Fully-Furnished', 16000000, 20000),
('Mumbai', 'Bandra West', 3, 1100, 3, 6, 'Semi-Furnished', 22000000, 20000),
('Delhi', 'Dwarka', 2, 950, 2, 4, 'Semi-Furnished', 8500000, 8947),
('Delhi', 'Dwarka', 3, 1300, 2, 5, 'Fully-Furnished', 11000000, 8462),
('Delhi', 'Rohini', 2, 850, 2, 8, 'Unfurnished', 7000000, 8235),
('Delhi', 'Rohini', 3, 1150, 3, 6, 'Semi-Furnished', 9500000, 8261),
('Bangalore', 'Whitefield', 2, 1000, 2, 3, 'Fully-Furnished', 9000000, 9000),
('Bangalore', 'Whitefield', 3, 1400, 3, 4, 'Semi-Furnished', 12500000, 8929),
('Bangalore', 'Koramangala', 2, 950, 2, 5, 'Fully-Furnished', 11000000, 11579),
('Bangalore', 'Koramangala', 3, 1300, 3, 6, 'Semi-Furnished', 14500000, 11154),
('Pune', 'Hinjewadi', 2, 900, 2, 4, 'Semi-Furnished', 7500000, 8333),
('Pune', 'Hinjewadi', 3, 1250, 2, 5, 'Fully-Furnished', 10000000, 8000),
('Pune', 'Wakad', 2, 850, 2, 6, 'Unfurnished', 6500000, 7647),
('Pune', 'Wakad', 3, 1200, 3, 7, 'Semi-Furnished', 8500000, 7083);

-- Insert sample market trends data
INSERT INTO market_trends (city, locality, month, year, avg_price, avg_price_per_sqft, total_transactions) VALUES
('Mumbai', 'Andheri West', 'January', 2024, 14000000, 14500, 45),
('Mumbai', 'Andheri West', 'February', 2024, 14200000, 14600, 52),
('Mumbai', 'Andheri West', 'March', 2024, 14500000, 14800, 48),
('Mumbai', 'Andheri West', 'April', 2024, 14800000, 15000, 55),
('Mumbai', 'Andheri West', 'May', 2024, 15000000, 15200, 60),
('Mumbai', 'Andheri West', 'June', 2024, 15200000, 15400, 58),
('Mumbai', 'Bandra West', 'January', 2024, 19000000, 19500, 35),
('Mumbai', 'Bandra West', 'February', 2024, 19500000, 20000, 38),
('Mumbai', 'Bandra West', 'March', 2024, 20000000, 20500, 42),
('Mumbai', 'Bandra West', 'April', 2024, 20500000, 21000, 40),
('Mumbai', 'Bandra West', 'May', 2024, 21000000, 21500, 45),
('Mumbai', 'Bandra West', 'June', 2024, 21500000, 22000, 48),
('Delhi', 'Dwarka', 'January', 2024, 9000000, 8500, 65),
('Delhi', 'Dwarka', 'February', 2024, 9200000, 8600, 70),
('Delhi', 'Dwarka', 'March', 2024, 9400000, 8700, 68),
('Delhi', 'Dwarka', 'April', 2024, 9600000, 8800, 72),
('Delhi', 'Dwarka', 'May', 2024, 9800000, 8900, 75),
('Delhi', 'Dwarka', 'June', 2024, 10000000, 9000, 78),
('Bangalore', 'Whitefield', 'January', 2024, 10000000, 8800, 80),
('Bangalore', 'Whitefield', 'February', 2024, 10200000, 8900, 85),
('Bangalore', 'Whitefield', 'March', 2024, 10500000, 9000, 88),
('Bangalore', 'Whitefield', 'April', 2024, 10800000, 9100, 90),
('Bangalore', 'Whitefield', 'May', 2024, 11000000, 9200, 92),
('Bangalore', 'Whitefield', 'June', 2024, 11200000, 9300, 95),
('Pune', 'Hinjewadi', 'January', 2024, 8000000, 7800, 55),
('Pune', 'Hinjewadi', 'February', 2024, 8200000, 7900, 58),
('Pune', 'Hinjewadi', 'March', 2024, 8400000, 8000, 60),
('Pune', 'Hinjewadi', 'April', 2024, 8600000, 8100, 62),
('Pune', 'Hinjewadi', 'May', 2024, 8800000, 8200, 65),
('Pune', 'Hinjewadi', 'June', 2024, 9000000, 8300, 68);