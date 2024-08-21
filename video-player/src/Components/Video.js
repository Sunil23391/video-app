import React, { useState, useRef, useEffect } from "react";
import Subtitles from "./Subtitles";
import VideoPlayer from "./VideoPlayer";
import "./Video.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import baseUrl from "../baseUrl";

function Video({ workspace }) {
  const { location } = useParams();
  const [subtitles, setSubtitles] = useState(
    JSON.parse(localStorage.getItem("subtitles")) || [],
  );
  const [subtitlesColor, setSubtitlesColor] = useState("#ffffff");
  const [subtitlesBackgroundColor, setSubtitlesBackgroundColor] =
    useState("rgba(0, 0, 0, 0.5)");
  const [subtitlesFontSize, setSubtitlesFontSize] = useState(24);
  const [currentSubtitle, setCurrentSubtitle] = useState(null);
  const [isSubtitleSettingsVisible,setSubtitlesSettingsVisible] = useState(false);
  const [isVideoSettingsVisible,setVideoSettingsVisible] = useState(false);
  const [syncTime, setSyncTime] = useState(2);
  let intervalId = useRef(null);

  const videoRef = useRef(null);

  const timeToSec = (time) => {
    const [hours, minutes, seconds, milliseconds] = time.split(/[^\d]+/);
    return (
      parseInt(hours, 10) * 60 * 60 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10) +
      parseInt(milliseconds, 10) / 1000
    );
  };

  const syncSubtitle = async (val) => {
    setSyncTime(syncTime + val);
    onVideoPlay();
  };

  const onCurrentSubtitleChange = () => {
    const currentTimeInSec = videoRef.current.currentTime + syncTime;
    const currentSubtitle = subtitles.find((subtitle) => {
      const fromTimeInSec = timeToSec(subtitle.fromTime);
      const toTimeInSec = timeToSec(subtitle.toTime);
      return (
        currentTimeInSec >= fromTimeInSec && currentTimeInSec < toTimeInSec
      );
    });
    currentSubtitle && setCurrentSubtitle(currentSubtitle);
  };
  const onVideoPlay = () => {
    if (subtitles.length) {
      onCurrentSubtitleChange();
      clearInterval(intervalId.current);
      intervalId.current = setInterval(onCurrentSubtitleChange, 500);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalId.current);
  }, []);

  useEffect(() => {
    fetch(
      `${baseUrl}/subtitle/${location}/subtitle.srt`,
    )
      .then((response) => response.text())
      .then((data) => setSubtitles(parseSrt(data)));
  }, [location]);

  const parseSrt = (data) => {
    const subtitleLines = data
      .split("\n")
      .map((line) => line.replace(/\r/g, ""))
      .filter((line) => line !== "");
    const chunkSize = 3;
    const chunkedSubtitleLines = Array.from(
      { length: Math.ceil(subtitleLines.length / chunkSize) },
      (v, k) => {
        const lines = subtitleLines.slice(k * chunkSize, (k + 1) * chunkSize);
        const fromTime = lines[1].split(" --> ")[0];
        const toTime = lines[1].split(" --> ")[1];
        const text = lines.slice(2).join("\n");
        return { index: k, fromTime, toTime, text };
      },
    );
    localStorage.setItem("subtitles", JSON.stringify(chunkedSubtitleLines));
    return chunkedSubtitleLines;
  };

  const onSubtitleDrop = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      setSubtitles(parseSrt(data));
      onVideoPlay();
    };
    reader.readAsText(file);
  };

  const onSubtitleDragOver = (event) => {
    event.preventDefault();
  };

  const onSubtitleDragStart = (event) => {};

  const onSubtitlesColorChange = (event) => {
    setSubtitlesColor(event.target.value);
  };

  const onSubtitlesBackgroundColorChange = (event) => {
    setSubtitlesBackgroundColor(event.target.value);
  };

  const onSubtitlesFontSizeChange = (event) => {
    setSubtitlesFontSize(event.target.value);
  };

  const onVideoZoomChange = (event) => {
    const sliderValue = +event.target.value || 0;
    const scale = 1 + (sliderValue/100) * 0.2;
    const translateX = (sliderValue/100) * 115;
    const translateY = -(sliderValue/100) * 56;
    videoRef.current.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
  };

  return (
    <div className={`${workspace ? "workarea-video" : "video-app"}`}>
      <header className="app-header">
        {!workspace && <nav className="app-nav">
          <Link to="/">
            <button className="app-nav-back-btn">Back</button>
          </Link>
        </nav>}
      </header>
      <div className="video-player-container">
        <VideoPlayer
          ref={videoRef}
          location={location}
          onSubtitleDrop={onSubtitleDrop}
          onSubtitleDragOver={onSubtitleDragOver}
          onPlay={onVideoPlay}
          onPause={() => clearInterval(intervalId.current)}
        />
        <Subtitles
          subtitles={[currentSubtitle]}
          color={subtitlesColor}
          backgroundColor={subtitlesBackgroundColor}
          fontSize={subtitlesFontSize}
          onSubtitleDragStart={onSubtitleDragStart}
        />
      </div>
      <div className="settings-container">
        <button onClick={()=>setSubtitlesSettingsVisible(!isSubtitleSettingsVisible)}>Subtitles Settings</button>
        <button onClick={()=>setVideoSettingsVisible(!isVideoSettingsVisible)}>Video Settings</button>
      </div>
      
      {isVideoSettingsVisible && <div className="video-settings">
        <label>
          Video zoom:
          <input type="range" min="0" max="100" step={1} onChange={onVideoZoomChange} />
        </label>
      </div>}
      {isSubtitleSettingsVisible && <div className="subtitles-settings">
        <label>
          Subtitles color:
          <input
            type="color"
            value={subtitlesColor}
            onChange={onSubtitlesColorChange}
          />
        </label>
        <label>
          Subtitles background color:
          <input
            type="color"
            value={subtitlesBackgroundColor}
            onChange={onSubtitlesBackgroundColorChange}
          />
        </label>
        <label>
          Subtitles font size:
          <input
            type="number"
            value={subtitlesFontSize}
            onChange={onSubtitlesFontSizeChange}
          />
        </label>
        <button className="subtitle-sync-btn" onClick={()=>syncSubtitle(+1)}>
          Sync Subtitle + 
        </button> 
        <button className="subtitle-sync-btn" onClick={()=>syncSubtitle(-1)}>
          Sync Subtitle -
        </button>
        <label>
          Sync time: {syncTime}
        </label>
      </div>}
    </div>
  );
}

export default Video;
