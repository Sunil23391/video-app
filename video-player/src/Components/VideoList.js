import React from "react";
import "./VideoList.css";
import baseUrl from "../baseUrl";
const VideoList = () => {
  const [videos, setVideos] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch(`${baseUrl}/videos`);
        const data = await res.json();
        setVideos(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="video-list">
      {error ? (
        <p className="video-list-error">{error}</p>
      ) : (
        <ul className="video-list">
          {videos.map((video) => (
            <li key={video.link} className="video-list-item">
              <p className="video-list-item-name">
                <div className="video-list-item-name-container">
                  <span className="video-list-item-name-only-video">
                    Only Video: 
                  </span>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`/video/${video.location}`}
                    className="video-list-item-name-link"
                  >
                    {video.name}
                  </a>
                </div>
                <div className="video-list-item-name-container">
                  <span className="video-list-item-name-workarea">
                    Workarea: 
                  </span>
                  <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`/workarea/${video.location}`}
                    className="video-list-item-name-link"
                  >
                    {video.name}
                  </a>
                </div>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VideoList;
