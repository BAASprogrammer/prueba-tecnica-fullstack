--
-- PostgreSQL database dump (Updated for new schema)
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Cliente" (id, nombre, email, telefono, "createdAt", "updatedAt") VALUES
(1, 'Rodrigo Alarcón', 'rodrigo.alarcon@correo.cl', '+56911122233', NOW(), NOW()),
(2, 'Fernanda Espinoza', 'fernanda.espinoza@mail.com', '+56922233344', NOW(), NOW()),
(3, 'Ignacio Bravo', 'ignacio.bravo@empresa.cl', '+56933344455', NOW(), NOW()),
(4, 'Josefa Reyes', 'josefa.reyes@gmail.com', '+56944455566', NOW(), NOW()),
(5, 'Sebastián Contreras', 'sebastian.contreras@outlook.com', '+56955566677', NOW(), NOW()),
(6, 'Antonia Sepúlveda', 'antonia.sepulveda@hotmail.com', '+56966677788', NOW(), NOW());

--
-- Data for Name: Solicitud; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."Solicitud" (id, numero, fecha, tipo, descripcion, estado, "clienteId", "createdAt", "updatedAt") VALUES
(1, 'REQ-2026-001', NOW(), 'Reclamo por servicio', 'El técnico no llegó en el horario acordado y no hubo aviso previo', 'PENDIENTE', 1, NOW(), NOW()),
(2, 'REQ-2026-002', NOW(), 'Consulta de contrato', 'Necesita copia del contrato firmado el año pasado', 'FINALIZADA', 2, NOW(), NOW()),
(3, 'REQ-2026-003', NOW(), 'Solicitud de upgrade', 'Quiere aumentar la velocidad de su plan actual', 'EN_PROCESO', 3, NOW(), NOW()),
(4, 'REQ-2026-004', NOW(), 'Reclamo por servicio', 'Corte de servicio recurrente en horario de la tarde', 'PENDIENTE', 4, NOW(), NOW()),
(5, 'REQ-2026-005', NOW(), 'Cambio de titular', 'Solicita transferir el servicio a nombre de un familiar', 'EN_PROCESO', 5, NOW(), NOW()),
(6, 'REQ-2026-006', NOW(), 'Consulta de contrato', 'Duda sobre cláusula de renovación automática', 'RECHAZADA', 6, NOW(), NOW()),
(7, 'REQ-2026-007', NOW(), 'Reclamo por servicio', 'Equipo entregado con daños visibles en la carcasa', 'PENDIENTE', 1, NOW(), NOW()),
(8, 'REQ-2026-008', NOW(), 'Solicitud de upgrade', 'Interesado en agregar línea adicional al plan familiar', 'FINALIZADA', 2, NOW(), NOW()),
(9, 'REQ-2026-009', NOW(), 'Cambio de titular', 'Cambio de domicilio con mantención del mismo número', 'EN_PROCESO', 3, NOW(), NOW()),
(10, 'REQ-2026-010', NOW(), 'Reclamo por servicio', 'Factura llegó con un monto distinto al plan contratado', 'PENDIENTE', 4, NOW(), NOW()),
(11, 'REQ-2026-011', NOW(), 'Consulta de contrato', 'Solicita información sobre penalidad por término anticipado', 'RECHAZADA', 5, NOW(), NOW()),
(12, 'REQ-2026-012', NOW(), 'Solicitud de upgrade', 'Quiere sumar servicio de streaming al plan actual', 'FINALIZADA', 6, NOW(), NOW());

--
-- Set sequence values
--

SELECT pg_catalog.setval('public."Cliente_id_seq"', 6, true);
SELECT pg_catalog.setval('public."Solicitud_id_seq"', 12, true);
