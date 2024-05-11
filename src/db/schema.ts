import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

// BOOKS TABLE
export const books = pgTable('Books', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  desc: text('desc'),
  userId: integer('user_id'),
  status: varchar('status'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  publishedAt: timestamp('published_at'),
});

export const bookRelations = relations(books, ({ one }) => ({
  user: one(users, {
    fields: [books.userId],
    references: [users.id],
  }),
}));

// USERS TABLE
export const users = pgTable('Users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 60 }).notNull(),
  username: varchar('username', { length: 80 }),
});

export const profiles = pgTable('Profiles', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }),
  bio: varchar('bio', { length: 256 }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
});

export const userRelations = relations(users, ({ one, many }) => ({
  books: many(books),
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}));
