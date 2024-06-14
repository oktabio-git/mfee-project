export const errorHandler = (err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error" });
};

export default errorHandler;