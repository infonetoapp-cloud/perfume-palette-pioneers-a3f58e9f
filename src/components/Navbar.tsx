import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { getCollectionPath } from "@/lib/catalog";
import { SITE_NAME } from "@/lib/site";

const Navbar = () => {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: t("nav.perfumes"), to: getCollectionPath("all-perfumes") },
    { label: t("category.women"), to: getCollectionPath("women") },
    { label: t("category.men"), to: getCollectionPath("men") },
    { label: t("nav.about"), to: "/about" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-5 py-4 lg:px-8">
        {/* Left: Logo */}
        <Link to="/" className="relative z-10">
          <span
            className={`font-display text-lg font-semibold uppercase tracking-[0.32em] transition-colors duration-500 md:text-xl ${
              scrolled ? "text-foreground" : "text-white"
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
              className={`rounded-full px-4 py-2 font-body text-sm font-medium transition-all duration-500 ${
                scrolled
                  ? "text-foreground hover:bg-muted"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center">
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm px-3 py-1.5"
              >
                <Search size={16} className="text-white/70" />
                <input
                  type="text"
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full bg-transparent font-body text-sm text-white outline-none placeholder:text-white/50"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className={`transition-colors duration-500 ${
                  scrolled ? "text-foreground hover:text-accent" : "text-white/90 hover:text-white"
                }`}
              >
                <Search size={20} />
              </button>
            )}
          </div>

          <button
            aria-label={t("nav.search")}
            className={`md:hidden transition-colors duration-500 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>

          <button
            aria-label={t("nav.account")}
            className={`hidden md:block transition-colors duration-500 ${
              scrolled ? "text-foreground hover:text-accent" : "text-white/90 hover:text-white"
            }`}
          >
            <User size={20} />
          </button>

          <CartDrawer />

          {/* Mobile menu button */}
          <button
            aria-label="Menu"
            className={`md:hidden transition-colors duration-500 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/10 px-4 py-3 md:hidden bg-black/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/20 px-3 py-2">
              <Search size={16} className="text-white/60" />
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                className="w-full bg-transparent font-body text-sm text-white outline-none placeholder:text-white/50"
                autoFocus
              />
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
  );
};

export default Navbar;
