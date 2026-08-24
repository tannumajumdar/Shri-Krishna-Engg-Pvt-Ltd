-- Shri Krishna Engineering — database export (FK-safe order)
-- Import into your cPanel database via phpMyAdmin → Import.
-- MySQL 5.7+ / MariaDB 10.2+ (utf8mb4).

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ----------------------------
-- Table: _prisma_migrations
-- ----------------------------
DROP TABLE IF EXISTS `_prisma_migrations`;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
  ('9160cda6-c0fa-4e57-a403-8c360dd3ce8e', 'c1f9acd2a49896a794e749cfc610758e366620feb111b30c6ee7ac5a6027f162', '2026-08-20 20:46:50', '20260821021650_init', NULL, NULL, '2026-08-20 20:46:50', 1),
  ('c03995ed-a06e-463b-b6cf-0bb070a779ac', '091aa4b37f543a42e179c92ed9989014797f6432ecb66c002342b739a7ade6cc', '2026-08-21 10:14:59', '20260821154459_enquiry_source', NULL, NULL, '2026-08-21 10:14:59', 1);

-- ----------------------------
-- Table: admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('ADMIN','EDITOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ADMIN',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `admins` (`id`, `name`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
  (1, 'SKE Administrator', 'admin@shrikrishnaengineering.in', '$2b$10$pSU7PrD/08.B9kaxm5cSD.gYLplt1sBHM/NdqtNyTw6U.T99gM.aq', 'ADMIN', '2026-08-20 22:25:51', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: contact_info
-- ----------------------------
DROP TABLE IF EXISTS `contact_info`;
CREATE TABLE `contact_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `whatsapp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mapUrl` text COLLATE utf8mb4_unicode_ci,
  `hours` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contact_info` (`id`, `address`, `phone`, `email`, `whatsapp`, `mapUrl`, `hours`, `updatedAt`) VALUES
  (1, 'Shri Krishna Engineering, Near 1 MVA Sub Station, Sector-5, PO Balco Township, Korba, Chhattisgarh 495684', '+91 98263 62831', 'shreekrishna1.engg@gmail.com', '919826362831', NULL, 'Mon – Sat · 09:00 – 18:00 IST', '2026-08-21 09:48:40');

-- ----------------------------
-- Table: enquiries
-- ----------------------------
DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `product` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('NEW','READ','RESPONDED','ARCHIVED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NEW',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `source` enum('WEBSITE','WHATSAPP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'WEBSITE',
  PRIMARY KEY (`id`),
  KEY `enquiries_status_idx` (`status`),
  KEY `enquiries_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Table: features
-- ----------------------------
DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `features_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `features` (`id`, `title`, `description`, `icon`, `sortOrder`, `status`, `createdAt`, `updatedAt`) VALUES
  (7, 'Engineering Expertise', 'Site and design engineers who plan the job before mobilising, not after.', 'Compass', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (8, 'In-house Fabrication', 'Our own fabrication yard, machines and tools — critical work is never sub-let.', 'Factory', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (9, 'Quality Assurance', 'Documented checks at every stage, with inspection records kept for every job.', 'ShieldCheck', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (10, 'Safety First', 'Safety and quality is our first priority — the standard we hold on every site.', 'Ruler', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (11, 'Reliable Delivery', 'Committed schedules backed by planning, manpower and our own transport fleet.', 'Truck', 4, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (12, 'Turnkey Execution', 'Single-point responsibility from foundation to erection and commissioning.', 'Wrench', 5, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: industries
-- ----------------------------
DROP TABLE IF EXISTS `industries`;
CREATE TABLE `industries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `industries_slug_key` (`slug`),
  KEY `industries_status_idx` (`status`),
  KEY `industries_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `industries` (`id`, `name`, `slug`, `description`, `image`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
  (7, 'Power', 'power', 'Mechanical, structural and civil works for generation and transmission plants.', '/media/industries/power.jpg', 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (8, 'Infrastructure', 'infrastructure', 'Fabrication and heavy erection for large public-works projects.', '/media/industries/infrastructure.jpg', 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (9, 'Construction', 'construction', 'Civil works, structural steel and site development, turnkey.', '/media/industries/construction.jpg', 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (10, 'Manufacturing', 'manufacturing', 'Plant maintenance and equipment erection that keep production lines running.', '/media/industries/manufacturing.jpg', 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (11, 'Automotive', 'automotive', 'Fabrication, machining and maintenance support for process plants.', '/media/industries/automotive.jpg', 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (12, 'Electrical', 'electrical', 'Electrical erection and panel work, executed to standard.', '/media/industries/electrical.jpg', 'PUBLISHED', 5, '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: media
-- ----------------------------
DROP TABLE IF EXISTS `media`;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('IMAGE','VIDEO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'IMAGE',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fileUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `poster` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alt` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `section` enum('HERO','ABOUT','PRODUCTS','INDUSTRIES','INFRASTRUCTURE','QUALITY','CTA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `media_section_idx` (`section`),
  KEY `media_status_idx` (`status`),
  KEY `media_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `media` (`id`, `type`, `title`, `fileUrl`, `poster`, `alt`, `section`, `sortOrder`, `status`, `createdAt`, `updatedAt`) VALUES
  (17, 'VIDEO', 'Hero background', '/media/hero-video.mp4', '/media/hero-poster.jpg', NULL, 'HERO', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (18, 'VIDEO', 'Products header', '/media/products-video.mp4', '/media/products-poster.jpg', NULL, 'PRODUCTS', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (19, 'VIDEO', 'Quality panel', '/media/quality-video.mp4', '/media/quality-poster.jpg', NULL, 'QUALITY', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (20, 'VIDEO', 'Call to action', '/media/cta-video.mp4', '/media/cta.jpg', NULL, 'CTA', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (21, 'IMAGE', 'Factory interior', '/media/about.jpg', NULL, NULL, 'ABOUT', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (22, 'IMAGE', 'Metrology detail', '/media/about-secondary.jpg', NULL, NULL, 'ABOUT', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (23, 'IMAGE', 'Rolled Product Team, BALCO', '/media/infrastructure/facility-01.jpg', NULL, 'Rolled Product Team, BALCO', 'INFRASTRUCTURE', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (24, 'IMAGE', 'Machine Shop', '/media/infrastructure/facility-02.jpg', NULL, 'Machine Shop', 'INFRASTRUCTURE', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (25, 'IMAGE', 'Foundry Operations', '/media/infrastructure/facility-03.jpg', NULL, 'Foundry Operations', 'INFRASTRUCTURE', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (26, 'IMAGE', 'Fabrication Yard', '/media/infrastructure/facility-04.jpg', NULL, 'Fabrication Yard', 'INFRASTRUCTURE', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (27, 'IMAGE', 'Downstream Shop Floor', '/media/infrastructure/facility-05.jpg', NULL, 'Downstream Shop Floor', 'INFRASTRUCTURE', 4, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (28, 'IMAGE', 'Measurement & QC', '/media/infrastructure/facility-06.jpg', NULL, 'Measurement & QC', 'INFRASTRUCTURE', 5, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (29, 'IMAGE', 'Machining Cell', '/media/infrastructure/facility-07.jpg', NULL, 'Machining Cell', 'INFRASTRUCTURE', 6, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (30, 'IMAGE', 'Material Handling', '/media/infrastructure/facility-08.jpg', NULL, 'Material Handling', 'INFRASTRUCTURE', 7, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (31, 'IMAGE', 'Furnace Area', '/media/infrastructure/facility-09.jpg', NULL, 'Furnace Area', 'INFRASTRUCTURE', 8, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (32, 'IMAGE', 'Finishing Line', '/media/infrastructure/facility-10.jpg', NULL, 'Finishing Line', 'INFRASTRUCTURE', 9, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: quality_points
-- ----------------------------
DROP TABLE IF EXISTS `quality_points`;
CREATE TABLE `quality_points` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `quality_points_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `quality_points` (`id`, `title`, `description`, `icon`, `sortOrder`, `status`, `createdAt`, `updatedAt`) VALUES
  (5, 'Certified Processes', 'Work planned and executed to ISO-aligned quality and safety systems.', 'Award', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (6, 'Full Traceability', 'Inspection records, test certificates and job reports retained for every job.', 'ScrollText', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (7, 'Safety-First Culture', 'Trained crews, PPE discipline and toolbox talks on every shift.', 'Leaf', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (8, 'Skilled Manpower', 'Certified welders, riggers, fitters and operators on our own rolls.', 'Gauge', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: social_links
-- ----------------------------
DROP TABLE IF EXISTS `social_links`;
CREATE TABLE `social_links` (
  `id` int NOT NULL AUTO_INCREMENT,
  `platform` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `icon` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `social_links_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `social_links` (`id`, `platform`, `url`, `icon`, `sortOrder`, `status`, `createdAt`, `updatedAt`) VALUES
  (5, 'LinkedIn', 'https://example.com', 'linkedin', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (6, 'X', 'https://example.com', 'x', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (7, 'Facebook', 'https://example.com', 'facebook', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (8, 'YouTube', 'https://example.com', 'youtube', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: statistics
-- ----------------------------
DROP TABLE IF EXISTS `statistics`;
CREATE TABLE `statistics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `suffix` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `statistics_status_idx` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `statistics` (`id`, `title`, `value`, `suffix`, `sortOrder`, `status`, `createdAt`, `updatedAt`) VALUES
  (5, 'Years in Engineering', '25', '+', 0, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (6, 'Skilled Workforce', '250', '+', 1, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (7, 'Jobs Delivered', '500', '+', 2, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (8, 'Service Verticals', '6', '', 3, 'PUBLISHED', '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: product_categories
-- ----------------------------
DROP TABLE IF EXISTS `product_categories`;
CREATE TABLE `product_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_categories_slug_key` (`slug`),
  KEY `product_categories_status_idx` (`status`),
  KEY `product_categories_createdAt_idx` (`createdAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_categories` (`id`, `name`, `slug`, `description`, `image`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
  (10, 'Mechanical Works', 'mechanical', 'Erection, alignment, overhauling and maintenance of rotating and static plant equipment.', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (11, 'Fabrication', 'fabrication', 'Structural, plate and pipe fabrication built in-house to drawing, then delivered ready to erect.', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (12, 'Erection & Commissioning', 'erection', 'Heavy equipment and structural erection — aligned, tested and handed over ready to run.', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (13, 'Civil Works', 'civil', 'Foundations, RCC, flooring and site development that carry heavy plant and stand up to it.', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (14, 'Transportation & Logistics', 'transportation', 'Heavy haulage, crane hire and in-plant material movement — the right equipment, on time.', NULL, 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (15, 'Plant Operations & Maintenance', 'om', 'Round-the-clock O&M of foundry, rolling mill and material-handling equipment at BALCO Rolled Product.', NULL, 'PUBLISHED', 5, '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shortDescription` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pdf` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `specifications` json DEFAULT NULL,
  `applications` json DEFAULT NULL,
  `status` enum('DRAFT','PUBLISHED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PUBLISHED',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_categoryId_idx` (`categoryId`),
  KEY `products_status_idx` (`status`),
  KEY `products_createdAt_idx` (`createdAt`),
  CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `categoryId`, `name`, `slug`, `shortDescription`, `description`, `image`, `pdf`, `specifications`, `applications`, `status`, `sortOrder`, `createdAt`, `updatedAt`) VALUES
  (27, 10, 'Equipment Erection & Alignment', 'mechanical-equipment-erection-alignment', 'Precision installation and laser alignment of drives, pumps and gearboxes.', NULL, '/media/services/mechanical-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"On-site\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (28, 10, 'Rotary Equipment Maintenance', 'mechanical-rotary-equipment-maintenance', 'Bearings, couplings and shafts serviced to OEM tolerances.', NULL, '/media/services/mechanical-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"PM · CBM\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (29, 10, 'Pump & Gearbox Overhaul', 'mechanical-pump-gearbox-overhaul', 'In-house repair and rebuild of hydraulic and gear assemblies.', NULL, '/media/services/mechanical-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Rebuild\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (30, 10, 'Preventive Maintenance', 'mechanical-preventive-maintenance', 'Planned PM schedules that keep critical lines available.', NULL, '/media/services/mechanical-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Scheduled\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (31, 10, 'Breakdown Support', 'mechanical-breakdown-support', 'Rapid-response teams for unplanned stoppages, round the clock.', NULL, '/media/services/mechanical-05.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"24x7\"}]', NULL, 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (32, 11, 'Structural Fabrication', 'fabrication-structural-fabrication', 'Beams, columns and trusses fabricated from certified sections.', NULL, '/media/services/fabrication-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"MIG · TIG\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (33, 11, 'Plate & Pipe Work', 'fabrication-plate-pipe-work', 'Chutes, hoppers, ducting and pipe spools made to spec.', NULL, '/media/services/fabrication-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"To drawing\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (34, 11, 'Tanks & Enclosures', 'fabrication-tanks-enclosures', 'Storage tanks, vessels and sheet-metal enclosures.', NULL, '/media/services/fabrication-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Sealed\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (35, 11, 'Platforms & Walkways', 'fabrication-platforms-walkways', 'Access structures, ladders and handrails to plant safety norms.', NULL, '/media/services/fabrication-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"To standard\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (36, 11, 'On-site Welding', 'fabrication-on-site-welding', 'Qualified welders for site fabrication and modification.', NULL, '/media/services/fabrication-05.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Certified\"}]', NULL, 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (37, 12, 'Heavy Equipment Erection', 'erection-heavy-equipment-erection', 'Mills, furnaces and drives set, aligned and grouted.', NULL, '/media/services/erection-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Heavy lift\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (38, 12, 'Structural Erection', 'erection-structural-erection', 'Steel structures raised and bolted to GA drawings.', NULL, '/media/services/erection-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Bolted\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (39, 12, 'Crane & EOT Installation', 'erection-crane-eot-installation', 'EOT and gantry cranes installed and load-tested.', NULL, '/media/services/erection-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Load-tested\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (40, 12, 'Alignment & Commissioning', 'erection-alignment-commissioning', 'Cold and hot commissioning with full alignment records.', NULL, '/media/services/erection-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Commissioned\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (41, 13, 'Foundations & Grouting', 'civil-foundations-grouting', 'Machine foundations, anchor bolts and epoxy grouting.', NULL, '/media/services/civil-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Load-bearing\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (42, 13, 'RCC & Concrete Work', 'civil-rcc-concrete-work', 'Reinforced concrete for structures, pits and pedestals.', NULL, '/media/services/civil-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"M20 – M40\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (43, 13, 'Rebar & Reinforcement', 'civil-rebar-reinforcement', 'Cutting, bending and tying of reinforcement to BBS.', NULL, '/media/services/civil-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Per BBS\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (44, 13, 'Industrial Flooring', 'civil-industrial-flooring', 'Heavy-duty and trimix floors for shop-floor traffic.', NULL, '/media/services/civil-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Trimix\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (45, 13, 'Site Development', 'civil-site-development', 'Grading, drains and hardstands for plant areas.', NULL, '/media/services/civil-05.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Turnkey\"}]', NULL, 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (46, 14, 'Heavy Haulage', 'transportation-heavy-haulage', 'Trailers and low-beds for oversized plant equipment.', NULL, '/media/services/transport-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Over-dimension\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (47, 14, 'Trailer Transport', 'transportation-trailer-transport', 'Scheduled movement of materials and finished goods.', NULL, '/media/services/transport-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Fleet\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (48, 14, 'Crane & Hydra Hire', 'transportation-crane-hydra-hire', 'Mobile cranes and hydras for lifting and shifting.', NULL, '/media/services/transport-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"On hire\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (49, 14, 'In-plant Logistics', 'transportation-in-plant-logistics', 'Material shifting and yard handling inside the works.', NULL, '/media/services/transport-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"In-plant\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (50, 15, 'Furnace & Foundry O&M', 'om-furnace-foundry-o-m', 'Melting, casting and furnace operations and upkeep.', NULL, '/media/services/om-01.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Foundry\"}]', NULL, 'PUBLISHED', 0, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (51, 15, 'Rolling Mill Maintenance', 'om-rolling-mill-maintenance', 'HRM and CRM mechanical and hydraulic maintenance.', NULL, '/media/services/om-02.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"HRM · CRM\"}]', NULL, 'PUBLISHED', 1, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (52, 15, 'Furnace Relining & Repair', 'om-furnace-relining-repair', 'Refractory, burners and furnace shutdown work.', NULL, '/media/services/om-03.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Shutdown\"}]', NULL, 'PUBLISHED', 2, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (53, 15, 'Material Handling O&M', 'om-material-handling-o-m', 'Coil cars, conveyors and forklifts kept running.', NULL, '/media/services/om-04.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"Availability\"}]', NULL, 'PUBLISHED', 3, '2026-08-22 01:59:17', '2026-08-22 01:59:17'),
  (54, 15, 'Crane & EOT Maintenance', 'om-crane-eot-maintenance', 'Preventive and breakdown maintenance of plant cranes.', NULL, '/media/services/om-05.jpg', NULL, '[{\"label\":\"Spec\",\"value\":\"PM & repair\"}]', NULL, 'PUBLISHED', 4, '2026-08-22 01:59:17', '2026-08-22 01:59:17');

-- ----------------------------
-- Table: product_images
-- ----------------------------
DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int NOT NULL,
  `imageUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_images_productId_idx` (`productId`),
  CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `product_images` (`id`, `productId`, `imageUrl`, `sortOrder`, `createdAt`) VALUES
  (31, 27, '/media/services/mechanical-01.jpg', 0, '2026-08-22 01:59:17'),
  (32, 28, '/media/services/mechanical-02.jpg', 0, '2026-08-22 01:59:17'),
  (33, 29, '/media/services/mechanical-03.jpg', 0, '2026-08-22 01:59:17'),
  (34, 30, '/media/services/mechanical-04.jpg', 0, '2026-08-22 01:59:17'),
  (35, 31, '/media/services/mechanical-05.jpg', 0, '2026-08-22 01:59:17'),
  (36, 32, '/media/services/fabrication-01.jpg', 0, '2026-08-22 01:59:17'),
  (37, 33, '/media/services/fabrication-02.jpg', 0, '2026-08-22 01:59:17'),
  (38, 34, '/media/services/fabrication-03.jpg', 0, '2026-08-22 01:59:17'),
  (39, 35, '/media/services/fabrication-04.jpg', 0, '2026-08-22 01:59:17'),
  (40, 36, '/media/services/fabrication-05.jpg', 0, '2026-08-22 01:59:17'),
  (41, 37, '/media/services/erection-01.jpg', 0, '2026-08-22 01:59:17'),
  (42, 38, '/media/services/erection-02.jpg', 0, '2026-08-22 01:59:17'),
  (43, 39, '/media/services/erection-03.jpg', 0, '2026-08-22 01:59:17'),
  (44, 40, '/media/services/erection-04.jpg', 0, '2026-08-22 01:59:17'),
  (45, 41, '/media/services/civil-01.jpg', 0, '2026-08-22 01:59:17'),
  (46, 42, '/media/services/civil-02.jpg', 0, '2026-08-22 01:59:17'),
  (47, 43, '/media/services/civil-03.jpg', 0, '2026-08-22 01:59:17'),
  (48, 44, '/media/services/civil-04.jpg', 0, '2026-08-22 01:59:17'),
  (49, 45, '/media/services/civil-05.jpg', 0, '2026-08-22 01:59:17'),
  (50, 46, '/media/services/transport-01.jpg', 0, '2026-08-22 01:59:17'),
  (51, 47, '/media/services/transport-02.jpg', 0, '2026-08-22 01:59:17'),
  (52, 48, '/media/services/transport-03.jpg', 0, '2026-08-22 01:59:17'),
  (53, 49, '/media/services/transport-04.jpg', 0, '2026-08-22 01:59:17'),
  (54, 50, '/media/services/om-01.jpg', 0, '2026-08-22 01:59:17'),
  (55, 51, '/media/services/om-02.jpg', 0, '2026-08-22 01:59:17'),
  (56, 52, '/media/services/om-03.jpg', 0, '2026-08-22 01:59:17'),
  (57, 53, '/media/services/om-04.jpg', 0, '2026-08-22 01:59:17'),
  (58, 54, '/media/services/om-05.jpg', 0, '2026-08-22 01:59:17');

SET FOREIGN_KEY_CHECKS = 1;
