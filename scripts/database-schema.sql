-- FiveM Hub Database Schema
-- MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS fivem_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fivem_hub;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    discord_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar VARCHAR(500),
    role ENUM('user', 'moderator', 'admin') DEFAULT 'user',
    download_limit INT DEFAULT 10,
    downloads_today INT DEFAULT 0,
    last_download_reset DATE DEFAULT (CURRENT_DATE),
    referral_code VARCHAR(20) UNIQUE,
    referred_by VARCHAR(36),
    referral_bonus INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (referred_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expires (expires_at)
);

-- Resources table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    long_description LONGTEXT,
    category ENUM('script', 'mapping', 'tool', 'loading_screen', 'outfit', 'base') NOT NULL,
    version VARCHAR(50) DEFAULT '1.0.0',
    author_id VARCHAR(36) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT DEFAULT 0,
    thumbnail VARCHAR(500),
    images JSON,
    download_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NULL,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_category (category),
    INDEX idx_author (author_id),
    INDEX idx_featured (is_featured),
    INDEX idx_approved (is_approved),
    FULLTEXT INDEX idx_search (title, description)
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    resource_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_resource (resource_id)
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    resource_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_resource_rating (user_id, resource_id),
    INDEX idx_resource_rating (resource_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_resource_favorite (user_id, resource_id),
    INDEX idx_user_favorites (user_id)
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    downloaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    INDEX idx_user_downloads (user_id),
    INDEX idx_resource_downloads (resource_id)
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('bug', 'feature', 'support', 'claim', 'other') DEFAULT 'support',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
    resource_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_user_tickets (user_id)
);

-- Ticket messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    ticket_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_ticket_messages (ticket_id)
);

-- Claims table (for expired resources)
CREATE TABLE IF NOT EXISTS claims (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    resource_id VARCHAR(36) NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    admin_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    INDEX idx_status_claims (status)
);

-- Dynamic pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content LONGTEXT,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_published (is_published)
);

-- Site configuration table
CREATE TABLE IF NOT EXISTS site_config (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    config_key VARCHAR(255) UNIQUE NOT NULL,
    config_value TEXT,
    description VARCHAR(500),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (config_key)
);

-- Insert default configuration
INSERT INTO site_config (id, config_key, config_value, description) VALUES
    (UUID(), 'site_name', 'FiveM Hub', 'Nom du site'),
    (UUID(), 'site_description', 'Plateforme de partage de ressources FiveM', 'Description du site'),
    (UUID(), 'default_download_limit', '10', 'Limite de téléchargement par défaut par jour'),
    (UUID(), 'referral_bonus', '5', 'Bonus de téléchargement par parrainage'),
    (UUID(), 'max_file_size', '104857600', 'Taille maximale des fichiers en bytes (100MB)'),
    (UUID(), 'allowed_extensions', '.zip,.rar,.7z', 'Extensions de fichiers autorisées'),
    (UUID(), 'maintenance_mode', 'false', 'Mode maintenance'),
    (UUID(), 'registration_enabled', 'true', 'Inscription activée')
ON DUPLICATE KEY UPDATE config_value = VALUES(config_value);

-- Triggers for auto-updating ratings
DELIMITER //

CREATE TRIGGER update_resource_rating AFTER INSERT ON ratings
FOR EACH ROW
BEGIN
    UPDATE resources 
    SET 
        average_rating = (SELECT AVG(rating) FROM ratings WHERE resource_id = NEW.resource_id),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE resource_id = NEW.resource_id)
    WHERE id = NEW.resource_id;
END//

CREATE TRIGGER update_resource_rating_delete AFTER DELETE ON ratings
FOR EACH ROW
BEGIN
    UPDATE resources 
    SET 
        average_rating = COALESCE((SELECT AVG(rating) FROM ratings WHERE resource_id = OLD.resource_id), 0),
        rating_count = (SELECT COUNT(*) FROM ratings WHERE resource_id = OLD.resource_id)
    WHERE id = OLD.resource_id;
END//

-- Trigger for resetting daily downloads
CREATE TRIGGER reset_daily_downloads BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_download_reset < CURRENT_DATE THEN
        SET NEW.downloads_today = 0;
        SET NEW.last_download_reset = CURRENT_DATE;
    END IF;
END//

DELIMITER ;

-- Event to cleanup expired sessions
CREATE EVENT IF NOT EXISTS cleanup_expired_sessions
ON SCHEDULE EVERY 1 HOUR
DO
    DELETE FROM sessions WHERE expires_at < NOW();

-- Enable event scheduler
SET GLOBAL event_scheduler = ON;
