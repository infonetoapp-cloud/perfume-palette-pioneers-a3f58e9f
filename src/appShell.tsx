import { Suspense, type ReactNode, type ComponentType, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCartSync } from "@/hooks/useCartSync";
import { I18nProvider } from "@/lib/i18n";

type PageComponent = ComponentType;

interface AppRoutesProps {
  IndexPage: PageComponent;
  AutoScentsPage: PageComponent;
  CollectionPage: PageComponent;
  InfoPage: PageComponent;
  ProductDetailPage: PageComponent;
  NotFoundPage: PageComponent;
}

export const RouteFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-6">
    <p className="font-body text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
      Loading page...
    </p>
  </div>
);

export const AppRoutes = ({
  IndexPage,
  AutoScentsPage,
  CollectionPage,
  InfoPage,
  ProductDetailPage,
  NotFoundPage,
}: AppRoutesProps) => {
  useCartSync();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/auto-scents" element={<AutoScentsPage />} />
        <Route path="/auto-scents/:slug" element={<AutoScentsPage />} />
        <Route path="/about" element={<InfoPage />} />
        <Route path="/shipping" element={<InfoPage />} />
        <Route path="/refund-policy" element={<InfoPage />} />
        <Route path="/privacy" element={<InfoPage />} />
        <Route path="/terms" element={<InfoPage />} />
        <Route path="/faq" element={<InfoPage />} />
        <Route path="/collections/:slug" element={<CollectionPage />} />
        <Route path="/product/:handle" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export const AppProviders = ({
  children,
  includeOverlays = true,
}: {
  children: ReactNode;
  includeOverlays?: boolean;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          {includeOverlays ? (
            <>
              <Toaster />
              <Sonner />
            </>
          ) : null}
          {children}
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
};
