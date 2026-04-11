const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cron = require("node-cron");

// 🔐 TOKEN
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 👑 USUARIOS VIP
const VIPS = [6601338545];

const bot = new TelegramBot(TOKEN, { polling: true });

// 📦 DATA DEL DÍA
let data = {
 fecha: null,
 diaria: null,
 premia2: null,
 juega3: null,
 fechas: null
};

// 🧠 SOLO ÚLTIMO DÍA
let historial = null;

// 🔍 VALIDAR
function completo(){
 return data.fecha && data.diaria && data.premia2 && data.juega3 && data.fechas;
}

// 📊 FRECUENCIA REAL
function frecuencia(nums){
 let map = {};
 nums.forEach(n=>{
  map[n] = (map[n] || 0) + 1;
 });
 return Object.entries(map)
  .sort((a,b)=>b[1]-a[1])
  .map(x=>x[0]);
}

// 🧠 GENERAR NÚMEROS
function generar(base, cantidad){
 let set = new Set();

 while(set.size < cantidad){
  let n = parseInt(base[Math.floor(Math.random()*base.length)]);
  let v = Math.floor(Math.random()*3)-1;
  let num = (n+v+100)%100;
  set.add(num.toString().padStart(2,"0"));
 }

 return Array.from(set);
}

// 🔢 JUEGA3
function gen3(base){
 return base.map(n => n + Math.floor(Math.random()*10));
}

// 🔢 PREMIA2
function gen4(base){
 return base.map(n => n + Math.floor(Math.random()*10));
}

// ⏰ RECORDATORIO 10PM
cron.schedule("0 22 * * *", () => {
 VIPS.forEach(id=>{
  bot.sendMessage(id,
`⏰ RECORDATORIO

Envíe resultados:

✔ diaria
✔ juega3
✔ premia2
✔ fechas

Para generar jugadas del día siguiente`);
 });
}, {
 timezone: "America/Managua"
});

// 🤖 BOT
bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 if(!VIPS.includes(chatId)){
  return bot.sendMessage(chatId, "🔒 Acceso VIP únicamente");
 }

 let lineas = text.split("\n");

 for(let linea of lineas){

  let p = linea.trim().split(" ");
  let cmd = p[0];

  // 📅 FECHA
  if(cmd === "fecha"){
   data.fecha = p[1];
  }

  // 🎯 DIARIA
  if(cmd === "diaria"){
   data.diaria = {
    numeros: p.slice(1,5),
    multi: p[5] || "7"
   };
  }

  // 🎯 OTROS
  if(cmd === "premia2") data.premia2 = p.slice(1,5);
  if(cmd === "juega3") data.juega3 = p.slice(1,5);
  if(cmd === "fechas") data.fechas = p.slice(1,5);

  // 💾 GUARDAR
  if(cmd === "guardar"){

   if(!completo()){
    return bot.sendMessage(chatId,"❌ Faltan datos completos");
   }

   historial = JSON.parse(JSON.stringify(data));

   data = {
    fecha: null,
    diaria: null,
    premia2: null,
    juega3: null,
    fechas: null
   };

   return bot.sendMessage(chatId,"✅ Día guardado");
  }

  // 📊 VER
  if(cmd === "ver"){
   return bot.sendMessage(chatId, JSON.stringify(historial, null, 2));
  }

  // 🚀 PRO MAX
  if(cmd === "pro"){

   let total = parseInt(p[1]);
   let cant = parseInt(p[2]);

   if(!historial){
    return bot.sendMessage(chatId,"❌ No hay datos guardados");
   }

   let base = frecuencia(historial.diaria.numeros);
   let nums = generar(base, cant);
   let monto = Math.floor(total / cant);

   let juega3 = gen3(nums);
   let premia2 = gen4(nums);

   let msg = "💸 LOTO PRO MAX VIP 🚀\n\n";

   msg += "🔥 NÚMEROS FUERTES:\n";
   nums.forEach(n=> msg += `→ ${n}\n`);

   msg += "\n💰 DIARIA:\n";
   nums.forEach(n=>{
    msg += `${n} → C$${monto} + Multi C$${monto}\n`;
   });

   msg += "\n🔢 JUEGA3:\n";
   juega3.forEach(n=> msg += `→ ${n}\n`);

   msg += "\n🔥 PREMIA2:\n";
   premia2.forEach(n=> msg += `→ ${n}\n`);

   msg += `\n💵 TOTAL: C$${total}`;

   return bot.sendMessage(chatId, msg);
  }

 }

 bot.sendMessage(chatId,
`📌 VIP ACTIVO

fecha 2026-04-10
diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373
fechas 12 5 7 22
guardar

pro 300 10`
 );

});

// 🌐 SERVER (RENDER)
const app = express();

app.get("/", (req,res)=>{
 res.send("🔥 BOT VIP ONLINE");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
 console.log("Servidor activo");
});  
