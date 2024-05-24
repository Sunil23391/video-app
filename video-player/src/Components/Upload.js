import React, { useState } from "react";

const Upload = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [subtitleFile, setSubtitleFile] = useState(null);
  const [responseText, setResponseText] = useState(null);

  const handleChangeVideo = (e) => setVideoFile(e.target.files[0]);
  const handleChangeSubtitle = (e) => setSubtitleFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("subtitle", subtitleFile);
    // console.log(formData)

    fetch("http://localhost:3002/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setResponseText(JSON.stringify(data, null, 2));
      })
      .catch((err) => {
        setResponseText(err.message);
      });
  };

  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 30px", borderRadius: "10px", backgroundColor: "#fafafa", boxShadow: "0 0 10px rgba(0,0,0,0.1)"}}>
      <h2 style={{margin: "10px 0", textAlign: "center", fontSize: "24px", padding: "0 10px"}}>Upload Video</h2>
      <form onSubmit={handleSubmit} action="/upload" method="post" enctype="multipart/form-data" style={{display: "flex", flexDirection: "column", alignItems: "center", width: "500px", padding: "20px"}}>
        <input type="file" name="video" onChange={handleChangeVideo} style={{width: "100%", padding: "10px", borderRadius: "5px"}}/>
        <input type="file" name="subtitle" onChange={handleChangeSubtitle} style={{width: "100%", padding: "10px", borderRadius: "5px"}}/>
        <button type="submit" style={{width: "100%", backgroundColor: "#007bff", color: "white", padding: "10px", borderRadius: "5px", fontSize: "16px"}}>Upload</button>
      </form>
      <pre style={{whiteSpace: "pre-wrap", overflowWrap: "break-word", fontSize: "16px", padding: "10px"}}>{responseText}</pre>
    </div>
    
  );
};

export default Upload;

