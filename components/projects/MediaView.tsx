import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import type { Media } from "@/content/projects";
import Video from "@/components/ui/Video";

/** Imagen (next/image) o video lazy con póster, según el tipo de media. */
export default function MediaView({
  media,
  locale,
  sizes = "(min-width: 1024px) 60vw, 100vw",
  priority = false,
  mode = "loop",
  className = "",
  playLabel,
  pauseLabel,
}: {
  media: Media;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  mode?: "loop" | "hover" | "controls";
  className?: string;
  playLabel?: string;
  pauseLabel?: string;
}) {
  if (media.type === "video") {
    return (
      <Video
        src={media.src}
        width={media.width}
        height={media.height}
        label={media.alt[locale]}
        mode={mode}
        className={className}
        playLabel={playLabel}
        pauseLabel={pauseLabel}
      />
    );
  }
  return (
    <Image
      src={media.src}
      alt={media.alt[locale]}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      className={`h-auto w-full bg-desconocido ${className}`}
    />
  );
}
