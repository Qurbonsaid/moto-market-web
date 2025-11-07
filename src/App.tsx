import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Expenses from "./pages/Expenses";
import Sellers from "./pages/Sellers";
import IncomingStock from "./pages/IncomingStock";
import NotFound from "./pages/NotFound";
import { AppSidebar } from "./components/AppSidebar";
import { CeoLoginButton } from "./components/CeoLoginButton";
import { useAuthStore } from "./store/authStore";

const queryClient = new QueryClient();

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full min-h-screen">
    <AppSidebar />
    <div className="flex-1 flex flex-col">
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
        <h2 className="text-lg font-semibold">Moto Market</h2>
        <CeoLoginButton />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  </div>
);

const App = () => {
  const { isCeo } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />
            <Route
              path="/mahsulotlar"
              element={
                <MainLayout>
                  <Products />
                </MainLayout>
              }
            />
            <Route
              path="/sotuvlar"
              element={
                <MainLayout>
                  <Sales />
                </MainLayout>
              }
            />
            {isCeo && (
              <>
                <Route
                  path="/kirim-tovarlar"
                  element={
                    <MainLayout>
                      <IncomingStock />
                    </MainLayout>
                  }
                />
                <Route
                  path="/xarajatlar"
                  element={
                    <MainLayout>
                      <Expenses />
                    </MainLayout>
                  }
                />
                <Route
                  path="/sotuvchilar"
                  element={
                    <MainLayout>
                      <Sellers />
                    </MainLayout>
                  }
                />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
