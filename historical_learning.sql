CREATE TABLE `historical_learning` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `keywords` text COLLATE utf8_unicode_ci NOT NULL,
 `article_number` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
 `vote_positive` int(11) DEFAULT 0,
 `vote_negative` int(11) DEFAULT 0,
 `historical_user_id` int(11) DEFAULT NULL,
 `valid_claim` tinyint(1) DEFAULT 0,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
