import { useEffect, useState, type ReactNode } from "react";

import { getNoteVisual } from "@/lib/noteVisuals";
import { cn } from "@/lib/utils";

type ArtworkSize = "xs" | "sm" | "md" | "lg";

const sizeClasses: Record<ArtworkSize, string> = {
  xs: "h-8 w-8 rounded-xl",
  sm: "h-10 w-10 rounded-[1rem]",
  md: "h-14 w-14 rounded-[1.15rem]",
  lg: "h-20 w-20 rounded-[1.35rem]",
};

type NoteArtworkProps = {
  label: string;
  fallbackIcon: ReactNode;
  size?: ArtworkSize;
  className?: string;
};

export function NoteArtwork({ label, fallbackIcon, size = "md", className }: NoteArtworkProps) {
  const visual = getNoteVisual(label);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [label, visual?.src]);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden",
        sizeClasses[size],
        className,
      )}
    >
      {visual && !hasError ? (
        <img
          src={visual.src}
          alt={label}
          loading="lazy"
          onError={() => setHasError(true)}
          className="relative z-10 h-full w-full object-contain p-[8%]"
        />
      ) : (
        <div className="relative z-10 flex h-full w-full items-center justify-center">{fallbackIcon}</div>
      )}
    </div>
  );
}

export function NoteSwatch({
  label,
  fallbackIcon,
  size = "lg",
  className,
  labelClassName,
}: NoteArtworkProps & { labelClassName?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2.5 text-center", className)}>
      <NoteArtwork label={label} fallbackIcon={fallbackIcon} size={size} />
      <span className={cn("font-body text-xs font-medium leading-snug text-foreground/80", labelClassName)}>{label}</span>
    </div>
  );
}

export function NoteArtworkStack({
  notes,
  fallbackIcon,
  size = "sm",
  className,
}: {
  notes: string[];
  fallbackIcon: ReactNode;
  size?: Exclude<ArtworkSize, "lg">;
  className?: string;
}) {
  return (
    <div className={cn("flex shrink-0 items-center gap-1.5", className)}>
      {notes.slice(0, 3).map((note, index) => (
        <NoteArtwork
          key={`${note}-${index}`}
          label={note}
          fallbackIcon={fallbackIcon}
          size={size}
          className="ring-1 ring-background/90"
        />
      ))}
    </div>
  );
}
