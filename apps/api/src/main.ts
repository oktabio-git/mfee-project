import app from "./app";

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.get("/", (req, res) => {
  res.send({ message: "Hello MFEE!" });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
