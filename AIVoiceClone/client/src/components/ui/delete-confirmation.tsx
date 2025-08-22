import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  ownerName?: string;
}

export default function DeleteConfirmation({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading, 
  ownerName 
}: DeleteConfirmationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-destructive text-4xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">تأكيد الحذف</h3>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            هل أنت متأكد من حذف بيانات المالك{" "}
            {ownerName && (
              <span className="font-semibold">"{ownerName}"</span>
            )}؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div className="flex space-x-reverse space-x-3">
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              data-testid="button-confirm-delete"
              className="flex-1 bg-destructive text-white hover:bg-red-600 transition-colors"
            >
              {isLoading ? "جاري الحذف..." : "نعم، احذف"}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              variant="outline"
              data-testid="button-cancel-delete"
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
