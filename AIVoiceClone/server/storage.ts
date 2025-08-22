import { type WalletOwner, type InsertWalletOwner, type UpdateWalletOwner, walletOwners } from "@shared/schema";
import { db } from "./db";
import { eq, or, ilike } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // Wallet Owner operations
  getAllWalletOwners(): Promise<WalletOwner[]>;
  getWalletOwner(id: string): Promise<WalletOwner | undefined>;
  getWalletOwnerByIdCard(idCard: string): Promise<WalletOwner | undefined>;
  getWalletOwnerByWalletNumber(walletNumber: string): Promise<WalletOwner | undefined>;
  createWalletOwner(owner: InsertWalletOwner): Promise<WalletOwner>;
  updateWalletOwner(id: string, updates: Partial<InsertWalletOwner>): Promise<WalletOwner | undefined>;
  deleteWalletOwner(id: string): Promise<boolean>;
  searchWalletOwners(query: string): Promise<WalletOwner[]>;
}

export class MemStorage implements IStorage {
  private walletOwners: Map<string, WalletOwner>;

  constructor() {
    this.walletOwners = new Map();
  }

  async getAllWalletOwners(): Promise<WalletOwner[]> {
    return Array.from(this.walletOwners.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getWalletOwner(id: string): Promise<WalletOwner | undefined> {
    return this.walletOwners.get(id);
  }

  async getWalletOwnerByIdCard(idCard: string): Promise<WalletOwner | undefined> {
    return Array.from(this.walletOwners.values()).find(
      (owner) => owner.idCard === idCard
    );
  }

  async getWalletOwnerByWalletNumber(walletNumber: string): Promise<WalletOwner | undefined> {
    return Array.from(this.walletOwners.values()).find(
      (owner) => owner.walletNumber === walletNumber
    );
  }

  async createWalletOwner(insertOwner: InsertWalletOwner): Promise<WalletOwner> {
    const id = randomUUID();
    const owner: WalletOwner = {
      ...insertOwner,
      id,
      createdAt: new Date(),
    };
    this.walletOwners.set(id, owner);
    return owner;
  }

  async updateWalletOwner(id: string, updates: Partial<InsertWalletOwner>): Promise<WalletOwner | undefined> {
    const existing = this.walletOwners.get(id);
    if (!existing) return undefined;

    const updated: WalletOwner = {
      ...existing,
      ...updates,
    };
    this.walletOwners.set(id, updated);
    return updated;
  }

  async deleteWalletOwner(id: string): Promise<boolean> {
    return this.walletOwners.delete(id);
  }

  async searchWalletOwners(query: string): Promise<WalletOwner[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.walletOwners.values())
      .filter(owner => 
        owner.name.toLowerCase().includes(lowerQuery) ||
        owner.idCard.includes(lowerQuery) ||
        owner.walletNumber.includes(lowerQuery) ||
        (owner.phone && owner.phone.includes(lowerQuery))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getAllWalletOwners(): Promise<WalletOwner[]> {
    const result = await db.select().from(walletOwners).orderBy(walletOwners.createdAt);
    return result.reverse(); // Latest first
  }

  async getWalletOwner(id: string): Promise<WalletOwner | undefined> {
    const [result] = await db.select().from(walletOwners).where(eq(walletOwners.id, id));
    return result;
  }

  async getWalletOwnerByIdCard(idCard: string): Promise<WalletOwner | undefined> {
    const [result] = await db.select().from(walletOwners).where(eq(walletOwners.idCard, idCard));
    return result;
  }

  async getWalletOwnerByWalletNumber(walletNumber: string): Promise<WalletOwner | undefined> {
    const [result] = await db.select().from(walletOwners).where(eq(walletOwners.walletNumber, walletNumber));
    return result;
  }

  async createWalletOwner(insertOwner: InsertWalletOwner): Promise<WalletOwner> {
    const [result] = await db.insert(walletOwners).values({
      ...insertOwner,
      phone: insertOwner.phone || null
    }).returning();
    return result;
  }

  async updateWalletOwner(id: string, updates: Partial<InsertWalletOwner>): Promise<WalletOwner | undefined> {
    const [result] = await db
      .update(walletOwners)
      .set(updates)
      .where(eq(walletOwners.id, id))
      .returning();
    return result;
  }

  async deleteWalletOwner(id: string): Promise<boolean> {
    const result = await db.delete(walletOwners).where(eq(walletOwners.id, id));
    return (result.rowCount || 0) > 0;
  }

  async searchWalletOwners(query: string): Promise<WalletOwner[]> {
    const searchPattern = `%${query}%`;
    const result = await db
      .select()
      .from(walletOwners)
      .where(
        or(
          ilike(walletOwners.name, searchPattern),
          ilike(walletOwners.idCard, searchPattern),
          ilike(walletOwners.walletNumber, searchPattern),
          ilike(walletOwners.phone, searchPattern)
        )
      )
      .orderBy(walletOwners.createdAt);
    return result.reverse(); // Latest first
  }
}

export const storage = new DatabaseStorage();
