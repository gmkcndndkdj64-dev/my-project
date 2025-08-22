import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const walletOwners = pgTable("wallet_owners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  idCard: text("id_card").notNull().unique(),
  walletNumber: text("wallet_number").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWalletOwnerSchema = createInsertSchema(walletOwners).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(1, "اسم المالك مطلوب"),
  idCard: z.string().min(1, "رقم البطاقة مطلوب"),
  walletNumber: z.string().min(1, "رقم المحفظة مطلوب"),
  phone: z.string().optional(),
});

export const updateWalletOwnerSchema = insertWalletOwnerSchema.partial().extend({
  id: z.string(),
});

export type InsertWalletOwner = z.infer<typeof insertWalletOwnerSchema>;
export type UpdateWalletOwner = z.infer<typeof updateWalletOwnerSchema>;
export type WalletOwner = typeof walletOwners.$inferSelect;
