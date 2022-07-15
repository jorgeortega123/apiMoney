var morgan = require("morgan");
var cors = require("cors");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
//
const folder = "./components/users/";
const filename = "./data.json";
const rawdata = fs.readFileSync(filename);
const student = JSON.parse(rawdata);
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

//
app.post("/login", (req, res) => {
   var user = req.body.user
   var pass = req.body.pass
   var a = folder + user + "/data.json";
   if (!fs.existsSync(a)) {
    res.json({
      title: "Error", 
      data: "No se econtro información del usuario",
      message: "error", 
      extra: 100
    });
  }
  var credentials = JSON.parse(fs.readFileSync(a).toString());
  if(pass===credentials.secondName) {
    res.json({
      title: "success", 
      data: "User valido",
      message: "error", 
      extra: 205,
      token: user
    });
    return true;
  } else {
    res.json({
      title: "Error", 
      data: "Es posible que la contraseña este mal",
      message: "error", 
      extra: 107,
      token: user
    });
    return true;
  }

})



app.post("/edit", (req, res) => {
  console.log(req.body);
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
      extra: 100
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
  credentials.dinnerMove.push({
    name: nameEdit,
    valor: valueEdit,
    type: typeCost,
    before: beforeValue,
    after: beforeValue + valueEdit,
  });
  fs.writeFileSync(a, JSON.stringify(credentials));
  if (s < valueEdit) {
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
    res.json({ data: "No se econtro información del usuario", extra: 100 }); return true;
  }
  console.log(2);
  var credentials = JSON.parse(fs.readFileSync(f).toString());
  console.log(3);
  var accountsToacreditCash = ["patrimonio", "savings"];
  console.log(4);
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
    res.json({title: "Cuenta no existe", data: "Deudor no encontrado", extra: 103, message:"error" });
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
          var ToRes = mount - paid //60
          //credentials.debts.filter((value) => {value.name != name });
          
          var beforeCash = credentials.restOfLastWeek[1].value;
          credentials.debts[arrNumber].paid= ToRes + paid;
          credentials.debts.splice(arrNumber, arrNumber+1)
          credentials.restOfLastWeek[1].value = beforeCash + sum2;
  
          fs.writeFileSync(f, JSON.stringify(credentials));
          console.log("sdasdas");
          
          res.json({
            data:
              "La deuda se terminó, se acredito $" + sum2 + " al patrimonio",
            extra: 201,
            message:"success"
          });
          return true
        }

        var before = credentials.debts[arrNumber].paid;
        credentials.debts[arrNumber].paid = before + value;
        var a =  credentials.restOfLastWeek[1].value
        credentials.restOfLastWeek[1].value = a - value
        // AÑADIDO NUEVO
        fs.writeFileSync(f, JSON.stringify(credentials));
         res.json({
          title: "Movimiento exitoso",
          data: "Se modifico la tasa a pagar " + (before - value),
          extra: 202,
          message: "success"
        })
        return true
      } else if (from === "savings") {
        var beforeCash = credentials.savings[1].value;
        credentials.savings[1].value = beforeCash - value;
        fs.writeFileSync(f, JSON.stringify(credentials));
        res.json({
          title: "Movimiento exitoso",
          data: "Se modifico la tasa a pagar " + (before - value),
          extra: 202,
          message: "success"
        })
        return true;
      }
    } else if (action === "de") {
      var beforee = deb[arrNumber].mount;
      credentials.debts[arrNumber].mount = beforee + value;
      fs.writeFileSync(f, JSON.stringify(credentials));
      res.json({
        data:
          "Se incremento el valor de " +
          deb[arrNumber].name +
          " a " +
          beforee +
          value,
        extra: 203,
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
      extra: 204
    });
  } else if (select === "savings") {
    var b = credentials.savings[1].value;
    credentials.savings[1].value = b + value;
    fs.writeFileSync(f, JSON.stringify(credentials));
    res.json({
      data: "Se edito la informacion, total ahorro: " + (b + value),
      message: "success",
      extra: 204
    });
  } else {
    res.json({ data: "No se selecciono una cuenta valida", message: "alert", extra: 106 });
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
