/*
  # Initial Schema Setup for ID Card System

  1. New Tables
    - `product_customizations`
      - `id` (uuid, primary key)
      - `holder_type` (text)
      - `lanyard_color` (text)
      - `card_type` (text)
      - `card_finish` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

    - `personal_information`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `father_name` (text)
      - `designation` (text)
      - `blood_group` (text)
      - `address` (text)
      - `contact_number` (text)
      - `emergency_contact` (text)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create product_customizations table
CREATE TABLE IF NOT EXISTS product_customizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holder_type text NOT NULL,
  lanyard_color text NOT NULL,
  card_type text NOT NULL,
  card_finish text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Create personal_information table
CREATE TABLE IF NOT EXISTS personal_information (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  father_name text NOT NULL,
  designation text NOT NULL,
  blood_group text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  emergency_contact text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE product_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_information ENABLE ROW LEVEL SECURITY;

-- Create policies for product_customizations
CREATE POLICY "Users can insert their own product customizations"
  ON product_customizations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own product customizations"
  ON product_customizations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for personal_information
CREATE POLICY "Users can insert their own personal information"
  ON personal_information
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own personal information"
  ON personal_information
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);