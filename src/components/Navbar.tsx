import { useState, useEffect } from "react";
import logo from "@/assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, Menu, X, ChevronDown } from "lucide-react";
import { CartDrawer } from "@/components/CartDrawer";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Navbar = () => {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: t("nav.perfumes"), href: "#products", hasDropdown: true },
    { label: t("nav.about"), href: "#about", hasDropdown: false },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


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
          <img src={logo} alt="Real Scents" className="h-[7.5rem] md:h-[8.5rem] w-auto" />
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
