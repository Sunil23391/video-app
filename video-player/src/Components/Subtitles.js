const Subtitles = ({
  subtitles,
  color,
  backgroundColor,
  fontSize,
  onSubtitleDragStart,
}) => {
  return (
    <div className="subtitles-container">
      {subtitles.map((subtitle, index) => (
        <div key={index}>
          {subtitle && (
            <div
              className="subtitle"
              style={{
                color,
                backgroundColor,
                fontSize: `${fontSize}px`,
              }}
              draggable
              onDragStart={onSubtitleDragStart}
            >
              {subtitle.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Subtitles;
