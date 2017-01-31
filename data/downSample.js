var fs = require("fs");
var pako = require("./../js/lib/pako.min.js");

fs.readFile("elevation.tsv", (err, data) => {
    data = data.toString().split("\n").map(x => x.split("\t").map(Number));
    var zoom = 2;
    var out = [];
    for (var i = 0; i < data.length; i += zoom) {
        var row = [];
        for (var j = 0; j < data[0].length; j += zoom) {
            row.push(data[i][j]);
        }
        out.push(row);
    }
    var text = out.map(x => x.join("\t")).join("\n");

    fs.writeFile("elevation_downsample.tsv", pako.deflate(text, {
        to: "string"
    }));
    console.log(data[0].length);
})