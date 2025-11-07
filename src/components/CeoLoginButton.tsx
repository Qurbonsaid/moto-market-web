import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function CeoLoginButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { isCeo, setCeo, logout } = useAuthStore();

  const handleLogin = async () => {
    setIsVerifying(true);
    try {
      const isValid = await window.api.verifyCeoPassword(password);
      if (isValid) {
        setCeo(true);
        setShowDialog(false);
        setPassword("");
        toast.success("Direktor rejimiga o'tildi");
      } else {
        toast.error("Parol noto'g'ri");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Sotuvchi rejimiga o'tildi");
  };

  if (isCeo) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Direktor rejimi</span>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut size={16} />
          Chiqish
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowDialog(true)}
      >
        Direktor kirish
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Direktor kirish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ceo-password">Parol</Label>
              <Input
                id="ceo-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Parolni kiriting"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleLogin} disabled={isVerifying}>
                {isVerifying ? "Tekshirilmoqda..." : "Kirish"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
