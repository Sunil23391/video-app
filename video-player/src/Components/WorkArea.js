import React, { useState } from "react";
import Video from "./Video";
import "./WorkArea.css";
import { Link } from "react-router-dom";

const WorkArea = () => {
  const mainUrl = 'https://jupyterlite.github.io/demo/lab/index.html';
  const [iframeUrl, setIframeUrl] = useState(mainUrl);
  const [isSubmitting, setSubmitting] = useState(true);

  const handleUrlChange = (e) => {
    setIframeUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
  };

  const handleClear = () => {
    setIframeUrl("");
    setSubmitting(false);
  };

  return (
    <div>

      <header className="work-area-header">
        <h1>Work Area</h1>
        <div className="back-button">
          <Link to="/">
            <button className="back-button-btn">
              Back
            </button>
          </Link>
        </div>
      </header>
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
                <button onClick={handleClear}>Clear</button>
                <iframe
                  src={iframeUrl}
                  frameBorder="0"
                  allowFullScreen
                  title="Embedded Content"
                />
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

    </div>
  );
};

export default WorkArea;

