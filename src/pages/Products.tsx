import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getProducts, saveProduct, deleteProduct, getUserRole, Product } from "@/lib/storage";
import { formatCurrency } from "@/lib/format";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const role = getUserRole();
  const [products, setProducts] = useState(getProducts());
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nomi: "",
    model: "",
    miqdor: 0,
    kirimNarxi: 0,
    sotishNarxi: 0,
  });

  const filteredProducts = products.filter(p =>
    p.nomi.toLowerCase().includes(search.toLowerCase()) ||
    p.model.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nomi: product.nomi,
        model: product.model,
        miqdor: product.miqdor,
        kirimNarxi: product.kirimNarxi,
        sotishNarxi: product.sotishNarxi,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nomi: "",
        model: "",
        miqdor: 0,
        kirimNarxi: 0,
        sotishNarxi: 0,
      });
    }
    setShowDialog(true);
  };

  const handleSave = () => {
    if (editingProduct) {
      saveProduct({ ...formData, id: editingProduct.id });
    } else {
      saveProduct(formData);
    }
    setProducts(getProducts());
    setShowDialog(false);
    toast.success("Saqlandi!");
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setProducts(getProducts());
    setShowDeleteConfirm(null);
    toast.success("O'chirildi!");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mahsulotlar</h1>
        {role === 'direktor' && (
          <Button onClick={() => handleOpenDialog()}>
            <Plus size={18} className="mr-2" />
            Yangi qo'shish
          </Button>
        )}
      </div>

      <div className="mb-4">
        <Input
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {filteredProducts.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {search ? "Mahsulot topilmadi" : "Mahsulotlar yo'q. Yangi qo'shing."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nomi</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Miqdor</th>
                  {role === 'direktor' && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kirim narxi</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sotish narxi</th>
                  {role === 'direktor' && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amallar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{product.nomi}</td>
                    <td className="py-3 px-4 text-sm">{product.model}</td>
                    <td className="py-3 px-4 text-sm">{product.miqdor} dona</td>
                    {role === 'direktor' && (
                      <td className="py-3 px-4 text-sm">{formatCurrency(product.kirimNarxi)}</td>
                    )}
                    <td className="py-3 px-4 text-sm">{formatCurrency(product.sotishNarxi)}</td>
                    {role === 'direktor' && (
                      <td className="py-3 px-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenDialog(product)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Pencil size={16} className="text-primary" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(product.id)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            <Trash2 size={16} className="text-destructive" />
                          </button>
                        </div>
                      </td>
                    )}
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
            <DialogTitle>{editingProduct ? "Tahrirlash" : "Mahsulot qo'shish"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomi">Nomi *</Label>
              <Input
                id="nomi"
                value={formData.nomi}
                onChange={(e) => setFormData({ ...formData, nomi: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="miqdor">Miqdor *</Label>
              <Input
                id="miqdor"
                type="number"
                value={formData.miqdor}
                onChange={(e) => setFormData({ ...formData, miqdor: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="kirimNarxi">Kirim narxi *</Label>
              <Input
                id="kirimNarxi"
                type="number"
                value={formData.kirimNarxi}
                onChange={(e) => setFormData({ ...formData, kirimNarxi: Number(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="sotishNarxi">Sotish narxi *</Label>
              <Input
                id="sotishNarxi"
                type="number"
                value={formData.sotishNarxi}
                onChange={(e) => setFormData({ ...formData, sotishNarxi: Number(e.target.value) })}
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
