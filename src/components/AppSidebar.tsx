import { Home, Package, ShoppingCart, Receipt, LogOut, KeyRound } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { getUserRole, clearAuth } from "@/lib/storage";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/storage";
import { toast } from "sonner";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = getUserRole();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Yangi parollar mos emas");
      return;
    }
    
    if (changePassword(currentPassword, newPassword)) {
      toast.success("Parol o'zgartirildi");
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Joriy parol noto'g'ri");
    }
  };

  const menuItems = [
    { title: "Bosh sahifa", path: "/", icon: Home },
    { title: "Mahsulotlar", path: "/mahsulotlar", icon: Package },
    { title: "Sotuvlar", path: "/sotuvlar", icon: ShoppingCart },
    ...(role === 'direktor' ? [{ title: "Xarajatlar", path: "/xarajatlar", icon: Receipt }] : []),
  ];

  return (
    <>
      <div className="w-[200px] h-screen bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-4 border-b border-sidebar-border">
          <h1 className="text-xl font-bold">Moto Market</h1>
          <p className="text-xs text-sidebar-foreground/70 mt-1">
            {role === 'direktor' ? 'Direktor' : 'Sotuvchi'}
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
          {role === 'direktor' && (
            <button
              onClick={() => setShowPasswordDialog(true)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full mb-1"
            >
              <KeyRound size={18} />
              <span className="text-sm">Parolni o'zgartirish</span>
            </button>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors w-full"
          >
            <LogOut size={18} />
            <span className="text-sm">Chiqish</span>
          </button>
        </div>
      </div>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Parolni o'zgartirish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current">Joriy parol *</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="new">Yangi parol *</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="confirm">Tasdiqlash *</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleChangePassword}>Saqlash</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
