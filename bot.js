const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

// 🔐 TOKEN
const TOKEN = "8735540730:AAFFKuhJMoGy3XjJo6YssABA-wkQNWOnMIs";

// 🔒 TU ID
const OWNER = 6601338545;

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
function datosCompletos(){
 return (
  data.fecha &&
  data.diaria &&
  data.premia2 &&
  data.juega3 &&
  data.fechas
 );
}

// 💰 BANCA
function distribuirBanca(total, cantidad){

 let base = Math.floor(total / cantidad);

 if(base < 10){
  return { error: "❌ Banca muy baja" };
 }

 let arr = [];

 for(let i=0;i<cantidad;i++){
  arr.push(base);
 }

 return arr;
}

// 🧠 GENERAR NÚMEROS
function generarNumeros(base, cantidad){

 let set = new Set();

 while(set.size < cantidad){

  let n = parseInt(base[Math.floor(Math.random()*base.length)]);
  let variacion = Math.floor(Math.random()*3) - 1;

  let num = (n + variacion + 100) % 100;

  set.add(num.toString().padStart(2,"0"));
 }

 return Array.from(set);
}

// 🤖 BOT
bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 if(chatId !== OWNER){
  return bot.sendMessage(chatId, "⛔ No autorizado");
 }

 let lineas = text.split("\n");

 for(let linea of lineas){

  let p = linea.trim().split(" ");
  let comando = p[0];

  // 📅 FECHA
  if(comando === "fecha"){
   data.fecha = p[1];
  }

  // 🎯 DIARIA
  if(comando === "diaria"){
   data.diaria = {
    numeros: p.slice(1,5).filter(x => !isNaN(x)),
    multi: p[5] || "7"
   };
  }

  // 🎯 PREMIA2
  if(comando === "premia2"){
   data.premia2 = {
    numeros: p.slice(1,5)
   };
  }

  // 🎯 JUEGA3
  if(comando === "juega3"){
   data.juega3 = {
    numeros: p.slice(1,5)
   };
  }

  // 🎯 FECHAS
  if(comando === "fechas"){
   data.fechas = {
    numeros: p.slice(1,5)
   };
  }

  // 💾 GUARDAR
  if(comando === "guardar"){

   if(!datosCompletos()){
    return bot.sendMessage(chatId, "❌ Faltan datos completos");
   }

   historial = JSON.parse(JSON.stringify(data));

   data = {
    fecha: null,
    diaria: null,
    premia2: null,
    juega3: null,
    fechas: null
   };

   return bot.sendMessage(chatId, "✅ Día guardado");
  }

  // 📊 VER
  if(comando === "ver"){
   return bot.sendMessage(chatId, JSON.stringify(historial, null, 2));
  }

  // 💰 BANCA
  if(comando === "banca"){

   let total = parseInt(p[1]);
   let cantidad = parseInt(p[2]);

   if(!historial){
    return bot.sendMessage(chatId, "❌ No hay datos guardados");
   }

   let dist = distribuirBanca(total, cantidad);

   if(dist.error){
    return bot.sendMessage(chatId, dist.error);
   }

   let msg = "💰 DISTRIBUCIÓN:\n\n";

   dist.forEach((m,i)=>{
    msg += `#${i+1} → C$${m}\n`;
   });

   return bot.sendMessage(chatId, msg);
  }

  // 🚀 PRO MAX
  if(comando === "pro"){

   let total = parseInt(p[1]);
   let cantidad = parseInt(p[2]);

   if(!historial){
    return bot.sendMessage(chatId, "❌ No hay datos guardados");
   }

   let base = historial.diaria.numeros;

   let numeros = generarNumeros(base, cantidad);

   let dist = Math.floor(total / cantidad);

   let msg = "💸 LOTO PRO MAX VIP 🚀\n\n";

   msg += "🎯 NÚMEROS GENERADOS:\n";
   numeros.forEach(n=>{
    msg += `→ ${n}\n`;
   });

   msg += "\n💰 DIARIA:\n";
   numeros.forEach(n=>{
    msg += `${n} → C$${dist} + Multi C$${dist}\n`;
   });

   msg += `\n💵 TOTAL: C$${total}\n`;

   return bot.sendMessage(chatId, msg);
  }

 }

 bot.sendMessage(chatId,
`📌 COMANDOS:

fecha 2026-04-10
diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373
fechas 12 5 7 22
guardar

ver
banca 300 10
pro 300 10`
 );

});

// 🌐 SERVER
const app = express();

app.get("/", (req,res)=>{
 res.send("🤖 BOT VIP ACTIVO");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
 console.log("Servidor activo");
});
