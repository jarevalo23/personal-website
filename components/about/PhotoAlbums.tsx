"use client";

import { useState } from "react";
import { photoAlbums, type PhotoAlbum } from "@/data/albums";
import { PhotoViewer } from "./PhotoViewer";
import { StudyAbroadAlbum } from "./StudyAbroad";

/** Emoji buttons that open a photo viewer. Albums come from data/albums.ts. */
export function PhotoAlbums() {
  const [openId, setOpenId] = useState<string | null>(null);
  const album = photoAlbums.find((item) => item.id === openId) ?? null;
  const notes = photoAlbums.map((item) => item.note).filter((note): note is string => Boolean(note));

  const open = (item: PhotoAlbum) => {
    if (item.photos.length === 0) return;
    setOpenId(item.id);
  };

  if (photoAlbums.length === 0) return null;

  return (
    <section aria-labelledby="albums-title" className="panel panel-accent mt-6 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">Albums</p>
      <h2 id="albums-title" className="font-display mt-2 text-4xl sm:text-5xl">
        Photos
      </h2>
      <p className="mt-3 max-w-xl text-fog/90">Sports and study abroad.</p>
      {notes.map((note) => (
        <p key={note} className="mt-2 max-w-xl text-fog/90">
          {note}
        </p>
      ))}

      <ul className="mt-6 grid max-w-xl grid-cols-2 gap-3">
        {photoAlbums.map((item) => {
          const selected = openId === item.id;
          const empty = item.photos.length === 0;
          return (
            <li key={item.id}>
              <button
                type="button"
                disabled={empty}
                aria-haspopup="dialog"
                aria-expanded={selected}
                onClick={() => open(item)}
                className={`flex min-h-28 w-full flex-col items-center justify-center gap-1 border px-2 py-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected
                    ? "border-fog bg-accent text-accent-ink"
                    : "border-white/20 bg-ink-950/40 text-fog hover:border-fog"
                }`}
              >
                <span className="text-4xl leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="font-display text-2xl leading-none sm:text-3xl">{item.label}</span>
                <span className={`text-sm font-semibold ${selected ? "text-accent-ink/80" : "text-mist"}`}>
                  {empty ? "No photos yet" : `${item.photos.length} photos`}
                </span>
              </button>
            </li>
          );
        })}
        <li>
          <StudyAbroadAlbum />
        </li>
      </ul>

      <PhotoViewer
        key={album?.id ?? "closed"}
        open={album !== null}
        title={album?.label ?? ""}
        photos={album?.photos ?? []}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
