const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              Real Scents
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">
              Seçkin parfümlerin adresi. Her şişede bir hikaye.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
              Alışveriş
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Tüm Parfümler", "Kadın", "Erkek", "Yeni Gelenler"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
              Bilgi
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Hakkımızda", "Kargo & İade", "Gizlilik Politikası", "SSS"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">
              Sosyal
            </h4>
            <ul className="flex flex-col gap-2.5">
              {["Instagram", "Twitter", "Pinterest", "TikTok"].map((social) => (
                <li key={social}>
                  <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">
            © 2026 Real Scents. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
