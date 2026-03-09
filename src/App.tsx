import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCartSync } from "@/hooks/useCartSync";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index";
import CollectionPage from "./pages/CollectionPage";
import InfoPage from "./pages/InfoPage";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  useCartSync();
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<InfoPage />} />
      <Route path="/shipping" element={<InfoPage />} />
      <Route path="/privacy" element={<InfoPage />} />
      <Route path="/terms" element={<InfoPage />} />
      <Route path="/faq" element={<InfoPage />} />
      <Route path="/collections/:slug" element={<CollectionPage />} />
      <Route path="/product/:handle" element={<ProductDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
