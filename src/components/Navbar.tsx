import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X, ChevronDown, Globe } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { Link } from "react-router-dom";
import { useI18n, Locale } from "@/lib/i18n";

const Navbar = () => {
  const { t, locale, setLocale } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const navLinks = [
    { label: t("nav.perfumes"), href: "#products", hasDropdown: true },
    { label: t("nav.about"), href: "#about", hasDropdown: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const languages: { code: Locale; label: string }[] = [
    { code: "en", label: "English" },
    { code: "es", label: "Español" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-sm shadow-soft" : "bg-background"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Left: Nav links (desktop) */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1 rounded-full border border-border px-4 py-2 font-body text-sm font-medium text-foreground transition-all hover:bg-muted"
            >
              {link.label}
              {link.hasDropdown && <ChevronDown size={14} />}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Menu"
          className="text-foreground md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Center: Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span className="font-display text-xl font-bold tracking-tight text-foreground md:text-2xl">
            Real Scents
          </span>
        </Link>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Search (desktop) */}
          <div className="hidden md:flex items-center">
            {searchOpen ? (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5"
              >
                <Search size={16} className="text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("nav.searchPlaceholder")}
                  className="w-full bg-transparent font-body text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                  onBlur={() => setSearchOpen(false)}
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 font-body text-sm text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
              >
                <Search size={16} />
                <span>{t("nav.search")}</span>
              </button>
            )}
          </div>

          {/* Language switcher */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 font-body text-xs font-medium text-foreground transition-all hover:bg-muted"
            >
              <Globe size={14} />
              <span className="uppercase">{locale}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-xl border border-border bg-background p-1 shadow-elevated z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLocale(lang.code);
                      setLangOpen(false);
                    }}
                    className={`block w-full rounded-lg px-4 py-2 text-left font-body text-sm transition-all hover:bg-muted ${
                      locale === lang.code ? "font-semibold text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            aria-label={t("nav.search")}
            className="text-foreground md:hidden"
            onClick={() => setSearchOpen(!searchOpen)}
          >
            <Search size={20} />
          </button>

          <button aria-label={t("nav.account")} className="hidden text-foreground transition-colors hover:text-accent md:block">
            <User size={20} />
          </button>

          <CartDrawer />
        </div>
      </div>

      {/* Mobile search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border px-4 py-3 md:hidden"
          >
            <div className="flex items-center gap-2 rounded-full border border-border px-3 py-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                className="w-full bg-transparent font-body text-sm outline-none"
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
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 font-body text-base font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex gap-2 px-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLocale(lang.code); setMenuOpen(false); }}
                    className={`rounded-full border px-4 py-2 font-body text-sm ${locale === lang.code ? "border-foreground bg-foreground text-background" : "border-border text-foreground"}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
