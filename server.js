const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const usersRoutes = require("./routes/users");

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/users", usersRoutes);

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
