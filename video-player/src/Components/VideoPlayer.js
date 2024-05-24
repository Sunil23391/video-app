import React, { forwardRef } from "react";
import baseUrl from "../baseUrl";

const VideoPlayer = forwardRef(
  ({ location, onSubtitleDrop, onSubtitleDragOver, onPlay, onPause }, ref) => {
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
    return (
      <div
        className="video-player"
        onDrop={handleSubtitleDrop}
        onDragOver={handleSubtitleDragOver}
      >
        <video
          ref={ref}
          controls
          autoPlay
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source
            src={`${baseUrl}/stream/${location}/video.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
    );
  },
);

export default VideoPlayer;
