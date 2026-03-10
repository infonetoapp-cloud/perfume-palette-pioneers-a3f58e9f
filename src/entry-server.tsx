import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";

import { AppProviders, AppRoutes } from "@/appShell";
import Index from "@/pages/Index";
import CollectionPage from "@/pages/CollectionPage";
import InfoPage from "@/pages/InfoPage";
import ProductDetail from "@/pages/ProductDetail";
import NotFound from "@/pages/NotFound";
import { buildSeoHeadMarkup, resolveSeoData, SeoCollectorProvider, type ResolvedSeoData } from "@/lib/seoContext";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export function render(url: string) {
  let seoData: ResolvedSeoData | null = null;

  const appHtml = renderToString(
    <SeoCollectorProvider
      collector={{
        register(data) {
          seoData = data;
        },
      }}
    >
      <AppProviders includeOverlays={false}>
        <StaticRouter location={url}>
          <AppRoutes
            IndexPage={Index}
            CollectionPage={CollectionPage}
            InfoPage={InfoPage}
            ProductDetailPage={ProductDetail}
            NotFoundPage={NotFound}
          />
        </StaticRouter>
      </AppProviders>
    </SeoCollectorProvider>,
  );

  const resolvedSeo =
    seoData ??
    resolveSeoData({
      title: `${SITE_NAME} | David Walker Perfumes for Women & Men`,
      description: SITE_DESCRIPTION,
      path: url,
    });

  return {
    appHtml,
    headTags: buildSeoHeadMarkup(resolvedSeo),
    htmlAttributes: 'lang="en"',
  };
}
