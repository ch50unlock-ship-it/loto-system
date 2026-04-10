const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 almacenamiento en memoria
let DB = {};

app.post("/update", (req, res) => {

 let fecha = new Date().toLocaleDateString("en-CA", {
  timeZone: "America/Managua"
 });

 DB[fecha] = {
  fecha,
  data: req.body
 };

 res.json({
  ok: true,
  fecha,
  data: req.body
 });

});

// 🔍 ver datos
app.get("/resultado", (req, res) => {
 res.json(DB);
});

app.listen(3000, () => {
 console.log("🚀 Backend activo en puerto 3000");
});
