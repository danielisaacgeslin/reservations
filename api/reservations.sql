-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-09-2016 a las 14:33:04
-- Versión del servidor: 10.1.13-MariaDB
-- Versión de PHP: 7.0.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `reservations`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comments`
--

CREATE TABLE `comments` (
  `ID` int(11) NOT NULL,
  `ARTICLE_ID` int(11) NOT NULL,
  `TEXT` text COLLATE utf8_unicode_ci NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservations`
--

CREATE TABLE `reservations` (
  `ID` int(11) NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `EDITION_TIMESTAMP` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `TITLE` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `DESCRIPTION` varchar(350) COLLATE utf8_unicode_ci DEFAULT NULL,
  `BODY` text COLLATE utf8_unicode_ci,
  `DATE` date NOT NULL,
  `TIME` tinyint(4) NOT NULL,
  `CREATION_USER` int(11) NOT NULL,
  `EDITION_USER` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `ID` int(11) NOT NULL,
  `TEXT` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREATION_USER` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`ID`, `TEXT`, `CREATION_TIMESTAMP`, `CREATION_USER`) VALUES
(1, 'SUM', '2016-09-06 13:05:34', 1),
(2, 'pool', '2016-09-06 13:05:34', 1),
(3, 'grill', '2016-09-06 13:05:50', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag_lists`
--

CREATE TABLE `tag_lists` (
  `ID` int(11) NOT NULL,
  `ARTICLE_ID` int(11) NOT NULL,
  `TAG_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `USERNAME` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `PASSWORD` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `FIRST_NAME` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `LAST_NAME` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `EMAIL` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `FLOOR` tinyint(4) NOT NULL,
  `DEPARTMENT` tinyint(4) NOT NULL,
  `CREATION_TIMESTAMP` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`ID`, `USERNAME`, `PASSWORD`, `FIRST_NAME`, `LAST_NAME`, `EMAIL`, `FLOOR`, `DEPARTMENT`, `CREATION_TIMESTAMP`) VALUES
(1, 'dgeslin', '=(', 'Daniel', 'Geslin', 'danielisaacgeslin@gmail.com', 0, 0, '2016-08-31 15:14:25');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `ID_2` (`ID`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `ARTICLE_ID` (`ARTICLE_ID`),
  ADD KEY `ARTICLE_ID_2` (`ARTICLE_ID`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`);

--
-- Indices de la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`ID`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `EDITION_USER` (`EDITION_USER`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`),
  ADD KEY `CREATION_USER_3` (`CREATION_USER`),
  ADD KEY `CREATION_USER_4` (`CREATION_USER`),
  ADD KEY `EDITION_USER_2` (`EDITION_USER`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TEXT` (`TEXT`),
  ADD KEY `CREATION_USER` (`CREATION_USER`),
  ADD KEY `CREATION_USER_2` (`CREATION_USER`);

--
-- Indices de la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `TAG_ID` (`TAG_ID`),
  ADD KEY `ARTICLE_ID` (`ARTICLE_ID`),
  ADD KEY `ARTICLE_ID_2` (`ARTICLE_ID`),
  ADD KEY `TAG_ID_2` (`TAG_ID`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `comments`
--
ALTER TABLE `comments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
--
-- AUTO_INCREMENT de la tabla `reservations`
--
ALTER TABLE `reservations`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;
--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`ARTICLE_ID`) REFERENCES `reservations` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`EDITION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tags`
--
ALTER TABLE `tags`
  ADD CONSTRAINT `tags_ibfk_1` FOREIGN KEY (`CREATION_USER`) REFERENCES `users` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `tag_lists`
--
ALTER TABLE `tag_lists`
  ADD CONSTRAINT `tag_lists_ibfk_1` FOREIGN KEY (`ARTICLE_ID`) REFERENCES `reservations` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `tag_lists_ibfk_2` FOREIGN KEY (`TAG_ID`) REFERENCES `tags` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
