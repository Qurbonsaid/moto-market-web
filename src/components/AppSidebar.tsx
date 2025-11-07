import { Home, Package, ShoppingCart, Receipt, KeyRound, Users, PackagePlus } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, type PasswordChangeFormData } from "@/lib/validations";
import { useSettings } from "@/hooks/useSettings";

export function AppSidebar() {
  const location = useLocation();
  const { isCeo } = useAuthStore();
  const { updateSettings } = useSettings();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
  });

  const onPasswordSubmit = async (data: PasswordChangeFormData) => {
    try {
      const isValid = await window.api.verifyCeoPassword(data.currentPassword);
      if (!isValid) {
        toast.error("Joriy parol noto'g'ri");
        return;
      }

      await updateSettings({ ceoPassword: data.newPassword });
      toast.success("Parol muvaffaqiyatli o'zgartirildi");
      setShowPasswordDialog(false);
      reset();
    } catch (error) {
      toast.error("Parolni o'zgartirishda xatolik");
    }
  };

  const menuItems = [
    { title: "Bosh sahifa", path: "/", icon: Home },
    { title: "Mahsulotlar", path: "/mahsulotlar", icon: Package },
    { title: "Sotuvlar", path: "/sotuvlar", icon: ShoppingCart },
    ...(isCeo ? [
      { title: "Kirim tovarlar", path: "/kirim-tovarlar", icon: PackagePlus },
      { title: "Xarajatlar", path: "/xarajatlar", icon: Receipt },
      { title: "Sotuvchilar", path: "/sotuvchilar", icon: Users }
    ] : []),
  ];

  return (
    <>
      <div className="w-[200px] h-screen bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold">Moto Market</h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            {isCeo ? 'Direktor' : 'Sotuvchi'}
          </p>
        </div>
        
        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors mb-1"
              activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
            >
              <item.icon size={18} />
              <span className="text-sm">{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-2 border-t border-sidebar-border">
          {isCeo && (
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
            >
              <KeyRound size={18} />
              <span className="text-sm">Parolni o'zgartirish</span>
            </button>
          )}
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parolni o'zgartirish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="current">Joriy parol *</Label>
              <Input
                id="current"
                type="password"
                {...register("currentPassword")}
              />
              {errors.currentPassword && (
                <p className="text-sm text-destructive mt-1">{errors.currentPassword.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="new">Yangi parol *</Label>
              <Input
                id="new"
                type="password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="text-sm text-destructive mt-1">{errors.newPassword.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="confirm">Tasdiqlash *</Label>
              <Input
                id="confirm"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
