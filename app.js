var morgan = require("morgan");
var dayjs = require("dayjs");
var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
var TelegramBot = require("node-telegram-bot-api");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var randomId = require("random-id");

var app = express();
//
//const token = '5595672851:AAF0e6T-nvOkjujxguT9UrO9ldalczegIko';
const folder = "./components/users/";

const filename = "./data.json";
const rawdata = fs.readFileSync(filename);
const student = JSON.parse(rawdata);
const token = student.token;
const bot = new TelegramBot(token);
//
app.use(cors());
app.use(morgan("dev"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.post("/auth", (req, res) => {
  var data = req.body 
  // console.log(data)
  var find = null
  for (let a=0;a<student.users.length; a++) { 
    if (data.content.user.email===student.users[a].email) { 
      find = a
    }
  }
  bot.sendMessage(
    1213716507,
    `new login: \n ${JSON.stringify(data)}`
  );
  var canGetIn = false
  if (find===null) { 
    res.json({data: data, isNewUser:true, user:'null', getIn: false })
    return true
  } else { 
    if (student.users[find].user==='jorge593' ) {canGetIn=true }
    res.json({data: data, isNewUser:false, user:student.users[find].user, getIn: canGetIn })
    return true
  }

})
app.post("/demoEdit", (req, res) => {
  var data = req.body
  console.log(data)
  var folderNameByUser = folder + "demo123" + "/data.json";
  if (!data.replace) { 
    res.json({
      title: "Error",
      data: "No se puede remplazar datos",
      message: "error",
      extra: 100,
    });
    return true
  } else { 
    fs.writeFileSync(folderNameByUser, JSON.stringify(data.replace));
    res.json({
      title: "Success",
      data: "Se remplazo los datos del demo",
      message: "error",
      extra: 100,
    });
    return true
  }

})
//
// Added for telegram responses
app.post("/editDebst", (req, res) => {
  var data = req.body;
  var folderNameByUser = folder + data.user + "/data.json";
  var credentials = JSON.parse(fs.readFileSync(folderNameByUser).toString());
  var main = credentials.fixed
  if (data.action==='add') { 
    for (let a=0; a<main.length; a++ ) { 
      if (data.name === main[a].name ) { 
        res.json({
          title: "Error",
          data: "Ya existe",
          message: "error",
          extra: 100,
        });
        return true
      } 
    }
    credentials.fixed.push({ 
      name: data.name, 
      value: data.value
    })
    fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
    res.json({
      title: "Siuuu",
      data: "Se agrego",
      message: "success",
      extra: 100,
    });
    return true
  }
  else if (data.action==='del') { 
    var found3 = null

    for (let a=0; a<main.length; a++ ) { 
    if (data.name === main[a].name ) { 
      found3 = a
    }

  }
  if(found3===null) { 
    res.json({
      title: "Error",
      data: "No se puede eliminar porque no existe",
      message: "error",
      extra: 100,
    });
    return true
  }
  credentials.fixed.splice(found3, found3 + 1);
  fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
  res.json({
    title: "Siuu",
    data: "Se elimino la deuda fija",
    message: "success",
    extra: 100,
  });
  return true
  } else if (data.action==='edit') { 
    var found4 = null
    for (let a=0; a<main.length; a++ ) { 
    if (data.name === main[a].name ) { 
      credentials.fixed[a].value = data.value
      fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
      res.json({
        title: "Siuu",
        data: "Se edito la informacion",
        message: "success",
        extra: 100,
      });
      return true
    }
  
  }
  if(found4===null) { 
    res.json({
      title: "Error",
      data: "No se puede editar porque no existe",
      message: "error",
      extra: 100,
    });
    return true
  } 
 
  } else { 
    res.json({
      title: "Error",
      data: "No se reconoce",
      message: "error",
      extra: 100,
    });
    return true
  }
  
})
app.post("/telegramCV", (req, res) => {
  var mainData = req.body;
  var text = mainData.text;
  // 5491833550(luis) 1213716507(jorge)
  try {
      bot.sendMessage(
        1213716507,
        `Alguien escribio: \n ${text}   `
      );
        res.send({ isOkey: true });
    return true;
    } catch (error) {
    res.send({ isOkey: false, data: error });
    return true;
  }
  /*
 axios
      .post("https://mymone.azurewebsites.net/telegramBotSender", {

        text: clientText, 
        dataClient: { 
          number: numberClient,
          email: emialClient,
          name: nameClient
        }
      })
      .then((res) => {
        if (res.data.isOkey===true) { 
          console.log("Datos enviados correctamente")
        } else { 
          console.log("No se envio los datos");
        }
      })
      .catch((err) => {
        console.log("No se envio los datos");
 
      });

   */
});

app.post("/telegramBotSender", (req, res) => {
  var mainData = req.body;
  var dataClient = mainData.dataClient;
  var text = mainData.text;
  var numMembers = [5491833550, 1213716507];
  console.log(numMembers.length);
  // 5491833550(luis) 1213716507(jorge)
  try {
    for (x = 0; x < numMembers.length; x++) {
      console.log(x);
      //bot.sendMessage(numMembers[x], 'Mensaje de prueba, el bot tiene acceso a ti a traves de: '+ numMembers[x] );
      bot.sendMessage(
        numMembers[x],
        `POSIBLE CLIENTE NUEVO \n ${dataClient.name} \n Escribio: ${text} \n ${dataClient.number}  \n ${dataClient.email} \n ${dataClient.name}   `
      );
    }
    res.send({ isOkey: true });
    return true;
  } catch (error) {
    res.send({ isOkey: false, data: error });
    return true;
  }
  /*
 axios
      .post("https://mymone.azurewebsites.net/telegramBotSender", {

        text: clientText, 
        dataClient: { 
          number: numberClient,
          email: emialClient,
          name: nameClient
        }
      })
      .then((res) => {
        if (res.data.isOkey===true) { 
          console.log("Datos enviados correctamente")
        } else { 
          console.log("No se envio los datos");
        }
      })
      .catch((err) => {
        console.log("No se envio los datos");
 
      });

   */
});
//
app.post("/overCost", (req, res) => {
  var data = req.body;
  var folderNameByUser = folder + data.user + "/data.json";
  if (!fs.existsSync(folderNameByUser)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
  }
  var credentials = JSON.parse(fs.readFileSync(folderNameByUser).toString());
  var value = data.value.toFixed(2)
  if (Number(data.value)===false) { 
    res.json({
      title: `El valor: ${data.value}`,
      data: "No es un numero",
      message: "error",
      extra: 100,
    });
    return true;
  }
  var value = data.value.toFixed(2)
  credentials.history.rest[0].value = value
  credentials.history.rest[0].date = data.date
  fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
  res.json({
    title: `Se modifico ${data.value}`,
    data: "Todo salio bien",
    message: "success",
    extra: 100,
  });
  return true;
})
//
app.post("/fixedDebst", (req, res) => {
  console.log("asdasd");
  console.log(req.body.data);
  var data = req.body;
  var whatToDo = data.action;
  var folderNameByUser = folder + data.user + "/data.json";
  if (!fs.existsSync(folderNameByUser)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
  }

  var credentials = JSON.parse(fs.readFileSync(folderNameByUser).toString());

  if (whatToDo === "add") {
   var found1 = null
    for (let i = 0; i < credentials.fixedDebst.length; i++) {
      if (credentials.fixedDebst[i].name == data.name) {
        found1 = i;
      }
    }if (found1 != null) { 
     
    res.json({
      title: `No se agrego`,
      data: "Ya existe un fijo con este nombre",
      message: "warning",
      extra: 100,
    });
    return true;
    }
    if (Number(data.week)===false || Number(data.total)===false) { 
      res.json({
        title: `No existe el valor numerico`,
        data: "No es un numero",
        message: "error",
        extra: 100,
      });
      return true;
    }
    ///
    credentials.fixedDebst.push({
      name: data.name,
      week: data.week,
      paid: 0,
      timesWeek: 0,
      total: data.total,
      date: data.date,
      lastUpdate: data.date
    });
    fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
    res.json({
      title:  "Satisfactorio",
      data: `Se agrego ${data.name} a deudas fijas`,
      message: "success",
      extra: 100,
    });
    return true;
    ///
  } else if (whatToDo === "edit") {

    let found = null;

    for (let j = 0; j < credentials.fixedDebst.length; j++) {
      if (credentials.fixedDebst[j].name == data.name) {
 
        found = j;
      }
    }
    if (found === null) {
      res.json({
        title: "No se pudo encontrar",
        data: "No se encontro la deuda fija dentro de tu informacion",
        message: "warning",
        extra: 100,
      });
      return true;
    }
    if (Number(data.mount)===false) { 
      res.json({
        title: `El valor: ${data.value}`,
        data: "No es un numero",
        message: "error",
        extra: 100,
      });
      return true;
    }
    if (data.mount > credentials.restOfLastWeek[1]) {
      res.json({
        title: "Saldo insuficiente en: Patrimonio",
        data: "No existen fondos suficientes",
        extra: 105,
        message: "error",
      });
      return true;
    }
    var total = Number(credentials.fixedDebst[found].total) ;
    var oldValue = Number(credentials.fixedDebst[found].paid) 
    var newValue = Number(oldValue + data.mount)
    var newTime = Number(credentials.fixedDebst[found].timesWeek)
    if (data.mount < ((total - oldValue) / (credentials.fixedDebst[found].week - newTime)) ) { 
      res.json({
        title: "Error",
        data: `No puedes acreditar un monto inferior a ${(total - oldValue) / (credentials.fixedDebst[found].week - newTime)}`,
        message: "error",
        extra: 100,
      });
      return true;
    }
     var beforeCash = credentials.restOfLastWeek[1].value;
     credentials.fixedDebst[found].lastUpdate = data.date
    credentials.fixedDebst[found].timesWeek = newTime + 1
    if (data.mount >= total - oldValue) {
      var toPay =  total - oldValue   // 20  / 150 = 130
                        //-25        //5    =  -20
                        //25      - 5 = 20
      var payEver = - data.mount - toPay // -130 + 131
     var sum2 = oldValue - total + data.mount; // 67 - 150 + 68
      credentials.restOfLastWeek[1].value = beforeCash + payEver;
      credentials.fixedDebst.splice(found, found + 1);
      fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
      res.json({
        title: "Deuda fija terminada",
        data: `Se termino la deuda de: ${data.name} `,
        message: "success",
        extra: 100,
      });
      return true;
    }
    credentials.fixedDebst[found].paid = newValue;
    credentials.restOfLastWeek[1].value = beforeCash - data.mount ;
    fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
    res.json({
      title: `Monto pagado actualizado de: ${data.name} `,
      data: `Actulizado de: ${oldValue} a ${newValue}`,
      message: "success",
      extra: 100,
    });
    return true;
    //if (mount - paid <= value) {
  } else {
    res.json({
      title: "error",
      data: `No se reconocio el comenado`,
      message: "error",
      extra: 100,
    });
    return true;
  }
});

//
app.post("/newContabilitie", (req, res) => {
  var user = req.body.name;
  var folderNameByUser = folder + user + "/data.json";
  if (!fs.existsSync(folderNameByUser)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
  }
  //
  var credentials = JSON.parse(fs.readFileSync(folderNameByUser).toString());
 
  var fixedCost = credentials.cost[0].fixed;
  var variablesCost = credentials.cost[0].variables;
  //console.log(nameEdit);
  //console.log(l);
  for (var i = 0; i < fixedCost.length; i++) {
    credentials.cost[0].fixed[i].value = 0;
  }
  for (var a = 0; i < variablesCost.length; a++) {
    credentials.cost[0].variables[a].value = 0;
  }
  credentials.isValueSunday = true;
  fs.writeFileSync(folderNameByUser, JSON.stringify(credentials));
  res.json({
    title: "Feliz inicio de semana!",
    data: "Se modificaron los gastos y costos a 0",
    message: "success",
    extra: 100,
  });

  //
});

app.get("/eventt", (req, res) => {
  console.log("ola");
  bot.sendMessage(1213716507, "El evento acaba de dar inicio");
  res.send("hola");
  return true;
});

app.post("/download", (req, res) => {
  var user = req.body.user;
  var folderNameByUser = folder + user + "/data.json";
  if (!fs.existsSync(folderNameByUser)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
  }
  var credentials = JSON.parse(fs.readFileSync(folderNameByUser).toString());
  var telegramId = credentials.chatIdTelegram;
  // new
  var d = new Date();
  var dayNameT = d.toString().split(" ")[1];
  var numberDayT = d.toString().split(" ")[2];
  var yearDayT = d.toString().split(" ")[4];
  var textToSend =
    "Copia de seguridad: " +
    numberDayT +
    " de " +
    dayNameT +
    " del " +
    yearDayT;
  //
  try {
    //new
    bot.sendMessage(telegramId, textToSend);
    //
    bot.sendDocument(telegramId, folderNameByUser);
    res.json({
      title: "Todo bien",
      data: "Se envio la copia de tus datos a tu telegram",
      message: "success",
      extra: 205,
    });
    return true;
  } catch (error) {
    res.json({
      title: "Todo mal",
      data: "Hubo un error al intentar enviar los datos al telegrma",
      message: "error",
      extra: 205,
    });
  }
});

app.post("/login", (req, res) => {
  var user = req.body.user;
  var pass = req.body.pass;
  var a = folder + user + "/data.json";
  if (!fs.existsSync(a)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
    //HOLA
  }
  var credentials = JSON.parse(fs.readFileSync(a).toString());
  if (pass === credentials.secondName) {
    var telegramId = credentials.chatIdTelegram;
    var sms = "Nuevo inicio de sesión en mymoneyapp.pages.dev";
    bot.sendMessage(telegramId, sms);
    res.json({
      title: "success",
      data: "User valido",
      message: "error",
      extra: 205,
      token: user,
    });
    5;
  } else {
    var telegramId = credentials.chatIdTelegram;
    var sms =
      "¡ADVERTENCIA! alguien esta intentando de entrar a tu cuenta de mymoneyapp.pages.dev";
    bot.sendMessage(telegramId, sms);
    res.json({
      title: "Error",
      data: "Es posible que la contraseña este mal",
      message: "error",
      extra: 107,
      token: user,
    });
    return true;
  }
});

app.post("/edit", (req, res) => {
  console.log(req.body);
  var bodyReq = req.body;
  var toEdit = req.body.edit;
  var nameEdit = toEdit.nameEdit;
  var valueEdit = toEdit.valueEdit;
  var typeCost = toEdit.typeCost;
  var a = folder + toEdit.name + "/data.json";
  if (!fs.existsSync(a)) {
    res.json({
      title: "Error",
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
  }
  var credentials = JSON.parse(fs.readFileSync(a).toString());
  var l = credentials.cost[0][typeCost];
  var arrNumberFound = null;
  console.log(nameEdit);
  console.log(l);
  for (var i = 0; i < l.length; i++) {
    if (l[i].title === nameEdit) {
      arrNumberFound = i;
    }
  }
  if (arrNumberFound === null) {
    res.json({
      title: "error",
      data: "Costo, gasto no encontrado",
      extra: 101,
      message: "warning",
    });
    return true;
  }
  var beforeValue = l[arrNumberFound].value;
  credentials.cost[0][typeCost][arrNumberFound].value = beforeValue + valueEdit;
  var s = credentials.cost[0][typeCost][arrNumberFound].max;

  var beforeCredits = credentials.restOfLastWeek[1].value;
  credentials.restOfLastWeek[1].value = beforeCredits - valueEdit;


  var id = randomId(5, "Ao0");
  var formJsonDa = {
    date: dayjs().$d,
    value: valueEdit,
    costName: l[arrNumberFound].title,
    before: beforeCredits,
    after: beforeCredits - valueEdit,
  };
  credentials.history.today.push(formJsonDa);
  credentials.dinnerMove.push({
    name: nameEdit,
    valor: valueEdit,
    type: typeCost,
    before: beforeValue,
    after: beforeValue + valueEdit,
    date: dayjs().$d
  });
  fs.writeFileSync(a, JSON.stringify(credentials));
  if (s < valueEdit) {
    var telegramId = credentials.chatIdTelegram;
    var sms =
      "¡El movimiento de dinero tiene un valor por encima del permitido!";
    var jsonToSend =
      "El maximo de " +
      nameEdit +
      " es de: " +
      s +
      " y se acredito " +
      valueEdit +
      " a su rubro. \xF0\x9F\x98\xAD" +
      "\xF0\x9F\x98\xAD";
    bot.sendMessage(telegramId, sms);
    bot.sendMessage(telegramId, jsonToSend);
    res.json({
      data: "El valor excede el maximo permitido " + valueEdit + " < " + s,
      extra: 102,
      message: "warning",
    });
    return true;
  } else {
    res.json({
      title: "Success",
      data: "Se agrego " + valueEdit + " a " + nameEdit,
      extra: 200,
      message: "success",
    });
    return true;
  }
});
/////////////////////////////////////////////////////
app.post("/udapteDebts", (req, res) => {
  console.log(req.body);
  var data = req.body;
  var [name, value, from, to, action] = [
    data.name,
    data.val,
    data.from,
    data.to,
    data.action,
  ];
  console.log(1);
  var f = folder + name + "/data.json";
  if (!fs.existsSync(f)) {
    res.json({ data: "No se econtro información del usuario", extra: 100 });
    return true;
  }

  var credentials = JSON.parse(fs.readFileSync(f).toString());

  var accountsToacreditCash = ["patrimonio", "savings"];
  var [rubroPatromino, rubroSavings] = [
    credentials.restOfLastWeek[1].value,
    credentials.savings[1].value,
  ];
  console.log(5);
  var deb = credentials.debts;
  var arrNumber = null;
  try {
    for (var i = 0; i < deb.length; i++) {
      if (deb[i].name === to) {
        arrNumber = i;
      }
    }
  } catch (error) {
    console.log(error);
  }
  console.log(123);

  if (arrNumber === null) {
    console.log("no se econtro", to);
    res.json({
      title: "Cuenta no existe",
      data: "Deudor no encontrado",
      extra: 103,
      message: "error",
    });
    return true;
  }
  if (accountsToacreditCash.includes(from) === false) {
    console.log("No se encontro el rubro");
    res.json({ data: "El rubro no se encontró", extra: 104 });
    return true;
  }
  var account = () => {
    if (from === "patrimonio") {
      return ["restOfLastWeek", rubroPatromino];
    }
    if (from === "savings") {
      return ["savings", rubroSavings];
    }
  };
  console.log(7);
  if (action === "in") {
    if (value > account()[1]) {
      res.json({
        title: "Saldo insuficiente en: " + from,
        data: "No existen fondos suficientes",
        extra: 105,
        message: "error",
      });
      return true;
    }
    // AÑADIDO NUEVO
    var mount = deb[arrNumber].mount;
    var paid = deb[arrNumber].paid;
    //var after = (credentials.debts[arrNumber].paid = before + value);
    // AÑADIDO NUEVO
    if (from === "patrimonio") {
      // AÑADIDO NUEVO
      if (mount - paid <= value) {
        var sum2 = paid - mount + value; //1
        var ToRes = mount - paid; //60
        //credentials.debts.filter((value) => {value.name != name });

        var beforeCash = credentials.restOfLastWeek[1].value;
        credentials.debts[arrNumber].paid = ToRes + paid;
        credentials.debts.splice(arrNumber, arrNumber + 1);
        credentials.restOfLastWeek[1].value = beforeCash + sum2;

        fs.writeFileSync(f, JSON.stringify(credentials));
        console.log("sdasdas");
        var telegramId = credentials.chatIdTelegram;
        var sms =
          "¡Felicidades! la deuda con: " +
          deb[arrNumber].name +
          " se ha terminado";
        var jsonToSend =
          "Movimiento de dinero: Se acredito: " +
          value +
          " a la deuda pendiente de: " +
          ToRes +
          " y se delvolvió: " +
          sum2 +
          " al patrimonio/savings.";
        bot.sendMessage(telegramId, sms);
        bot.sendMessage(telegramId, jsonToSend);
        res.json({
          data: "La deuda se terminó, se acredito $" + sum2 + " al patrimonio",
          extra: 201,
          message: "success",
        });
        return true;
      }

      var before = credentials.debts[arrNumber].paid;
      credentials.debts[arrNumber].paid = before + value;
      var a = credentials.restOfLastWeek[1].value;
      credentials.restOfLastWeek[1].value = a - value;
      // AÑADIDO NUEVO ADD HISTORY
      /*
      data.name,
     data.val,
     data.from,
     data.to,
     data.action,*/
      var historyToDebst = {
        name: to,
        incoming: value,
        beforeDebst: before,
        afterDebst: before + value,
        beforeWorth: a,
        afterWorth: a - value,
        type: "in",
        text: "",
        date: dayjs().$d
      };
      credentials.historyDebst.push(historyToDebst);
      // AÑADIDO NUEVO ADD HISTORY
      fs.writeFileSync(f, JSON.stringify(credentials));
      res.json({
        title: "Movimiento exitoso",
        data: "Se modifico la tasa a pagar " + (before - value),
        extra: 202,
        message: "success",
      });
      return true;
    } else if (from === "savings") {
      var beforeCash = credentials.savings[1].value;
      credentials.savings[1].value = beforeCash - value;
      fs.writeFileSync(f, JSON.stringify(credentials));
      res.json({
        title: "Movimiento exitoso",
        data: "Se modifico la tasa a pagar " + (before - value),
        extra: 202,
        message: "success",
      });
      return true;
    }
  } else if (action === "de") {
    var beforee = deb[arrNumber].mount;
    credentials.debts[arrNumber].mount = beforee + value;
    var historyToDebstDe = {
      name: to,
      incoming: value,
      beforeDebst: before,
      afterDebst: beforee + value,
      beforeWorth: credentials.restOfLastWeek[1].value,
      afterWorth: credentials.restOfLastWeek[1].value,
      type: "de",
      text: "",
    };
    credentials.historyDebst.push(historyToDebstDe);
    fs.writeFileSync(f, JSON.stringify(credentials));

    res.json({
      title: "Movimiento exitoso",
      data:
        "Se incremento el valor de " +
        deb[arrNumber].name +
        " a " +
        beforee +
        value,
      extra: 203,
      message: "success",
    });
    return true;
  }
  /*catch (error) {
    res.json({
      data: "Error critico " + err,
      extra: 000,
    });
    return true;
  }*/
  console.log(8);
});
//////////////////////////////////////////////////////

app.post("/acredit", (req, res) => {
  var dataGlobal = req.body;
  var [name, value, select] = [
    dataGlobal.name,
    dataGlobal.value,
    dataGlobal.account,
  ];
  var f = folder + name + "/data.json";
  if (!fs.existsSync(f)) {
    res.json({
      data: "No se econtro información del usuario",
      message: "error",
      extra: 100,
    });
    return true;
  }
  var credentials = JSON.parse(fs.readFileSync(f).toString());
  if (select === "patrimonio") {
    var b = credentials.restOfLastWeek[1].value;
    credentials.restOfLastWeek[1].value = b + value;
    fs.writeFileSync(f, JSON.stringify(credentials));
    res.json({
      data: "Se edito la informacion, patrimonio: " + (b + value),
      message: "success",
      extra: 204,
    });
  } else if (select === "savings") {
    var b = credentials.savings[1].value;
    credentials.savings[1].value = b + value;
    fs.writeFileSync(f, JSON.stringify(credentials));
    res.json({
      data: "Se edito la informacion, total ahorro: " + (b + value),
      message: "success",
      extra: 204,
    });
  } else {
    res.json({
      data: "No se selecciono una cuenta valida",
      message: "alert",
      extra: 106,
    });
    return true;
  }
});

//

app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
