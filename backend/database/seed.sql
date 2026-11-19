-- SkillUp Campus - Datos iniciales para desarrollo local
-- Ejecutar DESPUES de schema.sql, conectado a la base de datos del proyecto.
-- Reejecutable: no duplica roles, categorias, niveles ni los cursos de ejemplo.
-- No elimina ni modifica registros existentes.

BEGIN;

-- Roles usados por la autenticacion y autorizacion.
INSERT INTO public.roles (name)
VALUES ('Administrator'), ('Teacher'), ('Student')
ON CONFLICT (name) DO NOTHING;

-- Usuario de ejemplo y también se crea administrador
CREATE EXTENSION IF NOT EXISTS pgcrypto;
WITH nuevo_usuario AS (
  INSERT INTO public.users (
    name,
    surname,
    email,
    username,
    password,
    country,
    address,
    telephone,
    role_id
  ) VALUES
  (
    'Carlos',
    'Admin',
    'carlos.admin@ejemplo.com',
    'carlosadmin',
    crypt('AdminSeguro123', gen_salt('bf', 10)),
    'Argentina',
    'Av. Corrientes 450',
    '+54 11 4567890',
    1 -- Verifica que el ID 1 corresponda al rol 'administrator'
  )
  RETURNING id
)
INSERT INTO public.admins (user_id)
SELECT id
FROM nuevo_usuario;

-- Usuario de ejemplo y también se crea profesor.
WITH nuevo_usuario AS (
  INSERT INTO public.users (
    name,
    surname,
    email,
    username,
    password,
    country,
    address,
    telephone,
    role_id
  ) VALUES
  (
    'Laura',
    'Profe',
    'laura.profe@ejemplo.com',
    'lauraprofe',
    crypt('ProfeSegura123', gen_salt('bf', 10)),
    'Argentina',
    'San Martín 890',
    '+54 351 7654321',
    2 -- Verifica que el ID 2 corresponda al rol 'teacher'
  )
  RETURNING id
)
INSERT INTO public.teachers (user_id)
SELECT id
FROM nuevo_usuario;

-- Usuario de ejemplo y también se crea estudiante.
WITH nuevo_usuario AS (
  INSERT INTO public.users (
    name,
    surname,
    email,
    username,
    password,
    country,
    address,
    telephone,
    role_id
  ) VALUES
  (
    'María',
    'Marta',
    'maria.marta@ejemplo.com',
    'mariamarta',
    crypt('mariaMARTA123', gen_salt('bf', 10)),
    'Argentina',
    'Libertad 123',
    '+54 11 9876543',
    3 -- Verifica que el ID 3 corresponda al rol 'student'
  )
  RETURNING id
)
INSERT INTO public.students (user_id, average_grade)
SELECT id, NULL
FROM nuevo_usuario;

-- Categorias disponibles para el catalogo.
INSERT INTO public.categories (name, description)
VALUES
  ('Programación', 'Desarrollo de software y programación'),
  ('Diseño', 'Diseño visual y experiencia de usuario'),
  ('Marketing', 'Marketing y comunicación digital'),
  ('Datos', 'Análisis y gestión de datos'),
  ('Negocios', 'Gestión y emprendimientos')
ON CONFLICT (name) DO NOTHING;

-- Niveles de dificultad.
INSERT INTO public.levels (name)
VALUES ('Principiante'), ('Intermedio'), ('Avanzado')
ON CONFLICT (name) DO NOTHING;

-- Cursos de demostracion. Los IDs de categorias y niveles se buscan por nombre,
-- porque las secuencias IDENTITY pueden generar IDs distintos en cada equipo.
WITH cursos_ejemplo (title, description, category_name, level_name, duration_minutes, price) AS (
  VALUES
    ('Introducción al desarrollo web', 'Conocé los fundamentos de HTML, CSS y JavaScript para crear sitios web.', 'Programación', 'Principiante', 960, 0.00::numeric),
    ('Diseño de experiencias digitales', 'Aprendé principios de UX/UI y diseño de interfaces centradas en las personas.', 'Diseño', 'Principiante', 720, 0.00::numeric),
    ('Primeros pasos en análisis de datos', 'Explorá datos, identificá patrones y comunicá hallazgos.', 'Datos', 'Principiante', 840, 0.00::numeric),
    ('Python desde cero', 'Introducción a variables, estructuras de control, funciones y colecciones.', 'Programación', 'Principiante', 1200, 0.00::numeric),
    ('Marketing digital para emprendedores', 'Conocé los fundamentos de contenidos, campañas y métricas digitales.', 'Marketing', 'Principiante', 600, 0.00::numeric),
    ('Gestión de proyectos', 'Planificación, seguimiento y colaboración en proyectos de equipos.', 'Negocios', 'Intermedio', 900, 0.00::numeric)
)
INSERT INTO public.courses (title, description, category_id, level_id, duration_minutes, price, image_url)
SELECT c.title, c.description, cat.id, lvl.id, c.duration_minutes, c.price, NULL
FROM cursos_ejemplo AS c
JOIN public.categories AS cat ON cat.name = c.category_name
JOIN public.levels AS lvl ON lvl.name = c.level_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses AS existing WHERE existing.title = c.title
);

COMMIT;

-- Consultas de verificacion (solo lectura).
SELECT 'roles' AS tabla, COUNT(*) AS cantidad FROM public.roles
UNION ALL SELECT 'categories', COUNT(*) FROM public.categories
UNION ALL SELECT 'levels', COUNT(*) FROM public.levels
UNION ALL SELECT 'courses', COUNT(*) FROM public.courses;