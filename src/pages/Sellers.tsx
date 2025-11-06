import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSellers, saveSeller, deleteSeller, getSellerStats, type Seller } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Sellers() {
  const [sellers, setSellers] = useState(getSellers());
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    ism: "",
    telefon: "",
  });

  const handleOpenDialog = () => {
    setFormData({ ism: "", telefon: "" });
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!formData.ism.trim()) {
      toast.error("Ism kiritilmagan");
      return;
    }

    saveSeller({
      ism: formData.ism,
      telefon: formData.telefon || undefined,
    });

    setSellers(getSellers());
    setShowDialog(false);
    toast.success("Sotuvchi qo'shildi!");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("O'chirilsinmi?")) {
      deleteSeller(id);
      setSellers(getSellers());
      toast.success("O'chirildi!");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sotuvchilar</h1>
        <Button onClick={handleOpenDialog}>
          <Plus size={18} className="mr-2" />
          Sotuvchi qo'shish
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {sellers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Hozircha sotuvchilar yo'q</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Ism</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Telefon</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sotuvlar soni</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Jami sotuv summasi</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Jami foyda</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => {
                  const stats = getSellerStats(seller.id);
                  return (
                    <tr key={seller.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm">{seller.ism}</td>
                      <td className="py-3 px-4 text-sm">{seller.telefon || "-"}</td>
                      <td className="py-3 px-4 text-sm">{stats.sotuvlarSoni}</td>
                      <td className="py-3 px-4 text-sm">{formatCurrency(stats.jamiSumma)}</td>
                      <td className="py-3 px-4 text-sm font-bold text-success">{formatCurrency(stats.jamiFoyda)}</td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={() => handleDelete(seller.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sotuvchi qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ism">Ism *</Label>
              <Input
                id="ism"
                value={formData.ism}
                onChange={(e) => setFormData({ ...formData, ism: e.target.value })}
                placeholder="Sotuvchi ismi"
              />
            </div>
            <div>
              <Label htmlFor="telefon">Telefon</Label>
              <Input
                id="telefon"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                placeholder="+998 XX XXX XX XX"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleSave}>Saqlash</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
