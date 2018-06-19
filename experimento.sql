CREATE TABLE `experiments` (
 `id` int(11) NOT NULL AUTO_INCREMENT,
 `name` text COLLATE utf8_unicode_ci NOT NULL,
 `claim_id` int(11) NOT NULL,
 `final_appointment` text COLLATE utf8_unicode_ci NOT NULL,
 `datetime` DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
 `user_vote` BOOLEAN NOT NULL,
 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
