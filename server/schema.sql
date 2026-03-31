-- Create database if not exists
CREATE DATABASE IF NOT EXISTS resource_hub;
USE resource_hub;

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  techStack VARCHAR(255), -- Comma-separated or JSON
  image VARCHAR(255),
  githubUrl VARCHAR(255),
  externalUrl VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample projects
INSERT INTO projects (title, category, description, techStack, image, githubUrl, externalUrl) VALUES
('LocalLink', 'Web Applications', 'A comprehensive local services marketplace.', 'Laravel, React, MySQL', 'https://picsum.photos/seed/locallink/600/400', 'https://github.com/fintechpoint/locallink', 'https://locallink.example.com'),
('SANAD', 'Web Applications', 'An innovative platform for social welfare.', 'Next.js, Tailwind, Firebase', 'https://picsum.photos/seed/sanad/600/400', 'https://github.com/fintechpoint/sanad', 'https://sanad.example.com'),
('Fintech Point POS', 'Web Applications', 'A robust Point of Sale system.', 'PHP, React, IoT', 'https://picsum.photos/seed/pos/600/400', 'https://github.com/fintechpoint/pos', 'https://pos.fintechpoint.com');
