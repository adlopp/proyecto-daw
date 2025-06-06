-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2025 a las 14:54:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tienda`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedido`
--

CREATE TABLE `pedido` (
  `id_pedido` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(10) UNSIGNED NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `total` decimal(10,2) NOT NULL,
  `direccion` text NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedido`
--

INSERT INTO `pedido` (`id_pedido`, `id_usuario`, `id_producto`, `cantidad`, `total`, `direccion`, `fecha`) VALUES
(1, 2, 2, 13, 6499.87, 'C/ Bitcoin', '2025-06-04 20:32:56'),
(2, 2, 3, 6, 3299.94, 'C/ Bitcoin', '2025-06-05 16:00:58'),
(3, 2, 1, 2, 599.98, 'C/ Bitcoin', '2025-06-05 16:04:33'),
(4, 2, 1, 3, 899.97, 'C/ Bitcoin', '2025-06-05 16:10:05'),
(5, 2, 1, 14, 4199.86, 'C/ Bitcoin', '2025-06-05 16:14:43'),
(6, 2, 1, 13, 3899.87, 'C/ Bitcoin', '2025-06-05 16:17:07'),
(7, 2, 1, 7, 2099.93, 'C/ Bitcoin', '2025-06-05 16:21:04'),
(8, 2, 1, 6, 1799.94, 'C/ Bitcoin', '2025-06-05 16:27:21'),
(9, 2, 1, 89, 26699.11, 'C/ Bitcoin', '2025-06-05 16:28:11'),
(10, 3, 3, 2, 1099.98, 'C/ Pájaro', '2025-06-05 19:54:27'),
(11, 6, 2, 3, 1499.97, 'C/ Lamine Yamal 4D', '2025-06-06 10:06:47'),
(12, 6, 3, 1, 549.99, 'C/ Lamine Yamal 4D', '2025-06-06 10:07:38'),
(13, 6, 5, 2, 300.00, 'C/ León 7D', '2025-06-06 10:08:42'),
(14, 5, 2, 2, 999.98, 'C/ Lamine Yamal 4D', '2025-06-06 11:34:51'),
(15, 5, 3, 1, 549.98, 'C/ Lamine Yamal 4D', '2025-06-06 11:36:53'),
(16, 5, 2, 1, 499.99, 'C/ Lamine Yamal 4D', '2025-06-06 12:51:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `descripcion`, `categoria`, `precio`, `imagen`, `stock`) VALUES
(1, 'Nintendo Switch', 'Consola híbrida de Nintendo', 'consolas', 299.99, 'img/1749208249581-nintendo_switch.png', 202),
(2, 'Xbox Series X', 'Consola de nueva generación de Microsoft', 'Consolas', 499.99, 'img/xbox_series_x.png', 135),
(3, 'PlayStation 5', 'Consola de nueva generación de Sony', 'consolas', 549.98, 'img/ps5.png', 97),
(4, 'Xbox Series S', 'Consola de nueva generación de Microsoft en versión reducida', 'consolas', 199.99, 'img/xbox_series_s.png', 75),
(5, 'Monitor AOC Q27G2E 27\" LED QHD 155Hz FreeSync Premium', 'El AOC Q27G2E/BK dispone de un panel VA de 27\" con resolución QHD, ShadowControl y una relación de contraste superior de 3000:1. Disfrute de los juegos con mejor capacidad de respuesta y batallas más rápidas con Adaptive Sync sin interrupciones, una frecuencia de actualización de 155 Hz (OC), MPRT de 1 ms y un retardo de entrada bajo para reducir el desenfoque de movimiento y el retardo de entrada y salida. Jugar nunca había sido una experiencia tan divertida e intensa.', 'monitores', 150.00, 'img/monitor_aoc.png', 40),
(6, 'Monitor MSI G27CQ4 E2 27\" LED WQHD 170Hz FreeSync Premium Curva', 'Visualiza tu victoria con el monitor MSI G27CQ4 E2 Curved Gaming™. Equipado con una frecuencia de actualización de 2560x1440, 170 Hz, panel de tiempo de respuesta de 1 ms, G27CQ4 E2 le brindará la ventaja competitiva que necesita para derrotar a sus oponentes. Construido con sincronización adaptativa, G27CQ4 E2 puede hacer coincidir la frecuencia de actualización de la pantalla con su GPU para un juego ultra fluido. Asegúrese de que puede dar en el blanco con todas las últimas tecnologías integradas en el monitor MSI Curved Gaming™ para juegos competitivos.', 'monitores', 899.99, 'img/monitor_msi.png', 100),
(7, 'Tarjeta Gráfica Gigabyte GeForce RTX 4060 GAMING OC 8GB GDDR6 DLSS3', 'El sistema de refrigeración WINDFORCE cuenta con dos ventiladores de aspas únicos de 80 mm, rotación alternativa, un tubo de calor compuesto de cobre que toca directamente la GPU, ventiladores activos 3D y refrigeración de pantalla, que juntos proporcionan una disipación de calor de alta eficiencia.\r\n\r\nGeForce RTX Serie 40: La plataforma definitiva para jugadores y creadores\r\n\r\nLas GPU NVIDIA® GeForce RTX® serie 40 son más que rápidas para jugadores y creadores. Cuentan con la tecnología de la arquitectura ultra eficiente NVIDIA Ada Lovelace, que ofrece un salto espectacular tanto en rendimiento como en gráficos con tecnología de IA. Disfruta de mundos virtuales realistas con trazado de rayos y juegos con FPS ultra altos y la latencia más baja. Descubre nuevas y revolucionarias formas de crear contenido y una aceleración de flujo de trabajo sin precedentes.\r\n\r\nTrazado de rayos: Hiperrealista. Hiper rápido.\r\n\r\nLa arquitectura Ada libera toda la gloria del trazado de rayos, que simula cómo se comporta la luz en el mundo real. Con la potencia de RTX serie 40 y núcleos RT de tercera generación, puedes disfrutar de mundos virtuales increíblemente detallados como nunca.\r\n\r\nNVIDIA DLSS 3: El multiplicador de rendimiento, con tecnología de IA.\r\n\r\nDLSS es un avance revolucionario en materia de gráficos con tecnología de IA que aumenta enormemente el rendimiento. Gracias a los nuevos Tensor Cores de cuarta generación y el acelerador de flujo óptico en las GPU GeForce RTX serie 40, DLSS 3 utiliza la IA para crear más fotogramas de alta calidad.\r\n\r\nNVIDIA Reflex: La victoria se mide en milisegundos.\r\n\r\nLas GPU NVIDIA Reflex y GeForce RTX serie 40 ofrecen la latencia más baja y la mejor capacidad de respuesta para obtener la máxima ventaja competitiva. Reflex, diseñada para optimizar y medir la latencia del sistema, ofrece una adquisición de objetivos más rápida, tiempos de reacción más rápidos y la mejor precisión de objetivo para los juegos competitivos.', 'graficas', 599.99, 'img/4060.png', 70),
(8, 'Tarjeta Gráfica Gigabyte GeForce RTX 5060 Ti WINDFORCE OC 16GB GDDR7 Reflex 2 RTX AI DLSS4', 'El sistema de refrigeración WINDFORCE ofrece un rendimiento térmico excepcional gracias a una combinación de tecnologías de vanguardia. Incorpora gel conductor térmico de grado servidor, innovadores ventiladores Hawk con giro alterno, tubos de calor de cobre compuesto, una gran placa de cobre, ventiladores activos 3D y refrigeración por pantalla.\r\n\r\nGeForce RTX Serie 50\r\nCambia el juego. Con tecnología de NVIDIA Blackwell, las GPU GeForce RTX™ serie 50 ofrecen capacidades revolucionarias a jugadores y creadores. Equipada con una increíble potencia de IA, la RTX serie 50 abre el camino hacia nuevas experiencias y ofrece fidelidad gráfica de siguiente nivel. Multiplica el rendimiento con NVIDIA DLSS 4, genera imágenes a una velocidad sin precedentes y libera tu creatividad con NVIDIA Studio.\r\n\r\nNVIDIA DLSS 4\r\nVelocidad suprema. Ejectos visuales superiores. Con tecnología de IA. DLSS es un conjunto revolucionario de tecnologías de renderizado neuronal que utiliza IA para aumentar los FPS, reducir la latencia y mejorar la calidad de imagen. ?El último avance, DLSS 4, ofrece una nueva prestación de generación de fotogramas múltiples, reconstrucción de rayos y superresolución mejorada, con tecnología de GPU GeForce RTX™ serie 50 y núcleos Tensor de quinta generación. La combinación de DLSS y GeForce RTX ofrece la mejor forma de jugar, respaldada por un superordenador de IA NVIDIA en la nube que mejora constantemente las capacidades de juego de tu PC. \r\n\r\nTrazado de rayos completo con renderizado neuronal\r\nRealismo que cambia las reglas del juego. Gracias a la arquitectura NVIDIA Blackwell, podrás disfrutar del realismo revolucionario del trazado de rayos completo. Experimenta imágenes de calidad cinematográfica a una velocidad sin precedentes con tecnología GeForce RTX serie 50 y núcleos RT de cuarta generación, además de tecnologías de renderizado neuronal innovadoras aceleradas con núcleos Tensor de quinta generación.\r\n\r\nNVIDIA Reflex 2\r\nCompite a velocidad de curvatura. Las tecnologías Reflex optimizan la canalización gráfica para ofrecer la máxima capacidad de respuesta, lo que proporciona una adquisición de objetivos más rápida, tiempos de reacción más rápidos y una mayor precisión de la puntería en los juegos competitivos. Reflex 2 presenta Frame Warp, que reduce aún más la latencia en función de la última entrada del ratón del juego.\r\n\r\nPC con IA de RTX\r\nNVIDIA impulsa la IA del mundo. Y la tuya. Actualiza a la IA avanzada con las GPU NVIDIA GeForce RTX™ y acelera los juegos, la creación, la productividad y el desarrollo. Gracias a los procesadores de IA integrados, obtienes la tecnología de IA líder en el mundo que impulsa tu PC con Windows.\r\n\r\nCreadores\r\nTu ventaja de IA creativa. Con NVIDIA Studio, tendrás ventaja creativa. Las GPU GeForce RTX serie 50 ofrecen un rendimiento transformador en renderizado 3D, edición de vídeo y diseño gráfico. Disfruta de aceleración RTX en las principales aplicaciones creativas, los controladores NVIDIA Studio de clase mundial diseñados y actualizados continuamente para proporcionar la máxima estabilidad y un conjunto de herramientas exclusivas que aprovechan la potencia de RTX para flujos de trabajo creativos asistidos por IA.', 'graficas', 1099.99, 'img/5060.png', 140),
(10, 'Nuevo producto', 'Producto sin descripcion', 'Otro', 99.00, 'img/default.png', -1),
(11, 'Nuevo producto', 'Producto sin descripcion', 'Otro', 99.00, 'img/default.png', -1),
(12, 'Nuevo producto', 'Producto sin descripcion', 'Otro', 99.00, 'img/default.png', -1),
(13, 'Nuevo producto', 'Producto sin descripcion', 'Otro', 99.00, 'img/default.png', -1),
(14, 'Nuevo producto', 'Producto sin descripcion', 'Otro', 99.00, 'img/default.png', -1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `direccion` text DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `nombre`, `correo`, `contrasena`, `direccion`, `telefono`, `fecha_registro`) VALUES
(1, 'admin', 'admin@gmail.com', 'admin', '', '', '2025-06-04 17:29:45'),
(2, 'adrianito', 'adrian@gmail.com', 'holaquetal1', 'C/ Bitcoin 66 5D', '625890482', '2025-06-04 17:30:10'),
(3, 'pepe', 'pepe@gmail.com', '1234', 'C/ Pájaro', '', '2025-06-05 19:53:18'),
(4, 'juan', 'juan@gmail.com', 'holasoyjuan', '', '', '2025-06-06 09:34:29'),
(5, 'diego', 'diego@gmail.com', 'holadiego', 'C/ Lamine Yamal 4D', '625890483', '2025-06-06 09:45:02'),
(6, 'lucas', 'lucas@gmail.com', 'holalucas', 'C/ León 7D', '625890488', '2025-06-06 10:04:23');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pedido`
--
ALTER TABLE `pedido`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `pedido_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
