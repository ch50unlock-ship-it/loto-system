app.use(express.json());

app.post("/update",(req,res)=>{

 let fecha = new Date().toLocaleDateString("en-CA", {
  timeZone: "America/Managua"
 });

 cache.fechas[fecha] = {
  fecha,
  data: req.body
 };

 res.json({ ok:true });
});
