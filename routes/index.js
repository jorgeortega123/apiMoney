var express = require("express");
var fs = require("fs");

var express = require("express");
var router = express.Router();

const folder = "./components/users/";

/* GET home page. */
router.post("/money", (req, res) => {
  console.log(req.body);
  var studentt = req.body;
  var a = folder + studentt.name + "/data.json";
  if (!fs.existsSync(a)) {
    res.json({ data: "No se econtro información del usuario" });
    return false;
  } else {
    var obj = JSON.parse(fs.readFileSync(a).toString());
    res.json(obj);
  }
});

router.post("/event", (req, res) => {
  //var r = req.body.data;
  var r = req.body.data;
  var r = "812"
  var a = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z";
  var [b, d] = [a.split(","), r.split("")];
  var c = d[0] / d[2] - 1;
  var e = c * d[2];
  var [f, i] = [e / c, 0];
  var i = 0;
  var arr = [];
  arr.length = f + c;
  for (; i < arr.length; i++) {
    arr[i] = c;
  }
  arr[f - (e - (f + c))] = 0;
  arr[f + c - 1] = 0;
  var finalName = [];
  console.log((arr[2] = e + (f + c) + (f - c)));
  arr[f] = e + (f + c) + (f - c) + e / f;
  arr[c] = e / c + c + (f + c) + 3;
  for (i = 0; i < 5; i++) {
    finalName.push(b[arr[i]]);
    console.log(finalName);
  }
  //console.log(finalName)
  res.send(finalName);
});
module.exports = router;
