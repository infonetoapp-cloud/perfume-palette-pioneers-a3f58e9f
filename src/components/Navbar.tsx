import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { getCollectionPath, getProductDisplayCopy } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalogData";
import { formatUsd } from "@/lib/promotions";
import { SITE_NAME } from "@/lib/site";
import AnnouncementBar from "@/components/AnnouncementBar";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";

const SearchResultLink = ({ product, onSelect }: { product: CatalogProduct; onSelect: () => void }) => {
  const copy = getProductDisplayCopy(product);
  const image = product.images[0];

  return (
    <Link
      to={`/product/${product.handle}`}
      onClick={onSelect}
      className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/70 p-3 transition-colors hover:border-accent/40 hover:bg-secondary/40"
    >
      <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
        {image ? (
          <img src={image.url} alt={image.altText} className="h-full w-full object-cover" loading="lazy" />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {copy.eyebrow}
        </p>
        <p className="mt-1 truncate font-display text-sm font-semibold text-foreground">{copy.shortTitle}</p>
        <p className="mt-1 line-clamp-1 font-body text-xs text-muted-foreground">{copy.subtitle}</p>
      </div>
      <span className="font-display text-sm font-bold text-foreground">{formatUsd(parseFloat(product.price.amount))}</span>
    </Link>
  );
};

const Navbar = () => {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { searchProducts } = useStorefrontCatalog();
  const isHome = location.pathname === "/";
  const useTransparentNav = isHome && !scrolled && !searchOpen && !menuOpen;

  const navLinks = [
    { label: t("nav.perfumes"), to: getCollectionPath("all-perfumes") },
    { label: "Car Scents", to: "/auto-scents" },
    { label: t("category.women"), to: getCollectionPath("women") },
    { label: t("category.men"), to: getCollectionPath("men") },
    { label: t("nav.about"), to: "/about" },
  ];
  const trimmedQuery = searchQuery.trim();
  const searchResults = trimmedQuery.length >= 2 ? searchProducts(trimmedQuery, 6) : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  const toggleSearch = () => {
    if (searchOpen) {
      closeSearch();
      return;
    }

    setMenuOpen(false);
    setSearchOpen(true);
  };

  const handleMenuToggle = () => {
    closeSearch();
    setMenuOpen((current) => !current);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchResults.length === 0) return;
    navigate(`/product/${searchResults[0].handle}`);
    closeSearch();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement bar — hides on scroll */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
      >
        <AnnouncementBar />
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-500 ${
          useTransparentNav ? "bg-transparent" : "bg-background/95 backdrop-blur-md shadow-soft"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-5 py-4 lg:px-8">
          {/* Left: Logo */}
          <Link to="/" className="relative z-10">
            <span
              className={`font-display text-lg font-semibold uppercase tracking-[0.32em] transition-colors duration-500 md:text-xl ${
                useTransparentNav ? "text-white" : "text-foreground"
              }`}
            >
              Real Scents
            </span>
            <span className="sr-only">{SITE_NAME}</span>
          </Link>

          {/* Center: Nav links (desktop) */}
          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`px-3 py-2 font-body text-sm font-medium transition-colors duration-500 ${
                  useTransparentNav
                    ? "text-white/90 hover:text-white"
                    : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center">
              <button
                aria-label={t("nav.search")}
                onClick={toggleSearch}
                className={`transition-colors duration-500 ${
                  useTransparentNav ? "text-white/90 hover:text-white" : "text-foreground hover:text-accent"
                }`}
              >
                <Search size={20} />
              </button>
            </div>

            <button
              aria-label={t("nav.search")}
              className={`md:hidden transition-colors duration-500 ${
                useTransparentNav ? "text-white" : "text-foreground"
              }`}
              onClick={toggleSearch}
            >
              <Search size={20} />
            </button>

            <CartDrawer
              onOpenChange={(open) => {
                if (open) {
                  setMenuOpen(false);
                  closeSearch();
                }
              }}
            />

            <button
              aria-label="Menu"
              className={`md:hidden transition-colors duration-500 ${
                useTransparentNav ? "text-white" : "text-foreground"
              }`}
              onClick={handleMenuToggle}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="border-t border-border bg-background/95 px-4 py-4 backdrop-blur-md"
            >
              <div className="mx-auto max-w-3xl">
                <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-soft">
                  <Search size={16} className="text-muted-foreground" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("nav.searchPlaceholder")}
                    className="w-full bg-transparent font-body text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="rounded-full px-2 py-1 font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Close
                  </button>
                </form>

                <div className="mt-3 rounded-3xl border border-border bg-card/95 p-4 shadow-soft">
                  {trimmedQuery.length < 2 ? (
                    <p className="font-body text-sm text-muted-foreground">{t("nav.searchHelper")}</p>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                          {t("nav.searchResults")}
                        </p>
                        <Link
                          to={getCollectionPath("all-perfumes")}
                          onClick={closeSearch}
                          className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-foreground transition-colors hover:text-accent"
                        >
                          {t("nav.searchBrowseAll")}
                        </Link>
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <SearchResultLink key={product.id} product={product} onSelect={closeSearch} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-body text-sm font-medium text-foreground">{t("nav.searchEmpty")}</p>
                      <p className="font-body text-sm text-muted-foreground">{t("nav.searchEmptyHint")}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-lg px-3 py-3 font-body text-base font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
