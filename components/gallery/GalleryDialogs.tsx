"use client";

import { PhotoViewer } from "@/components/about/PhotoViewer";
import { StudyAbroadMap } from "@/components/about/StudyAbroad";
import { photoAlbums } from "@/data/albums";
import type { FunGallery } from "@/data/fun";

/** The same Sports album and study-abroad map that About uses. */
export function GalleryDialogs({ gallery, onClose }: { gallery: FunGallery | null; onClose: () => void }) {
  const sports = photoAlbums.find((album) => album.id === "sports");

  return (
    <>
      <PhotoViewer
        key={gallery === "sports" ? "sports-open" : "sports-closed"}
        open={gallery === "sports" && sports !== undefined}
        title={sports?.label ?? "Sports"}
        photos={sports?.photos ?? []}
        onClose={onClose}
      />
      <StudyAbroadMap open={gallery === "study-abroad"} onClose={onClose} />
    </>
  );
}
