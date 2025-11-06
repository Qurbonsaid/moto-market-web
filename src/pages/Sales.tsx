import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getSales, saveSale, getProducts, getUserRole, getSellers } from "@/lib/storage";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function Sales() {
  const role = getUserRole();
  const [sales, setSales] = useState(getSales().reverse());
  const [products] = useState(getProducts());
  const [sellers] = useState(getSellers());
  const [showDialog, setShowDialog] = useState(false);

  const [formData, setFormData] = useState({
    mahsulotId: "",
    sotuvchiId: "",
    miqdor: 1,
    narx: 0,
    mijoz: "",
  });

  const selectedProduct = products.find(p => p.id === formData.mahsulotId);
  const jami = formData.miqdor * formData.narx;
  const foyda = selectedProduct 
    ? formData.miqdor * (formData.narx - selectedProduct.kirimNarxi)
    : 0;

  const handleOpenDialog = () => {
    setFormData({
      mahsulotId: "",
      sotuvchiId: "",
      miqdor: 1,
      narx: 0,
      mijoz: "",
    });
    setShowDialog(true);
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setFormData({
      ...formData,
      mahsulotId: productId,
      narx: product?.sotishNarxi || 0,
    });
  };

  const handleSave = () => {
    if (!selectedProduct) {
      toast.error("Mahsulot tanlanmagan");
      return;
    }

    if (!formData.sotuvchiId) {
      toast.error("Sotuvchi tanlanmagan");
      return;
    }

    if (formData.miqdor > selectedProduct.miqdor) {
      toast.error("Yetarli emas!");
      return;
    }

    const selectedSeller = sellers.find(s => s.id === formData.sotuvchiId);

    saveSale({
      sana: new Date().toISOString(),
      mahsulotId: formData.mahsulotId,
      mahsulotNomi: selectedProduct.nomi,
      miqdor: formData.miqdor,
      narx: formData.narx,
      jami,
      foyda,
      sotuvchi: formData.sotuvchiId,
      sotuvchiIsm: selectedSeller?.ism || 'Noma\'lum',
      mijoz: formData.mijoz,
    });

    setSales(getSales().reverse());
    setShowDialog(false);
    toast.success("Sotuv saqlandi!");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sotuvlar</h1>
        <Button onClick={handleOpenDialog}>
          <Plus size={18} className="mr-2" />
          Yangi sotuv
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {sales.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Hozircha sotuvlar yo'q</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Miqdor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Narx</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Jami</th>
                  {role === 'direktor' && (
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Foyda</th>
                  )}
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sotuvchi</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{formatDateTime(sale.sana)}</td>
                    <td className="py-3 px-4 text-sm">{sale.mahsulotNomi}</td>
                    <td className="py-3 px-4 text-sm">{sale.miqdor} dona</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(sale.narx)}</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(sale.jami)}</td>
                    {role === 'direktor' && (
                      <td className="py-3 px-4 text-sm font-bold text-success">{formatCurrency(sale.foyda)}</td>
                    )}
                    <td className="py-3 px-4 text-sm">{sale.sotuvchiIsm || sale.sotuvchi}</td>
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
            <DialogTitle>Yangi sotuv</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="seller">Sotuvchi *</Label>
              <select
                id="seller"
                value={formData.sotuvchiId}
                onChange={(e) => setFormData({ ...formData, sotuvchiId: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Sotuvchini tanlang...</option>
                {sellers.map((seller) => (
                  <option key={seller.id} value={seller.id}>
                    {seller.ism}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="product">Mahsulot *</Label>
              <select
                id="product"
                value={formData.mahsulotId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Tanlang</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nomi} - {product.model}
                  </option>
                ))}
              </select>
              {selectedProduct && (
                <p className="text-sm text-muted-foreground mt-1">
                  Omborda: {selectedProduct.miqdor} dona
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="miqdor">Miqdor *</Label>
              <Input
                id="miqdor"
                type="number"
                min="1"
                value={formData.miqdor}
                onChange={(e) => setFormData({ ...formData, miqdor: Number(e.target.value) })}
              />
              {selectedProduct && formData.miqdor > selectedProduct.miqdor && (
                <p className="text-sm text-destructive mt-1">Yetarli emas!</p>
              )}
            </div>
            <div>
              <Label htmlFor="narx">Narx *</Label>
              <Input
                id="narx"
                type="number"
                value={formData.narx}
                onChange={(e) => setFormData({ ...formData, narx: Number(e.target.value) })}
                readOnly={role !== 'direktor'}
              />
            </div>
            <div>
              <Label htmlFor="mijoz">Mijoz</Label>
              <Input
                id="mijoz"
                value={formData.mijoz}
                onChange={(e) => setFormData({ ...formData, mijoz: e.target.value })}
                placeholder="Ixtiyoriy"
              />
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Jami:</span>
                <span className="text-2xl font-bold">{formatCurrency(jami)}</span>
              </div>
              {role === 'direktor' && selectedProduct && (
                <div className="text-sm text-success">
                  Foyda: {formatCurrency(foyda)}
                </div>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleSave}>Sotish</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
