import React, { forwardRef, useEffect } from "react";
import baseUrl from "../baseUrl";

const VideoPlayer = forwardRef(
  ({ location, onSubtitleDrop, onSubtitleDragOver, onPlay, onPause }, ref) => {
    const [currentSpeed, setCurrentSpeed] = React.useState(1);

    const handleSubtitleDrop = (event) => {
      event.preventDefault();
      onSubtitleDrop(event);
    };

    const handleSubtitleDragOver = (event) => {
      event.preventDefault();
      onSubtitleDragOver(event);
    };

    const handlePlay = () => {
      onPlay();
    };

    const handlePause = () => {
      onPause();
    };

    const handleSpeedUp = () => {
      ref.current.playbackRate = Math.min(ref.current.playbackRate + 0.25, 16);
      setCurrentSpeed(ref.current.playbackRate);
    };

    const handleSlowDown = () => {
      ref.current.playbackRate = Math.max(ref.current.playbackRate - 0.25, 0.10);
      setCurrentSpeed(ref.current.playbackRate);
    };

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault(); // Prevent the default action
          ref.current.currentTime = Math.min(ref.current.currentTime - 917, ref.current.duration);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault(); // Prevent the default action
          ref.current.currentTime = Math.min(ref.current.currentTime + 917, ref.current.duration);
        }
      };
      const videoElement = ref.current;
      videoElement.addEventListener("keydown", handleKeyDown);

      return () => {
        videoElement.removeEventListener("keydown", handleKeyDown);
      };
    }, [ref]);

    return (
      <div className="video-player" onDrop={handleSubtitleDrop} onDragOver={handleSubtitleDragOver}>
        <video ref={ref} controls autoPlay onPlay={handlePlay} onPause={handlePause}>
          <source src={`${baseUrl}/stream/${location}/video.mp4`} type="video/mp4" />
        </video>
        <div className="video-player-buttons">
          <button class="control-btn" onClick={handleSlowDown}>Slow Down</button>
          <button class="control-btn" onClick={handleSpeedUp}>Speed Up</button>
          <p class="current-speed">Current speed: {currentSpeed.toFixed(2)}</p>
        </div>
      </div>
    );
  },
);

export default VideoPlayer;
