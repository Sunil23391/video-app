const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "./videofiles/" });
const app = express();
const port = 3002;
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
/**
 * GET /files
 *
 * This endpoint returns a list of files in the server's /files directory.
 * The list includes all .mp4 and .srt files.
 *
 * @param {Object} req - A request object containing no parameters.
 * @param {Object} res - A response object.
 *
 * @return {Object} - A response object containing a list of files.
 */
app.get("/videos", (req, res) => {
  const files = require("fs").readdirSync("./videofiles");
  const videoFolders = files.filter((file) => require("fs").lstatSync(`./videofiles/${file}`).isDirectory());
  const fileList = videoFolders.map((videoFolder) => {
    const videoFiles = require("fs").readdirSync(`./videofiles/${videoFolder}`);
    const videoFile = videoFiles.find((file) => file.endsWith(".mp4"));
    const videoSubtitleFile = videoFiles.find((file) => file.endsWith(".srt"));
    return {
      name: require("fs").existsSync(`./videofiles/${videoFolder}/name`)
        ? require("fs")
          .readFileSync(`./videofiles/${videoFolder}/name`, "utf8")
          .trim()
        : "",
      location: videoFolder,
      link: `http://localhost:${port}/stream/${videoFolder}/${videoFile}`,
      subtitle: `http://localhost:${port}/stream/${videoFolder}/${videoSubtitleFile}`,
    };
  });
  res.json(fileList);
});

/**
 * GET /stream/:file*
 *
 * This endpoint returns a video file by streaming it directly from the server.
 * The file is specified in the URL parameter `file`.
 *
 * @param {Object} req - A request object containing the file name as a parameter.
 * @param {Object} res - A response object.
 * @param {String} req.params.file - The file name to stream.
 * @returns {undefined}
 */
app.get("/stream/:folder/:file", (req, res) => {
  const filePath = `./videofiles/${req.params.folder}/${req.params.file}`;
  const stat = require("fs").statSync(filePath);
  res.header("Content-Length", stat.size);
  res.header("Content-Type", "video/mp4");
  const readStream = require("fs").createReadStream(filePath);
  readStream.pipe(res);
});

/**
 * GET /stream/:folder/:file.srt
 *
 * This endpoint returns an srt file by streaming it directly from the server.
 * The file is specified in the URL parameter `file`.
 *
 * @param {Object} req - A request object containing the file name as a parameter.
 * @param {Object} res - A response object.
 * @param {String} req.params.file - The file name to stream.
 * @returns {undefined}
 */
app.get("/subtitle/:folder/:file", (req, res) => {
  const filePath = `./videofiles/${req.params.folder}/${req.params.file}`;
  const stat = require("fs").statSync(filePath);
  res.header("Content-Length", stat.size);
  res.header("Content-Type", "text/vtt; charset=utf-8");
  const readFile = require("util").promisify(require("fs").readFile);
  readFile(filePath, "utf8")
    .then((content) => res.send(content))
    .catch((err) => res.status(500).send(err.message));
});

/**
 * POST /upload
 *
 * This endpoint creates a new folder with a random 16 digit string name and uploads a video and subtitle file to the folder.
 *
 * @param {Object} req - A request object containing the file names as parameters.
 * @param {Object} res - A response object.
 * @param {String} req.body.video - The file name of the video to upload.
 * @param {String} req.body.subtitle - The file name of the subtitle to upload.
 * @returns {undefined}
 */
app.post("/upload", upload.fields([{ name: 'video', maxCount: 1 }, { name: 'subtitle', maxCount: 1 }]), async (req, res) => {
  const folderName = require("crypto")
    .randomBytes(16)
    .toString("hex");
  const folderPath = `./videofiles/${folderName}`;
  await require("fs").promises.mkdir(folderPath);
  
  if (!require("fs").statSync(folderPath).isDirectory()) {
    return res.status(409).json({ message: "folder not exists" });
  }

  try {
    const nameFilePath = `${folderPath}/name`;
    if (req.body.name) {
      await require("fs").promises.writeFile(nameFilePath, req.body.name);
    } else if (req.files.video[0].originalname) {
      await require("fs").promises.writeFile(nameFilePath, req.files.video[0].originalname);
    } else {
      await require("fs").promises.writeFile(nameFilePath, "");
    }
    await Promise.all(
      req.files.video.map((file) =>
        require("fs").promises.copyFile(file.path, `${folderPath}/video.mp4`)
      )
    );

    await Promise.all(
      req.files.subtitle.map((file) =>
        require("fs").promises.copyFile(file.path, `${folderPath}/subtitle.srt`)
      )
    );

    res.json({
      folderName,
      video: `http://localhost:3002/stream/${folderName}/video.mp4`,
      subtitle: `http://localhost:3002/subtitle/${folderName}/subtitle.srt`,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
