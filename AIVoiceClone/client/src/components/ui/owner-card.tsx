import type { WalletOwner } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OwnerCardProps {
  owner: WalletOwner;
  onEdit: (owner: WalletOwner) => void;
  onDelete: (owner: WalletOwner) => void;
}

export default function OwnerCard({ owner, onEdit, onDelete }: OwnerCardProps) {
  return (
    <Card className="border-r-4 border-r-primary hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-reverse space-x-2">
            <i className="fas fa-user text-primary text-lg"></i>
            <h4 className="font-semibold text-gray-800" data-testid={`text-owner-name-${owner.id}`}>
              {owner.name}
            </h4>
          </div>
          <div className="flex items-center space-x-reverse space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(owner)}
              data-testid={`button-edit-${owner.id}`}
              className="text-primary hover:text-primary-dark p-1"
              title="تعديل"
            >
              <i className="fas fa-edit"></i>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(owner)}
              data-testid={`button-delete-${owner.id}`}
              className="text-destructive hover:text-red-600 p-1"
              title="حذف"
            >
              <i className="fas fa-trash"></i>
            </Button>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <i className="fas fa-id-card text-gray-400 w-4 ml-2"></i>
            <span className="text-gray-600">رقم البطاقة:</span>
            <span className="font-mono mr-2" data-testid={`text-id-card-${owner.id}`}>
              {owner.idCard}
            </span>
          </div>
          <div className="flex items-center">
            <i className="fas fa-wallet text-gray-400 w-4 ml-2"></i>
            <span className="text-gray-600">رقم المحفظة:</span>
            <span className="font-mono mr-2" data-testid={`text-wallet-number-${owner.id}`}>
              {owner.walletNumber}
            </span>
          </div>
          {owner.phone && (
            <div className="flex items-center">
              <i className="fas fa-phone text-gray-400 w-4 ml-2"></i>
              <span className="text-gray-600">الهاتف:</span>
              <span className="font-mono mr-2" data-testid={`text-phone-${owner.id}`}>
                {owner.phone}
              </span>
            </div>
          )}
          <div className="flex items-center text-xs text-gray-500 mt-3">
            <i className="fas fa-clock ml-1"></i>
            <span data-testid={`text-created-date-${owner.id}`}>
              تم التسجيل: {new Date(owner.createdAt).toLocaleDateString('ar-SA')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
