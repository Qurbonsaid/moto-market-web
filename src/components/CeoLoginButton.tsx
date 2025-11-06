import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { verifyPassword, setUserRole, getUserRole, clearAuth } from "@/lib/storage";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export function CeoLoginButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [password, setPassword] = useState("");
  const role = getUserRole();

  const handleLogin = () => {
    if (verifyPassword(password)) {
      setUserRole('direktor');
      setShowDialog(false);
      setPassword("");
      toast.success("Direktor rejimiga o'tildi");
      window.location.reload(); // Refresh to update UI
    } else {
      toast.error("Parol noto'g'ri");
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast.success("Sotuvchi rejimiga o'tildi");
    window.location.reload();
  };

  if (role === 'direktor') {
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
              <Button onClick={handleLogin}>Kirish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
