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
  var r = req.body.data;
  var a = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,ñ,o,p,q,r,s,t,u,v,w,x,y,z";
  var b = a.split(",");
  var d = r.split("");
  ///
  var c = d[0] / d[2] - 1;
  var e = c * d[2];
  var f = e / c;
  ///
  var positionFirst = f;
  var positionSecond = f + c;
  for (var m = 0; m < f + c; m + 1) {}
  var print = d;
});
;

module.exports = router;
