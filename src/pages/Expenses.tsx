import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getExpenses, saveExpense, deleteExpense } from "@/lib/storage";
import { formatCurrency, formatDate } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Expenses() {
  const [expenses, setExpenses] = useState(getExpenses().reverse());
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    sana: new Date().toISOString().split('T')[0],
    tavsif: "",
    summa: 0,
  });

  const jamiXarajat = expenses.reduce((sum, exp) => sum + exp.summa, 0);

  const handleOpenDialog = () => {
    setFormData({
      sana: new Date().toISOString().split('T')[0],
      tavsif: "",
      summa: 0,
    });
    setShowDialog(true);
  };

  const handleSave = () => {
    saveExpense({
      sana: formData.sana,
      tavsif: formData.tavsif,
      summa: formData.summa,
    });
    setExpenses(getExpenses().reverse());
    setShowDialog(false);
    toast.success("Saqlandi!");
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setExpenses(getExpenses().reverse());
    setShowDeleteConfirm(null);
    toast.success("O'chirildi!");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Xarajatlar</h1>
        <Button onClick={handleOpenDialog}>
          <Plus size={18} className="mr-2" />
          Xarajat qo'shish
        </Button>
      </div>

      <div className="mb-4 p-4 bg-card rounded-lg border border-border">
        <div className="text-sm text-muted-foreground">Jami xarajat:</div>
        <div className="text-2xl font-bold text-destructive">{formatCurrency(jamiXarajat)}</div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {expenses.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Xarajatlar yo'q</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tavsif</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Summa</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{formatDate(expense.sana)}</td>
                    <td className="py-3 px-4 text-sm">{expense.tavsif}</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(expense.summa)}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => setShowDeleteConfirm(expense.id)}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xarajat qo'shish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sana">Sana *</Label>
              <Input
                id="sana"
                type="date"
                value={formData.sana}
                onChange={(e) => setFormData({ ...formData, sana: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tavsif">Tavsif *</Label>
              <Input
                id="tavsif"
                value={formData.tavsif}
                onChange={(e) => setFormData({ ...formData, tavsif: e.target.value })}
                placeholder="Masalan: Ijara, Elektr"
              />
            </div>
            <div>
              <Label htmlFor="summa">Summa *</Label>
              <Input
                id="summa"
                type="number"
                value={formData.summa}
                onChange={(e) => setFormData({ ...formData, summa: Number(e.target.value) })}
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

      <Dialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>O'chirilsinmi?</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(null)}>
              Yo'q
            </Button>
            <Button variant="destructive" onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}>
              Ha
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
