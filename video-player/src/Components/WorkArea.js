import React, { useState } from "react";
import Video from "./Video";
import "./WorkArea.css";

const WorkArea = () => {
  const [iframeUrl, setIframeUrl] = useState("https://jupyterlite.github.io/demo/lab/index.html");
  const [isSubmitting, setSubmitting] = useState(false);

  const handleUrlChange = (e) => {
    setIframeUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
  };

  const handleClear = () => {
    setIframeUrl("");
  };

  return (
    <div className="work-area">
      <div className="video-area">
        <Video workspace />
      </div>
      <div className="iframe-area">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={iframeUrl}
            onChange={handleUrlChange}
            style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
            placeholder="Enter URL for iframe"
          />

          {isSubmitting ? (
            <>
              <iframe
                src={iframeUrl}
                style={{ width: '100%', height: 'calc(100% - 40px)' }}
                frameBorder="0"
                allowFullScreen
                title="Embedded Content"
              />
              <button onClick={handleClear}>Clear</button>
            </>
          ) : (
            <>
              <button type="submit">Submit</button>
              <br />
              <span>
                Enter URL for iframe and click Submit. After submitting, you can
                clear the URL and see the message.
              </span>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default WorkArea;

