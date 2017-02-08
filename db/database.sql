DROP SEQUENCE IF EXISTS amp_accounts_id_seq;
CREATE SEQUENCE amp_accounts_id_seq;
CREATE TABLE public.amp_accounts (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_accounts_id_seq'::regclass),
  name CHARACTER VARYING(255),
  address CHARACTER VARYING(255),
  city CHARACTER VARYING(100),
  state CHARACTER VARYING(100),
  country CHARACTER VARYING(100),
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_by INTEGER
);
CREATE UNIQUE INDEX amp_accounts_id_uindex ON amp_accounts USING BTREE (id);

DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq;
CREATE TABLE public.amp_users (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  provider CHARACTER VARYING(25),
  service_id TEXT,
  display_name TEXT,
  token CHARACTER VARYING(128),
  users_name JSON,
  email TEXT,
  upload_id INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_by INTEGER,
  account_id INTEGER,
  password CHARACTER VARYING(255)
);
CREATE UNIQUE INDEX users_id_uindex ON amp_users USING BTREE (id);

DROP SEQUENCE IF EXISTS amp_account_users_id_seq;
CREATE SEQUENCE amp_account_users_id_seq;
CREATE TABLE public.amp_account_users (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_account_users_id_seq'::regclass),
  amp_account_id INTEGER NOT NULL,
  amp_user_id INTEGER NOT NULL,
  FOREIGN KEY (amp_account_id) REFERENCES public.amp_accounts (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_user_id) REFERENCES public.amp_users (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_account_users_id_uindex ON amp_account_users USING BTREE (id);


DROP SEQUENCE IF EXISTS amp_activity_id_seq;
CREATE SEQUENCE amp_activity_id_seq;
CREATE TABLE public.amp_activity (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_activity_id_seq'::regclass),
  account_id INTEGER DEFAULT 0,
  user_id INTEGER NOT NULL,
  action CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(255),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_by INTEGER,
  data JSON
);
CREATE UNIQUE INDEX amp_activity_id_uindex ON amp_activity USING BTREE (id);

-- ACL --

DROP SEQUENCE IF EXISTS amp_groups_id_seq;
CREATE SEQUENCE amp_groups_id_seq;
CREATE TABLE public.amp_groups (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_groups_id_seq'::regclass),
  name CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(255)
);
CREATE UNIQUE INDEX amp_groups_id_uindex ON amp_groups USING BTREE (id);


DROP SEQUENCE IF EXISTS amp_permissions_id_seq;
CREATE SEQUENCE amp_permissions_id_seq;
CREATE TABLE public.amp_permissions (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_permissions_id_seq'::regclass),
  name CHARACTER VARYING(50) NOT NULL,
  description CHARACTER VARYING(255) NOT NULL
);
CREATE UNIQUE INDEX amp_permissions_id_uindex ON amp_permissions USING BTREE (id);

DROP SEQUENCE IF EXISTS amp_roles_id_seq;
CREATE SEQUENCE amp_roles_id_seq;
CREATE TABLE public.amp_resources (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_roles_id_seq'::regclass),
  name CHARACTER VARYING(100) NOT NULL
);
CREATE UNIQUE INDEX amp_roles_id_uindex ON amp_resources USING BTREE (id);

DROP SEQUENCE IF EXISTS amp_group_resource_permissions_id_seq;
CREATE SEQUENCE amp_group_resource_permissions_id_seq;
CREATE TABLE public.amp_group_resource_permissions (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_group_resource_permissions_id_seq'::regclass),
  amp_group_id INTEGER NOT NULL,
  amp_resource_id INTEGER NOT NULL,
  amp_permission_id INTEGER NOT NULL,
  FOREIGN KEY (amp_group_id) REFERENCES public.amp_groups (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_permission_id) REFERENCES public.amp_permissions (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_resource_id) REFERENCES public.amp_resources (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_group_resource_permissions_id_uindex ON amp_group_resource_permissions USING BTREE (id);


DROP SEQUENCE IF EXISTS amp_uploads_id_seq;
CREATE SEQUENCE amp_uploads_id_seq;
CREATE TABLE public.amp_uploads (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_uploads_id_seq'::regclass),
  amp_account_id INTEGER NOT NULL,
  amp_user_id INTEGER NOT NULL,
  title CHARACTER VARYING(255),
  filename CHARACTER VARYING(255) NOT NULL,
  mime CHARACTER VARYING(50),
  extension CHARACTER VARYING(10) NOT NULL,
  filesize INTEGER NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_by INTEGER,
  FOREIGN KEY (amp_account_id) REFERENCES public.amp_accounts (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_user_id) REFERENCES public.amp_users (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_uploads_id_uindex ON amp_uploads USING BTREE (id);


DROP SEQUENCE IF EXISTS amp_user_groups_id_seq;
CREATE SEQUENCE amp_user_groups_id_seq;
CREATE TABLE public.amp_user_groups (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_user_groups_id_seq'::regclass),
  amp_user_id INTEGER NOT NULL,
  amp_group_id INTEGER NOT NULL,
  FOREIGN KEY (amp_group_id) REFERENCES public.amp_groups (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_user_id) REFERENCES public.amp_users (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_user_groups_id_uindex ON amp_user_groups USING BTREE (id);


DROP SEQUENCE IF EXISTS amp_user_roles_id_seq;
CREATE SEQUENCE amp_user_roles_id_seq;
CREATE TABLE public.amp_user_roles (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_user_roles_id_seq'::regclass),
  amp_user_id INTEGER NOT NULL,
  amp_role_id INTEGER NOT NULL,
  FOREIGN KEY (amp_role_id) REFERENCES public.amp_resources (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE,
  FOREIGN KEY (amp_user_id) REFERENCES public.amp_users (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_user_roles_id_uindex ON amp_user_roles USING BTREE (id);


CREATE TYPE E_CONTACT_METHOD AS ENUM ('email','sms', 'message');

DROP SEQUENCE IF EXISTS amp_user_settings_id_seq;
CREATE SEQUENCE amp_user_settings_id_seq;
CREATE TABLE public.amp_user_settings (
  id INTEGER PRIMARY KEY NOT NULL DEFAULT nextval('amp_user_settings_id_seq'::regclass),
  user_id INTEGER NOT NULL,
  phone_number CHARACTER VARYING(25),
  contact_method E_CONTACT_METHOD NOT NULL DEFAULT 'email'::e_contact_method,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  deleted_at TIMESTAMP WITHOUT TIME ZONE,
  deleted_by INTEGER,
  send_messages BOOLEAN NOT NULL DEFAULT true,
  FOREIGN KEY (user_id) REFERENCES public.amp_users (id)
  MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE
);
CREATE UNIQUE INDEX amp_user_settings_id_uindex ON amp_user_settings USING BTREE (id);
CREATE UNIQUE INDEX amp_user_settings_user_id_uindex ON amp_user_settings USING BTREE (user_id);
