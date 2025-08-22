import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { WalletOwner, InsertWalletOwner } from "@shared/schema";
import OwnerForm from "@/components/ui/owner-form";
import OwnerCard from "@/components/ui/owner-card";
import SearchBar from "@/components/ui/search-bar";
import DeleteConfirmation from "@/components/ui/delete-confirmation";

export default function WalletOwnersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingOwner, setEditingOwner] = useState<WalletOwner | null>(null);
  const [deleteOwner, setDeleteOwner] = useState<WalletOwner | null>(null);
  const [sortBy, setSortBy] = useState<"name" | "date">("date");
  const { toast } = useToast();

  // Fetch all owners or search results
  const { data: owners = [], isLoading } = useQuery({
    queryKey: searchQuery 
      ? ["/api/wallet-owners/search", searchQuery]
      : ["/api/wallet-owners"],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/wallet-owners/search?q=${encodeURIComponent(searchQuery)}`
        : `/api/wallet-owners`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      return response.json();
    },
    enabled: true,
  }) as { data: WalletOwner[], isLoading: boolean };

  // Create owner mutation
  const createOwnerMutation = useMutation({
    mutationFn: async (owner: InsertWalletOwner) => {
      const response = await fetch("/api/wallet-owners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(owner),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطأ في إنشاء المالك");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-owners"] });
      toast({ title: "تم تسجيل المالك بنجاح" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "خطأ في التسجيل", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Update owner mutation
  const updateOwnerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertWalletOwner }) => {
      const response = await fetch(`/api/wallet-owners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطأ في تحديث المالك");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-owners"] });
      setEditingOwner(null);
      toast({ title: "تم تحديث بيانات المالك بنجاح" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "خطأ في التحديث", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete owner mutation
  const deleteOwnerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/wallet-owners/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "خطأ في حذف المالك");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wallet-owners"] });
      setDeleteOwner(null);
      toast({ title: "تم حذف المالك بنجاح" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "خطأ في الحذف", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSubmit = (data: InsertWalletOwner) => {
    if (editingOwner) {
      updateOwnerMutation.mutate({ id: editingOwner.id, data });
    } else {
      createOwnerMutation.mutate(data);
    }
  };

  const handleEdit = (owner: WalletOwner) => {
    setEditingOwner(owner);
  };

  const handleCancelEdit = () => {
    setEditingOwner(null);
  };

  const handleDeleteClick = (owner: WalletOwner) => {
    setDeleteOwner(owner);
  };

  const handleDeleteConfirm = () => {
    if (deleteOwner) {
      deleteOwnerMutation.mutate(deleteOwner.id);
    }
  };

  const handleExport = () => {
    if (owners.length === 0) {
      toast({ 
        title: "لا توجد بيانات للتصدير",
        variant: "destructive" 
      });
      return;
    }

    const dataStr = JSON.stringify(owners, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wallet_owners_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "تم تصدير البيانات بنجاح" });
  };

  // Sort owners
  const sortedOwners = [...owners].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name, "ar");
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-100" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-3">
              <i className="fas fa-wallet text-primary text-3xl"></i>
              <h1 className="text-2xl font-bold text-gray-800">منظومة إدارة ملاك المحافظ</h1>
            </div>
            <div className="flex items-center space-x-reverse space-x-2">
              <button 
                onClick={handleExport}
                data-testid="button-export"
                className="bg-success text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-reverse space-x-2"
              >
                <i className="fas fa-download"></i>
                <span>تصدير البيانات</span>
              </button>
              <span className="text-sm text-gray-600">
                عدد المالكين: <span data-testid="text-owner-count">{owners.length}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Add Owner Form */}
          <div className="lg:col-span-1">
            <OwnerForm
              owner={editingOwner}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              isLoading={createOwnerMutation.isPending || updateOwnerMutation.isPending}
            />
          </div>

          {/* Search and Results */}
          <div className="lg:col-span-2">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />

            {/* Results */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">قائمة المالكين</h3>
              </div>

              {isLoading ? (
                <div className="grid gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-5 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedOwners.length === 0 ? (
                <div className="text-center py-12">
                  {searchQuery ? (
                    <>
                      <i className="fas fa-search text-gray-300 text-5xl mb-4"></i>
                      <p className="text-gray-500 text-lg">لا توجد نتائج مطابقة للبحث</p>
                      <p className="text-gray-400 text-sm">جرب استخدام كلمات مختلفة أو تحقق من الإملاء</p>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-wallet text-gray-300 text-5xl mb-4"></i>
                      <p className="text-gray-500 text-lg">لا يوجد أي مالكين مسجلين</p>
                      <p className="text-gray-400 text-sm">ابدأ بتسجيل أول مالك باستخدام النموذج على اليسار</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid gap-4" data-testid="owners-grid">
                  {sortedOwners.map((owner) => (
                    <OwnerCard
                      key={owner.id}
                      owner={owner}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={!!deleteOwner}
        onClose={() => setDeleteOwner(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteOwnerMutation.isPending}
        ownerName={deleteOwner?.name}
      />
    </div>
  );
}
