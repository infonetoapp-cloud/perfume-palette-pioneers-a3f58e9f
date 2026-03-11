import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";

import { AppProviders, AppRoutes } from "@/appShell";

const Index = lazy(() => import("./pages/Index"));
const AutoScentsPage = lazy(() => import("./pages/AutoScentsPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const InfoPage = lazy(() => import("./pages/InfoPage"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <AppRoutes
        IndexPage={Index}
        AutoScentsPage={AutoScentsPage}
        CollectionPage={CollectionPage}
        InfoPage={InfoPage}
        ProductDetailPage={ProductDetail}
        NotFoundPage={NotFound}
      />
    </BrowserRouter>
  </AppProviders>
);

export default App;
