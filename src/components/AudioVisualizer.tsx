"use client";

/* Three.js uses mutable refs and uniforms inside the render loop by design. */
/* eslint-disable react-hooks/immutability */

import "@/lib/three-logging";
import "./AudioVisualizer.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import CubeParticles from "@/components/CubeParticles";
import VisualizerColors, {
  useVisualizerPalette,
} from "@/components/VisualizerColors";
import type { VisualizerPalette } from "@/lib/visualizer-palette";
import MobiusParticleRing from "@/components/MobiusParticleRing";
import {
  type AudioBands,
  frequencyLevel,
  followLevel,
  spectrumRange,
} from "@/lib/audio-analysis";
import ParticleCloud from "@/components/ParticleCloud";
import {
  type MutableRefObject,
  type CSSProperties,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { withBasePath } from "@/lib/base-path";

function AudioAnalysis({
  analyserRef,
  bands,
  isPlaying,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  bands: MutableRefObject<AudioBands>;
  isPlaying: boolean;
}) {
  const frequencyData = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const previous = useRef({ bass: 0, mid: 0 });

  useFrame((_, delta) => {
    const analyser = analyserRef.current;
    const step = Math.min(delta, 0.1);

    if (!analyser || !isPlaying) {
      for (const key of ["bass", "mid", "treble", "energy", "beat"] as const) {
        bands.current[key] *= Math.exp(-step / 0.14);
      }
      previous.current = { bass: 0, mid: 0 };
      return;
    }

    if (
      !frequencyData.current ||
      frequencyData.current.length !== analyser.frequencyBinCount
    ) {
      frequencyData.current = new Uint8Array(analyser.frequencyBinCount);
    }

    analyser.getByteFrequencyData(frequencyData.current);
    const data = frequencyData.current;
    const level = (low: number, high: number) =>
      frequencyLevel(
        data,
        analyser.context.sampleRate,
        analyser.fftSize,
        low,
        high,
      );
    const bass = level(30, 250);
    const mid = level(250, 2500);
    const treble = level(2500, 16000);

    // Fast rises in bass/kick and midrange percussion create an outward impulse.
    const onset =
      Math.max(0, bass - previous.current.bass - 0.018) * 5 +
      Math.max(0, mid - previous.current.mid - 0.025) * 2;
    bands.current.beat = Math.max(
      bands.current.beat * Math.exp(-step / 0.18),
      Math.min(1, onset),
    );
    previous.current.bass = followLevel(
      previous.current.bass,
      bass,
      step * 0.18,
    );
    previous.current.mid = followLevel(previous.current.mid, mid, step * 0.18);
    bands.current.bass = followLevel(bands.current.bass, bass, step);
    bands.current.mid = followLevel(bands.current.mid, mid, step);
    bands.current.treble = followLevel(bands.current.treble, treble, step);
    bands.current.energy =
      bands.current.bass * 0.5 +
      bands.current.mid * 0.32 +
      bands.current.treble * 0.18;
  }, -1);

  return null;
}

function VisualizerCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    // Preserve the original framing; the 2.5× sculpture deliberately crops at the edges.
    camera.position.z =
      9.2 / Math.min(1, size.width / Math.max(1, size.height));
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function VisualizerScene({
  analyserRef,
  isPlaying,
  palette,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
  palette: VisualizerPalette;
}) {
  const bands = useRef<AudioBands>({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    beat: 0,
  });
  const clock = useRef(0);
  useFrame((_, delta) => {
    clock.current +=
      Math.min(delta, 0.1) * (0.65 + bands.current.energy * 1.25);
  }, -0.5);

  return (
    <>
      <AudioAnalysis
        analyserRef={analyserRef}
        bands={bands}
        isPlaying={isPlaying}
      />
      <VisualizerCamera />
      <group scale={1.0}>
        <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.2}>
          <ParticleCloud bands={bands} clock={clock} palette={palette} />
          <MobiusParticleRing bands={bands} clock={clock} palette={palette} />
        </Float>
        <CubeParticles
          kind="floating"
          bands={bands}
          clock={clock}
          palette={palette}
          playing={isPlaying}
        />
      </group>
    </>
  );
}

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5h4v14H7zm6 0h4v14h-4z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 5 11 7-11 7z" />
    </svg>
  );
}

function AudioPlayerButton({
  isPlaying,
  onToggle,
}: {
  isPlaying: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className={`audio-controls__play${isPlaying ? " is-playing" : ""}`}
      onClick={onToggle}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      <PlayIcon playing={isPlaying} />
    </button>
  );
}

const WAVE_BAR_COUNT = 64;
const subscribeToClient = () => () => undefined;

function MusicWave({
  analyserRef,
  isPlaying,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
}) {
  const bars = useRef<Array<HTMLSpanElement | null>>([]);
  const wave = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const measure = () => {
      wave.current?.style.setProperty(
        "--music-wave-top",
        `${Math.max(0, header.getBoundingClientRect().bottom)}px`,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    let animationFrame = 0;
    const analyser = analyserRef.current;
    const frequencyData = analyser
      ? new Uint8Array(analyser.frequencyBinCount)
      : null;
    const levels = new Float32Array(WAVE_BAR_COUNT);
    const ranges = Array.from({ length: WAVE_BAR_COUNT }, (_, index) =>
      spectrumRange(
        index,
        WAVE_BAR_COUNT,
        analyser?.context.sampleRate ?? 48000,
      ),
    );
    let lastTime = performance.now();

    const draw = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      if (isPlaying && analyser && frequencyData) {
        analyser.getByteFrequencyData(frequencyData);
      }

      bars.current.forEach((bar, index) => {
        if (!bar) return;

        const [low, high] = ranges[index];
        const target =
          isPlaying && analyser && frequencyData
            ? frequencyLevel(
                frequencyData,
                analyser.context.sampleRate,
                analyser.fftSize,
                low,
                high,
              )
            : 0;
        levels[index] = followLevel(levels[index], target, delta);
        const frequency = levels[index];
        const scale = 0.06 + frequency * 0.94;

        bar.style.transform = `scaleX(${scale})`;
        bar.style.opacity = `${0.25 + frequency * 0.75}`;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    animationFrame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationFrame);
  }, [analyserRef, isPlaying]);

  return (
    <aside ref={wave} className="music-wave" aria-hidden="true">
      <div className="music-wave__bars">
        {Array.from({ length: WAVE_BAR_COUNT }, (_, index) => (
          <span
            className="music-wave__bar"
            key={index}
            ref={(element) => {
              bars.current[index] = element;
            }}
          />
        ))}
      </div>
    </aside>
  );
}

function AudioBackgroundPortal({
  analyserRef,
  isPlaying,
  palette,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
  palette: VisualizerPalette;
}) {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return createPortal(
    <AudioBackground
      analyserRef={analyserRef}
      isPlaying={isPlaying}
      palette={palette}
    />,
    document.body,
  );
}

function AudioBackground({
  analyserRef,
  isPlaying,
  palette,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
  palette: VisualizerPalette;
}) {
  const style = {
    "--visualizer-start": palette.backgroundStart,
    "--visualizer-middle": palette.backgroundMiddle,
    "--visualizer-end": palette.backgroundEnd,
    "--visualizer-glow-1": palette.glowPrimary,
    "--visualizer-glow-2": palette.glowSecondary,
  } as CSSProperties;

  return (
    <>
      <div className="audio-background" aria-hidden="true" style={style}>
        <div className="audio-background__canvas">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 9.2], fov: 42, far: 100 }}
            gl={{ antialias: true, alpha: true }}
          >
            <VisualizerScene
              analyserRef={analyserRef}
              isPlaying={isPlaying}
              palette={palette}
            />
          </Canvas>
        </div>
      </div>
      <MusicWave analyserRef={analyserRef} isPlaying={isPlaying} />
    </>
  );
}

function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}

export default function AudioVisualizer() {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  // Theme and saved palettes are browser state; mount them after hydration.
  return isClient ? <AudioVisualizerClient /> : null;
}

function AudioVisualizerClient() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const colors = useVisualizerPalette(theme);
  const audioRef = useRef<HTMLAudioElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;

    const measure = () => {
      document.body.style.setProperty(
        "--audio-dock-height",
        `${Math.ceil(dock.getBoundingClientRect().height)}px`,
      );
    };
    const observer = new ResizeObserver(measure);
    observer.observe(dock);
    measure();

    return () => {
      observer.disconnect();
      document.body.style.removeProperty("--audio-dock-height");
    };
  }, []);

  const prepareAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (!audioContextRef.current) {
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 4096;
        analyser.smoothingTimeConstant = 0.2;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -18;

        const source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);

        audioContextRef.current = context;
        analyserRef.current = analyser;
        sourceRef.current = source;
      }

      if (audioContextRef.current.state === "suspended") {
        // Keep this in the click event. Mobile Safari can drop user activation
        // when playback waits for the AudioContext promise first.
        void audioContextRef.current.resume();
      }
    } catch {
      // The native element can still play when Web Audio is unavailable.
      analyserRef.current = null;
    }
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      prepareAudio();
      const playback = audio.play();

      try {
        // `play()` is invoked before any other async work so mobile browsers
        // can see that it came directly from the user's click.
        await playback;
      } catch {
        // Leave the player ready for another user gesture if playback is blocked.
      }
    } else {
      audio.pause();
    }
  };

  useEffect(() => {
    return () => {
      void audioContextRef.current?.close();
    };
  }, []);

  return (
    <>
      <AudioBackgroundPortal
        analyserRef={analyserRef}
        isPlaying={isPlaying}
        palette={colors.palette}
      />

      {createPortal(
        <div className="audio-dock" ref={dockRef}>
          <VisualizerColors theme={theme} {...colors} />
          <section className="audio-controls" aria-label="Audio player">
            <div className="audio-controls__track">
              <div className="audio-controls__info">
                <span className="audio-controls__title">Tabun</span>
                <span className="audio-controls__artist">YOASOBI</span>
              </div>
              <AudioPlayerButton isPlaying={isPlaying} onToggle={togglePlayback} />
            </div>
            <div className="audio-controls__timeline">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                aria-label="Seek music"
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                disabled={!duration}
                onChange={(event) => {
                  const time = Number(event.target.value);
                  if (audioRef.current) audioRef.current.currentTime = time;
                  setCurrentTime(time);
                }}
              />
              <span>{formatTime(duration)}</span>
            </div>

            <audio
              ref={audioRef}
              preload="metadata"
              playsInline
              src={withBasePath("/yoasobi_tabun.mp3")}
              onDurationChange={(event) => {
                const value = event.currentTarget.duration;
                setDuration(Number.isFinite(value) ? value : 0);
              }}
              onTimeUpdate={(event) =>
                setCurrentTime(event.currentTarget.currentTime)
              }
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
