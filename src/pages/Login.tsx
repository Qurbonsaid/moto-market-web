import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyPassword, setUserRole, initializePassword } from "@/lib/storage";
import { toast } from "sonner";

export default function Login() {
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<'direktor' | 'sotuvchi'>('direktor');
  const navigate = useNavigate();

  // Initialize default password on mount
  useState(() => {
    initializePassword();
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verifyPassword(password)) {
      setUserRole(role);
      navigate("/");
    } else {
      toast.error("Parol noto'g'ri");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg border border-border">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Moto Market</h1>
          <p className="text-sm text-muted-foreground mt-2">Elektr velosiped do'koni</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="role">Rol tanlang</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'direktor' | 'sotuvchi')}
              className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
            >
              <option value="direktor">Direktor</option>
              <option value="sotuvchi">Sotuvchi</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="password">Parol</Label>
            <Input
              id="password"
              type="password"
              placeholder="Parolni kiriting"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Kirish
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Boshlang'ich parol: 1234
        </p>
      </div>
    </div>
  );
}
