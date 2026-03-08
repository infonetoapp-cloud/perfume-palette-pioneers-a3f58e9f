const Footer = () => {
  return (
    <footer className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="mb-4 font-display text-xl font-semibold text-foreground">
              Real Scents
            </h3>
            <p className="font-body text-sm leading-relaxed text-muted-foreground">
              Seçkin parfümlerin sessiz lüksü. Her şişede bir hikaye.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-[0.3em] text-foreground">
              Alışveriş
            </h4>
            <ul className="flex flex-col gap-2">
              {["Tüm Parfümler", "Kadın", "Erkek", "Yeni Gelenler", "Çok Satanlar"].map((item) => (
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
            <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-[0.3em] text-foreground">
              Bilgi
            </h4>
            <ul className="flex flex-col gap-2">
              {["Hakkımızda", "Kargo & İade", "Gizlilik Politikası", "Kullanım Koşulları", "SSS"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 font-body text-xs font-medium uppercase tracking-[0.3em] text-foreground">
              İletişim
            </h4>
            <ul className="flex flex-col gap-2 font-body text-sm text-muted-foreground">
              <li>info@realscents.com</li>
              <li>+90 212 000 00 00</li>
              <li className="mt-4 flex gap-4">
                {["Instagram", "Twitter", "Pinterest"].map((social) => (
                  <a key={social} href="#" className="text-xs uppercase tracking-widest transition-colors hover:text-foreground">
                    {social}
                  </a>
                ))}
              </li>
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
