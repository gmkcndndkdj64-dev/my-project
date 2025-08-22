import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWalletOwnerSchema, type InsertWalletOwner, type WalletOwner } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OwnerFormProps {
  owner?: WalletOwner | null;
  onSubmit: (data: InsertWalletOwner) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function OwnerForm({ owner, onSubmit, onCancel, isLoading }: OwnerFormProps) {
  const form = useForm<InsertWalletOwner>({
    resolver: zodResolver(insertWalletOwnerSchema),
    defaultValues: {
      name: "",
      idCard: "",
      walletNumber: "",
      phone: "",
    },
  });

  // Reset form when owner changes
  useEffect(() => {
    if (owner) {
      form.reset({
        name: owner.name,
        idCard: owner.idCard,
        walletNumber: owner.walletNumber,
        phone: owner.phone || "",
      });
    } else {
      form.reset({
        name: "",
        idCard: "",
        walletNumber: "",
        phone: "",
      });
    }
  }, [owner, form]);

  const handleSubmit = (data: InsertWalletOwner) => {
    onSubmit(data);
    if (!owner) {
      form.reset();
    }
  };

  const isEditing = !!owner;

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <i className="fas fa-user-plus text-primary ml-2"></i>
          <span data-testid="text-form-title">
            {isEditing ? "تعديل بيانات المالك" : "تسجيل مالك جديد"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              اسم المالك *
            </Label>
            <Input
              id="name"
              data-testid="input-name"
              placeholder="أدخل اسم المالك"
              {...form.register("name")}
              className="w-full"
            />
            {form.formState.errors.name && (
              <p className="text-destructive text-sm mt-1" data-testid="error-name">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-2">
              رقم البطاقة *
            </Label>
            <Input
              id="idCard"
              data-testid="input-id-card"
              placeholder="أدخل رقم البطاقة"
              {...form.register("idCard")}
              className="w-full"
            />
            {form.formState.errors.idCard && (
              <p className="text-destructive text-sm mt-1" data-testid="error-id-card">
                {form.formState.errors.idCard.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="walletNumber" className="block text-sm font-medium text-gray-700 mb-2">
              رقم المحفظة *
            </Label>
            <Input
              id="walletNumber"
              data-testid="input-wallet-number"
              placeholder="أدخل رقم المحفظة"
              {...form.register("walletNumber")}
              className="w-full"
            />
            {form.formState.errors.walletNumber && (
              <p className="text-destructive text-sm mt-1" data-testid="error-wallet-number">
                {form.formState.errors.walletNumber.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف
            </Label>
            <Input
              id="phone"
              type="tel"
              data-testid="input-phone"
              placeholder="أدخل رقم الهاتف (اختياري)"
              {...form.register("phone")}
              className="w-full"
            />
            {form.formState.errors.phone && (
              <p className="text-destructive text-sm mt-1" data-testid="error-phone">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          <div className="flex space-x-reverse space-x-3">
            <Button 
              type="submit" 
              disabled={isLoading}
              data-testid="button-submit"
              className="flex-1 bg-primary text-white hover:bg-primary-dark transition-colors flex items-center justify-center space-x-reverse space-x-2"
            >
              <i className={`fas ${isEditing ? 'fa-save' : 'fa-plus'}`}></i>
              <span>{isEditing ? "حفظ التغييرات" : "تسجيل المالك"}</span>
            </Button>
            {isEditing && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onCancel}
                data-testid="button-cancel"
                className="px-4 py-2"
              >
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
