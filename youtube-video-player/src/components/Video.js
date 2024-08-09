const Video = ({ video }) => {
  return (
    <div className="video-container">
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${video.id}`}
        title={video.title}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  );
};
export default Video;