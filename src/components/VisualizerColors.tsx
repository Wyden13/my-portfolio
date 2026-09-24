"use client";

import { useState } from "react";
import {
  DEFAULT_PALETTES,
  PALETTE_FIELDS,
  PALETTE_STORAGE_KEY,
  isHexColor,
  parsePalettes,
  serializePalettes,
  type PaletteKey,
  type PaletteTheme,
  type VisualizerPalette,
} from "@/lib/visualizer-palette";

// Mounted inside the client-only background portal, so storage is read after hydration.
export function useVisualizerPalette(theme: PaletteTheme) {
  const [palettes, setPalettes] = useState(() => {
    try {
      return parsePalettes(localStorage.getItem(PALETTE_STORAGE_KEY));
    } catch {
      return DEFAULT_PALETTES;
    }
  });
  const [feedback, setFeedback] = useState("");

  function update(palette: VisualizerPalette) {
    const next = { ...palettes, [theme]: palette };
    setPalettes(next);
    try {
      localStorage.setItem(PALETTE_STORAGE_KEY, serializePalettes(next));
      setFeedback("Saved in this browser.");
    } catch {
      setFeedback("Colors applied. Browser storage is unavailable.");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(serializePalettes(palettes));
      setFeedback("Both palettes copied.");
    } catch {
      setFeedback("Copy unavailable. Your colors are still applied.");
    }
  }

  return {
    palette: palettes[theme],
    feedback,
    onChange: (key: PaletteKey, value: string) => {
      if (isHexColor(value)) update({ ...palettes[theme], [key]: value });
    },
    onReset: () => update({ ...DEFAULT_PALETTES[theme] }),
    onCopy: copy,
  };
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);
  const valid = !editing || isHexColor(draft);
  return (
    <div className="visualizer-colors__field">
      <label>
        <span>{label}</span>
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(event) => {
            setDraft(event.target.value);
            onChange(event.target.value);
          }}
        />
      </label>
      <input
        type="text"
        aria-label={`${label} hex`}
        aria-invalid={!valid}
        value={editing ? draft : value}
        maxLength={7}
        spellCheck={false}
        onChange={(event) => {
          setDraft(event.target.value);
          if (isHexColor(event.target.value)) onChange(event.target.value);
        }}
        onFocus={() => {
          setDraft(value);
          setEditing(true);
        }}
        onBlur={() => {
          setDraft(value);
          setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </div>
  );
}

export default function VisualizerColors({
  theme,
  palette,
  feedback,
  onChange,
  onReset,
  onCopy,
}: {
  theme: PaletteTheme;
  palette: VisualizerPalette;
  feedback: string;
  onChange: (key: PaletteKey, value: string) => void;
  onReset: () => void;
  onCopy: () => void;
}) {
  return (
    <details className="visualizer-colors">
      <summary>Colors</summary>
      <div className="visualizer-colors__panel">
        <p>Animation colors · {theme} theme</p>
        {PALETTE_FIELDS.map(([key, label]) => (
          <ColorField
            key={`${theme}-${key}`}
            label={label}
            value={palette[key]}
            onChange={(value) => onChange(key, value)}
          />
        ))}
        <div className="visualizer-colors__actions">
          <button type="button" onClick={onReset}>
            Reset current theme
          </button>
          <button type="button" onClick={onCopy}>
            Copy palette
          </button>
        </div>
        <p role="status" className="visualizer-colors__status">
          {feedback}
        </p>
      </div>
    </details>
  );
}
