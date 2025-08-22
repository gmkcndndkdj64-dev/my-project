import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWalletOwnerSchema, updateWalletOwnerSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all wallet owners
  app.get("/api/wallet-owners", async (req, res) => {
    try {
      const owners = await storage.getAllWalletOwners();
      res.json(owners);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات المالكين" });
    }
  });

  // Search wallet owners
  app.get("/api/wallet-owners/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "استعلام البحث مطلوب" });
      }
      
      const owners = await storage.searchWalletOwners(q);
      res.json(owners);
    } catch (error) {
      res.status(500).json({ message: "خطأ في البحث" });
    }
  });

  // Get single wallet owner
  app.get("/api/wallet-owners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const owner = await storage.getWalletOwner(id);
      
      if (!owner) {
        return res.status(404).json({ message: "المالك غير موجود" });
      }
      
      res.json(owner);
    } catch (error) {
      res.status(500).json({ message: "خطأ في جلب بيانات المالك" });
    }
  });

  // Create wallet owner
  app.post("/api/wallet-owners", async (req, res) => {
    try {
      const validatedData = insertWalletOwnerSchema.parse(req.body);
      
      // Check for duplicate ID card
      const existingByIdCard = await storage.getWalletOwnerByIdCard(validatedData.idCard);
      if (existingByIdCard) {
        return res.status(400).json({ message: "رقم البطاقة مسجل مسبقاً" });
      }
      
      // Check for duplicate wallet number
      const existingByWallet = await storage.getWalletOwnerByWalletNumber(validatedData.walletNumber);
      if (existingByWallet) {
        return res.status(400).json({ message: "رقم المحفظة مسجل مسبقاً" });
      }
      
      const owner = await storage.createWalletOwner(validatedData);
      res.status(201).json(owner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }
      res.status(500).json({ message: "خطأ في إنشاء المالك" });
    }
  });

  // Update wallet owner
  app.put("/api/wallet-owners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateWalletOwnerSchema.parse({ ...req.body, id });
      
      const existing = await storage.getWalletOwner(id);
      if (!existing) {
        return res.status(404).json({ message: "المالك غير موجود" });
      }
      
      // Check for duplicate ID card (excluding current owner)
      if (validatedData.idCard && validatedData.idCard !== existing.idCard) {
        const existingByIdCard = await storage.getWalletOwnerByIdCard(validatedData.idCard);
        if (existingByIdCard) {
          return res.status(400).json({ message: "رقم البطاقة مسجل مسبقاً" });
        }
      }
      
      // Check for duplicate wallet number (excluding current owner)
      if (validatedData.walletNumber && validatedData.walletNumber !== existing.walletNumber) {
        const existingByWallet = await storage.getWalletOwnerByWalletNumber(validatedData.walletNumber);
        if (existingByWallet) {
          return res.status(400).json({ message: "رقم المحفظة مسجل مسبقاً" });
        }
      }
      
      const { id: _, ...updateData } = validatedData;
      const updatedOwner = await storage.updateWalletOwner(id, updateData);
      
      if (!updatedOwner) {
        return res.status(404).json({ message: "المالك غير موجود" });
      }
      
      res.json(updatedOwner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return res.status(400).json({ message: firstError.message });
      }
      res.status(500).json({ message: "خطأ في تحديث المالك" });
    }
  });

  // Delete wallet owner
  app.delete("/api/wallet-owners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteWalletOwner(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "المالك غير موجود" });
      }
      
      res.json({ message: "تم حذف المالك بنجاح" });
    } catch (error) {
      res.status(500).json({ message: "خطأ في حذف المالك" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
