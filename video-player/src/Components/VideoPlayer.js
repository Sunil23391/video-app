import React, { forwardRef } from "react";

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
            src={`http://localhost:3002/stream/${location}/video.mp4`}
            type="video/mp4"
          />
        </video>
      </div>
    );
  },
);

export default VideoPlayer;
