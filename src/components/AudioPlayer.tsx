import { useRef } from "react";

interface AudioPlayerProps {
  src: string;
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  function handleSpeedChange(rate: number) {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  }

  return (
    <div className="audio-player">
      <audio ref={audioRef} controls src={src} />
      <label>
        Speed: {" "}
        <select
          defaultValue="1"
          onChange={(e) => handleSpeedChange(Number(e.target.value))}
        >
          <option value="0.25">0.25×</option>
          <option value="0.5">0.5×</option>
          <option value="0.75">0.75×</option>
          <option value="1">1×</option>
        </select>
      </label>
    </div>
  );
}
