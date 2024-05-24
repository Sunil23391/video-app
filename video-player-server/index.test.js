const request = require("supertest");
const app = require("./index");

describe("GET /files", () => {
  it("should return a list of mp4 and srt files in the /files directory", async () => {
    const response = await request(app).get("/files");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("mp4Files");
    expect(response.body).toHaveProperty("srtFiles");
    expect(response.body).toHaveProperty("fileList");
    expect(response.body.fileList).toHaveLength(response.body.mp4Files.length);
  });
});

describe("GET /stream/:file", () => {
  it("should return a video file by streaming it directly from the server", async () => {
    const response = await request(app).get("/stream/test.mp4");
    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toBe("video/mp4");
    expect(response.headers["content-length"]).toBeGreaterThan(0);
  });

  it("should return a 404 error if the file does not exist in the /files directory", async () => {
    const response = await request(app).get("/stream/nonexistent.mp4");
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("File not found");
  });
});
