"use client";

/* Three.js uses mutable refs and uniforms inside the render loop by design. */
/* eslint-disable react-hooks/immutability */

import "@/lib/three-logging";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { createPortal } from "react-dom";
import PressButton from "@/components/ui/PressButton";
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
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

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
    // Leave room for the fully expanded strip, including in portrait layouts.
    camera.position.z =
      9.2 / Math.min(1, size.width / Math.max(1, size.height));
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function VisualizerScene({
  analyserRef,
  isPlaying,
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
}) {
  const bands = useRef<AudioBands>({
    bass: 0,
    mid: 0,
    treble: 0,
    energy: 0,
    beat: 0,
  });

  return (
    <>
      <AudioAnalysis
        analyserRef={analyserRef}
        bands={bands}
        isPlaying={isPlaying}
      />
      <VisualizerCamera />
      <fog attach="fog" args={["#F9F6EE", 12, 22]} />
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.2}>
        <ParticleCloud bands={bands} />
        <MobiusParticleRing bands={bands} />
      </Float>
      <Sparkles
        key={isPlaying ? "playing" : "idle"}
        count={isPlaying ? 70 : 42}
        scale={[5, 3.5, 3]}
        size={1.15}
        speed={isPlaying ? 0.35 : 0.12}
        color="#FFE675"
        opacity={0.48}
      />
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
    <PressButton
      className={`audio-controls__play${isPlaying ? " is-playing" : ""}`}
      onClick={onToggle}
    >
      <PlayIcon playing={isPlaying} />
    </PressButton>
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
}: {
  analyserRef: MutableRefObject<AnalyserNode | null>;
  isPlaying: boolean;
}) {
  const isClient = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  if (!isClient) return null;

  return createPortal(
    <>
      <div className="audio-background" aria-hidden="true">
        <div className="audio-background__canvas">
          <Canvas
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 9.2], fov: 42, far: 100 }}
            gl={{ antialias: true, alpha: true }}
          >
            <VisualizerScene analyserRef={analyserRef} isPlaying={isPlaying} />
          </Canvas>
        </div>
      </div>
      <MusicWave analyserRef={analyserRef} isPlaying={isPlaying} />
    </>,
    document.body,
  );
}

export default function AudioVisualizer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      <AudioBackgroundPortal analyserRef={analyserRef} isPlaying={isPlaying} />

      <div className="audio-controls" aria-label="Audio player">
        <AudioPlayerButton isPlaying={isPlaying} onToggle={togglePlayback} />

        <audio
          ref={audioRef}
          preload="metadata"
          playsInline
          src="/yoasobi_tabun.mp3"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </>
  );
}
