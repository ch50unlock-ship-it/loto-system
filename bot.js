bot.on("message", async (msg) => {

 const chatId = msg.chat.id;
 const text = (msg.text || "").toLowerCase();

 if(chatId !== OWNER){
  return bot.sendMessage(chatId, "⛔ No autorizado");
 }

 // 🧠 PROCESAR VARIAS LÍNEAS
 let lineas = text.split("\n");

 for(let linea of lineas){

  let p = linea.trim().split(" ");
  let comando = p[0];

  // 🎯 DIARIA
  if(comando === "diaria"){
   data.diaria = {
    numeros: p.slice(1,5).filter(x => !isNaN(x)),
    multiplicador: p[5] || "7"
   };
  }

  // 🎯 PREMIA2
  if(comando === "premia2"){
   data.premia2 = {
    numeros: p.slice(1,5).filter(x => !isNaN(x))
   };
  }

  // 🎯 JUEGA3
  if(comando === "juega3"){
   data.juega3 = {
    numeros: p.slice(1,5).filter(x => !isNaN(x))
   };
  }

  // 📊 VER
  if(comando === "ver"){
   return bot.sendMessage(chatId, JSON.stringify(data, null, 2));
  }

  // 🧹 RESET
  if(comando === "reset"){
   data = { diaria:null, premia2:null, juega3:null };
   return bot.sendMessage(chatId, "🧹 Datos borrados");
  }

 }

 // ✅ CONFIRMACIÓN
 if(text.includes("diaria") || text.includes("premia2") || text.includes("juega3")){
  return bot.sendMessage(chatId, "✔ Datos cargados correctamente");
 }

 // 📌 AYUDA
 bot.sendMessage(chatId,
`🎯 COMANDOS:

diaria 8 8 1 3 7
premia2 2373 8080 2344 2343
juega3 211 000 693 373

ver → ver datos
reset → borrar`
 );
});
