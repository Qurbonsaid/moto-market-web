import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIncomingStock } from "@/hooks/useIncomingStock";
import { useProducts } from "@/hooks/useProducts";
import { formatCurrency, formatDate } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomingStockSchema, type IncomingStockFormData } from "@/lib/validations";
import { Skeleton } from "@/components/ui/skeleton";

export default function IncomingStock() {
  const { incomingStock, loading, addIncomingStock, deleteIncomingStock } = useIncomingStock();
  const { products, loading: productsLoading } = useProducts();
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, reset } = useForm<IncomingStockFormData>({
    resolver: zodResolver(incomingStockSchema),
    defaultValues: {
      sana: new Date().toISOString().split('T')[0],
      miqdor: 1,
      kirimNarxi: 0,
    },
  });

  const miqdor = watch("miqdor");
  const kirimNarxi = watch("kirimNarxi");
  const jamiXarajat = useMemo(() => (miqdor || 0) * (kirimNarxi || 0), [miqdor, kirimNarxi]);

  const selectedProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const handleOpenDialog = () => {
    reset({
      sana: new Date().toISOString().split('T')[0],
      mahsulotId: "",
      miqdor: 1,
      kirimNarxi: 0,
      izoh: "",
    });
    setSelectedProductId("");
    setShowDialog(true);
  };

  const onSubmit = async (data: IncomingStockFormData) => {
    const product = products.find(p => p.id === data.mahsulotId);
    if (!product) return;

    await addIncomingStock({
      sana: data.sana,
      mahsulotId: data.mahsulotId,
      mahsulotNomi: product.nomi,
      mahsulotModel: product.model,
      miqdor: data.miqdor,
      kirimNarxi: data.kirimNarxi,
      jamiXarajat: data.miqdor * data.kirimNarxi,
      izoh: data.izoh,
    });
    
    setShowDialog(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteIncomingStock(deleteId);
      setDeleteId(null);
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kirim tovarlar</h1>
        <Button onClick={handleOpenDialog}>
          <Plus size={18} className="mr-2" />
          Yangi kirim qo'shish
        </Button>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm">
        {incomingStock.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">Hozircha kirim tovarlar yo'q</p>
            <Button onClick={handleOpenDialog}>
              <Plus size={18} className="mr-2" />
              Yangi kirim qo'shish
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Sana</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Mahsulot</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Model</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Miqdor</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Birlik narxi</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Jami xarajat</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Izoh</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amallar</th>
                </tr>
              </thead>
              <tbody>
                {incomingStock.map((stock) => (
                  <tr key={stock.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 text-sm">{formatDate(stock.sana)}</td>
                    <td className="py-3 px-4 text-sm">{stock.mahsulotNomi}</td>
                    <td className="py-3 px-4 text-sm">{stock.mahsulotModel}</td>
                    <td className="py-3 px-4 text-sm">{stock.miqdor} dona</td>
                    <td className="py-3 px-4 text-sm">{formatCurrency(stock.kirimNarxi)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatCurrency(stock.jamiXarajat)}</td>
                    <td className="py-3 px-4 text-sm">{stock.izoh || "-"}</td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        onClick={() => setDeleteId(stock.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={18} />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Yangi kirim qo'shish</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="sana">Sana *</Label>
              <Input
                id="sana"
                type="date"
                {...register("sana")}
              />
              {errors.sana && <p className="text-sm text-destructive mt-1">{errors.sana.message}</p>}
            </div>

            <div>
              <Label htmlFor="mahsulotId">Mahsulot *</Label>
              <Select
                value={selectedProductId}
                onValueChange={(value) => {
                  setSelectedProductId(value);
                  setValue("mahsulotId", value);
                  const product = products.find(p => p.id === value);
                  if (product) {
                    setValue("kirimNarxi", product.kirimNarxi);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mahsulotni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.nomi} - {product.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mahsulotId && <p className="text-sm text-destructive mt-1">{errors.mahsulotId.message}</p>}
              {selectedProduct && (
                <p className="text-sm text-muted-foreground mt-1">
                  Omborda: {selectedProduct.miqdor} dona
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="miqdor">Qabul qilingan miqdor *</Label>
              <Input
                id="miqdor"
                type="number"
                {...register("miqdor", { valueAsNumber: true })}
              />
              {errors.miqdor && <p className="text-sm text-destructive mt-1">{errors.miqdor.message}</p>}
            </div>

            <div>
              <Label htmlFor="kirimNarxi">Birlik kirim narxi *</Label>
              <Input
                id="kirimNarxi"
                type="number"
                step="0.01"
                {...register("kirimNarxi", { valueAsNumber: true })}
              />
              {errors.kirimNarxi && <p className="text-sm text-destructive mt-1">{errors.kirimNarxi.message}</p>}
            </div>

            <div>
              <Label>Jami xarajat</Label>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(jamiXarajat)}
              </div>
            </div>

            <div>
              <Label htmlFor="izoh">Izoh</Label>
              <Textarea
                id="izoh"
                {...register("izoh")}
                placeholder="Qo'shimcha ma'lumot"
                rows={3}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Bekor qilish
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bu kirim tovar yozuvini o'chirishni xohlaysizmi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu amalni bekor qilib bo'lmaydi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Yo'q, bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Ha, o'chirilsin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
