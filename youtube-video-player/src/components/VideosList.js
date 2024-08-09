import React from 'react';
import Video from './Video';

const VideosList = () => {
  const [videos, setVideos] = React.useState([]);
  const getVideos = async (query) => {
    // const response = await fetch(
    //   `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${query}&key=YOUR_API_KEY`
    // );
    // const data = await response.json();
    // const data = require('../data/data.json');
    const data = [{
      id: '_uQrJ0TkZlc',
      title: 'Python Tutorial - Python Full Course for Beginners',
      description: 'Python Tutorial - Python Full Course for Beginners',
      thumbnail: "data:image/jpeg;base64,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"
    }]
    return data;
  };

  React.useEffect(() => {
    const fetchVideos = async () => {
      const videos = await getVideos("");
      setVideos(videos);
    };
    fetchVideos();
  }, []);


  return (
    <div className="videos-list">
      <div className="videos-list-grid">
        {videos.map((video,index) => (
          <VideoCard video={video} key={video.link} index={index} />
        ))}
      </div>
    </div>
  );
};

const VideoCard = ({ video, index }) => {
  return (
    <div className="video-card">
      <img
        // src={`https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`}
        src={video.thumbnail}
        alt="video thumbnail"
        className="video-card-thumbnail"
      />
      <div className="video-card-info">
        <h3 className="video-card-title">{video.title}</h3>
        <p className="video-card-description">{video.description}</p>
        <div className="video-card-actions">
          <Video video={video} />
          {/* <a
            rel="noopener noreferrer"
            target="_blank"
            href={`https://www.youtube.com/watch?v=${video.id}`}
            className="video-card-button"
          >
            Watch Video
          </a> */}
        </div>
      </div>
    </div>
  )
};

export default VideosList;