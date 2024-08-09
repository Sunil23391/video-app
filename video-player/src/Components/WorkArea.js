import React, { useEffect, useState } from "react";
import Video from "./Video";
import "./WorkArea.css";
import { Link } from "react-router-dom";

const WorkArea = () => {
  const mainUrl = 'http://localhost:8888/?token=e4c39e5328cd74e45d8762b3d4484e464bc21ff72322d917';
  const [iframeUrl, setIframeUrl] = useState(mainUrl);
  const [isSubmitted, setSubmitted] = useState(true);

  const handleUrlChange = (e) => {
    setIframeUrl(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClear = () => {
    setIframeUrl("");
    setSubmitted(false);
  };
  
  useEffect(() => {
    if (!iframeUrl) {
      setSubmitted(false);
    }
  }, [iframeUrl]);

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

            {isSubmitted ? (
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

