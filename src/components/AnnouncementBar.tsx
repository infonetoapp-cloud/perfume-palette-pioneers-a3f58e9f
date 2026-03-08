const AnnouncementBar = () => {
  const messages = [
    "Türkiye geneli ücretsiz kargo",
    "✦",
    "2+ üründe %10 indirim",
    "✦",
    "Yeni koleksiyon şimdi çıktı",
    "✦",
    "Türkiye geneli ücretsiz kargo",
    "✦",
    "2+ üründe %10 indirim",
    "✦",
    "Yeni koleksiyon şimdi çıktı",
    "✦",
  ];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap py-2.5">
      <div className="animate-marquee inline-flex gap-8">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="font-body text-xs font-medium tracking-wider uppercase">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
