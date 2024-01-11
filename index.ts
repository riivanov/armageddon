import express from "express";
const app = express();
const port = 7890;

app.get("/", (req, res) => {
  res.send(`hello world`);
});

app.listen(port, () => {
  console.log(`[server]: server is running at http://localhost:${port}`);
});
