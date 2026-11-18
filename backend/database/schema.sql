-- SkillUp Campus: esquema revisado a partir del SQL del equipo.
-- Ejecutar en una base vacía; IF NOT EXISTS no modifica tablas ya existentes.
-- Requiere que exista el rol de PostgreSQL skillup_user.
/* Script para crear las 16 tablas (Owner skillup_user):
	roles, users, categories, levels, courses, enrollments, teachers, admins, students, course_teachers, modules, lessons, lesson_progress, course_reviews, jobs y password_reset_tokens
*/
-- Se crean en el esquema public y en el TABLESPACE pg_default, que son los por defecto de postgreSQL. 

BEGIN;
	-- 1. roles
	CREATE TABLE IF NOT EXISTS public.roles
	(
		id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
		name character varying(15) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT roles_pkey PRIMARY KEY (id)
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.roles
		OWNER to skillup_user;

	-- 2. users (depende de roles)
	CREATE TABLE IF NOT EXISTS public.users
	(
		id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
		name character varying(100) COLLATE pg_catalog."default" NOT NULL,
		surname character varying(100) COLLATE pg_catalog."default" NOT NULL,
		email character varying(100) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		username character varying(100) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		password character varying(255) COLLATE pg_catalog."default" NOT NULL,
		country character varying(50) COLLATE pg_catalog."default" NOT NULL,
		address character varying(100) COLLATE pg_catalog."default",
		telephone character varying(25) COLLATE pg_catalog."default",
		role_id smallint NOT NULL,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT users_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_role.id" FOREIGN KEY (role_id)
			REFERENCES public.roles (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)
	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.users
		OWNER to skillup_user;

	--3. categories
	CREATE TABLE IF NOT EXISTS public.categories
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		name character varying(100) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		description character varying(100) COLLATE pg_catalog."default",
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT categories_pkey PRIMARY KEY (id)
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.categories
		OWNER to skillup_user;

	--4. levels
	CREATE TABLE IF NOT EXISTS public.levels
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		name character varying(15) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT levels_pkey PRIMARY KEY (id)
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.levels
		OWNER to skillup_user;

	-- 5. courses
	CREATE TABLE IF NOT EXISTS public.courses
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		title character varying(150) COLLATE pg_catalog."default" NOT NULL,
		description TEXT COLLATE pg_catalog."default" NOT NULL,
		category_id integer NOT NULL,
		duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
		image_url TEXT COLLATE pg_catalog."default",
		price NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
		level_id integer NOT NULL,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT courses_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_categories.id" FOREIGN KEY (category_id)
			REFERENCES public.categories (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		CONSTRAINT "FK_levels.id" FOREIGN KEY (level_id)
			REFERENCES public.levels (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.courses
		OWNER to skillup_user;

	-- 6. enrollments (depende de users y courses)
	CREATE TABLE IF NOT EXISTS public.enrollments
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		user_id bigint NOT NULL,
		course_id integer NOT NULL,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT enrollments_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_users.id" FOREIGN KEY (user_id)
			REFERENCES public.users (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		CONSTRAINT "FK_courses.id" FOREIGN KEY (course_id)
			REFERENCES public.courses (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		--Para evitar que un estudiante se inscriba al mismo curso más de una vez
		CONSTRAINT unique_user_course_enrollment UNIQUE (user_id, course_id)
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.enrollments
		OWNER to skillup_user;

	-- 7. teachers (depende de users)
	CREATE TABLE IF NOT EXISTS public.teachers
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		user_id bigint NOT NULL UNIQUE,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT teachers_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_users.id" FOREIGN KEY (user_id)
			REFERENCES public.users (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.teachers
		OWNER to skillup_user;

	-- 8. admins (depende de users)
	CREATE TABLE IF NOT EXISTS public.admins
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		user_id bigint NOT NULL UNIQUE,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT admins_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_users.id" FOREIGN KEY (user_id)
			REFERENCES public.users (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.admins
		OWNER to skillup_user;

	-- 9. students (depende de users)
	CREATE TABLE IF NOT EXISTS public.students
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		user_id bigint NOT NULL UNIQUE,
		average_grade NUMERIC(4,2) CHECK (average_grade BETWEEN 1 AND 10),
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		updated_at timestamp with time zone,
		CONSTRAINT students_pkey PRIMARY KEY (id),
		CONSTRAINT "FK_users.id" FOREIGN KEY (user_id)
			REFERENCES public.users (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.students
		OWNER to skillup_user;
	
	-- 10. course_teachers (depende de teacher y courses, tabla intermedia)
	CREATE TABLE IF NOT EXISTS public.course_teachers
	(
		teacher_id integer NOT NULL,
		course_id integer NOT NULL,
		assigned_at timestamp with time zone NOT NULL DEFAULT NOW(),
		CONSTRAINT course_teachers_pkey PRIMARY KEY (teacher_id, course_id),
		CONSTRAINT "FK_courses.id" FOREIGN KEY (course_id)
			REFERENCES public.courses (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		CONSTRAINT "FK_teachers.id" FOREIGN KEY (teacher_id)
			REFERENCES public.teachers (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.course_teachers
		OWNER to skillup_user;
	
	-- 11. modules (depende de courses)
	CREATE TABLE IF NOT EXISTS public.modules
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		course_id integer NOT NULL,
		title character varying(150) COLLATE pg_catalog."default" NOT NULL,
		description TEXT COLLATE pg_catalog."default",
		position integer NOT NULL CHECK (position > 0),
		CONSTRAINT modules_pkey PRIMARY KEY (id),
		CONSTRAINT unique_course_module_position UNIQUE (course_id, position),
		CONSTRAINT "FK_courses.id" FOREIGN KEY (course_id)
			REFERENCES public.courses (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)
	
	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.modules
		OWNER to skillup_user;
	
	-- 12. lessons (depende de modules)
	CREATE TABLE IF NOT EXISTS public.lessons
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		module_id integer NOT NULL,
		title character varying(150) COLLATE pg_catalog."default" NOT NULL,
		content TEXT COLLATE pg_catalog."default" NOT NULL,
		media_url TEXT COLLATE pg_catalog."default",
		duration_minutes integer CHECK (duration_minutes > 0),
		position integer NOT NULL CHECK (position > 0),
		CONSTRAINT lessons_pkey PRIMARY KEY (id),
		CONSTRAINT unique_module_lesson_position UNIQUE (module_id, position),
		CONSTRAINT "FK_modules.id" FOREIGN KEY (module_id)
			REFERENCES public.modules (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)
	
	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.lessons
		OWNER to skillup_user;
	
	-- 13. lesson_progress (depende de enrollments y lessons, tabla intermedia)
	CREATE TABLE IF NOT EXISTS public.lesson_progress
	(
		enrollment_id integer NOT NULL,
		lesson_id integer NOT NULL,
		completed BOOLEAN NOT NULL DEFAULT FALSE,
		completed_at timestamp with time zone,
		CONSTRAINT lesson_progress_pkey PRIMARY KEY (enrollment_id, lesson_id),
		CONSTRAINT "FK_enrollments.id" FOREIGN KEY (enrollment_id)
			REFERENCES public.enrollments (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		CONSTRAINT "FK_lessons.id" FOREIGN KEY (lesson_id)
			REFERENCES public.lessons (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.lesson_progress
		OWNER to skillup_user;

	-- 14. course_reviews (depende de courses y users)
	CREATE TABLE IF NOT EXISTS public.course_reviews
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		course_id integer NOT NULL,
		user_id bigint NOT NULL,
		rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
		comment TEXT COLLATE pg_catalog."default",
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		CONSTRAINT course_reviews_pkey PRIMARY KEY (id),
		CONSTRAINT unique_user_course_review UNIQUE (user_id, course_id),
		CONSTRAINT "FK_courses.id" FOREIGN KEY (course_id)
			REFERENCES public.courses (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION,
		CONSTRAINT "FK_users.id" FOREIGN KEY (user_id)
			REFERENCES public.users (id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)
	
	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.course_reviews
		OWNER to skillup_user;

	-- 15. jobs
	CREATE TABLE IF NOT EXISTS public.jobs
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		title character varying(150) COLLATE pg_catalog."default" NOT NULL,
		company character varying(150) COLLATE pg_catalog."default" NOT NULL,
		description TEXT COLLATE pg_catalog."default" NOT NULL,
		modality character varying(30) COLLATE pg_catalog."default",
		application_url TEXT COLLATE pg_catalog."default",
		is_active BOOLEAN NOT NULL DEFAULT FALSE,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		CONSTRAINT jobs_pkey PRIMARY KEY (id)
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.jobs
		OWNER to skillup_user;

	-- 16. password_reset_tokens
	CREATE TABLE IF NOT EXISTS public.password_reset_tokens
	(
		id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
		user_id bigint NOT NULL,
		token_hash character varying(255) COLLATE pg_catalog."default" NOT NULL UNIQUE,
		expired_at timestamp with time zone NOT NULL,
		used_at timestamp with time zone,
		created_at timestamp with time zone NOT NULL DEFAULT NOW(),
		CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
		CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id)
			REFERENCES public.users(id) MATCH SIMPLE
			ON UPDATE NO ACTION
			ON DELETE NO ACTION
	)

	TABLESPACE pg_default;

	ALTER TABLE IF EXISTS public.password_reset_tokens
		OWNER to skillup_user;
COMMIT;