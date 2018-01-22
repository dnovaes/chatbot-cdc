CREATE TABLE `historical_learning` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `keywords` text COLLATE utf8_unicode_ci NOT NULL,
 `article_number` varchar(100) COLLATE utf8_unicode_ci DEFAULT NOT NULL,
 `claim_text` text COLLATE utf8_unicode_ci NOT NULL,
 `vote_positive` int(11) DEFAULT 0,
 `vote_negative` int(11) DEFAULT 0,
 `valid_claim` tinyint(1) DEFAULT 0,
 `user_id` int(11) DEFAULT NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `articles`(
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `art_id` int(11) NOT NULL,
 `subject` text COLLATE utf8_unicode_ci NOT NULL,
 `text` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
