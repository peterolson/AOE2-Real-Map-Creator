function getData(fn) {
    function readFile(path, fn) {
        var client = new XMLHttpRequest();
        client.onreadystatechange = function (res) {
            if (client.readyState === XMLHttpRequest.DONE) {
                fn(client.responseText);
            }
        }
        client.open('GET', path);
        client.send();
    }

    var elevations, climates = {},
        loaded = 0;

    var util = {
        climateAt: function (lat, lon) {
            lon += 180;
            lon %= 360;
            if (lon < 0) lon = 360 + lon;
            lon -= 180;
            if (lat > 90) lat = 90;
            if (lat < -90) lat = -90;
            
            var latInt = lat | 0,
                lonInt = lon | 0,
                latDec = lat % 1,
                lonDec = lon % 1;
            var refLats = [], refLons = [];
            if (latDec < 0) {
                latDec = 1 - latDec;
                latInt--;
            }
            if (latDec < 0.25) refLats = [latInt - 0.25, latInt + 0.25];
            else if (latDec < 0.75) refLats = [latInt + 0.25, latInt + 0.75];
            else refLats = [latInt + 0.75, latInt + 1.25];

            if (lonDec < 0) {
                lonDec = 1 - lonDec;
                lonInt--;
            }
            if (lonDec < 0.25) refLons = [lonInt - 0.25, lonInt + 0.25];
            else if (lonDec < 0.75) refLons = [lonInt + 0.25, lonInt + 0.75];
            else refLons = [lonInt + 0.75, lonInt + 1.25];
            var refs = [[refLats[0], refLons[0]], [refLats[0], refLons[1]], [refLats[1], refLons[0]], [refLats[1], refLons[1]]];
            for (var i = 0; i < refs.length; i++) {
                var ref = refs[i];
                if (climates[ref[0]]) {
                    var climate = climates[ref[0]][ref[1]];
                    if (climate) {
                        return climate;
                    }
                }
            }
        },
        elevationAt: function (lat, lon) {
            var rows = elevations.length,
                cols = elevations[0].length;
            lon %= 360;
            if (lon < 0) lon = 360 + lon;
            if (lat > 90) lat = 90;
            if (lat < -90) lat = -90;

            var i = rows * (lat + 90) / 180,
                j = cols * lon / 360;
            if (i >= rows) i = rows - 1;
            if (j >= cols) j = cols - 1;
            return elevations[i | 0][j | 0];
        }
        
    };

    function finished(fn) {
        document.getElementById("map").style.display = "inline-block";
        fn(util);
    }

    readFile('data/Koeppen-Geiger-ASCII.txt', function (text) {
        text.split("\n").slice(0, -1).forEach(function (line) {
            var parts = line.split(/\s+/).slice(1);
            var lat = parts[0],
                lon = parts[1],
                climate = parts[2];
            if (!climates[lat]) climates[lat] = {};
            climates[lat][lon] = climate;
        });
        document.getElementById("waitClimate").style.display = "none";
        loaded++;
        if (loaded > 1) finished(fn);
    });

    readFile('data/elevation.tsv', function (text) {
        elevations = text.split("\n").slice(0, -1).map(function (line) {
            return line.split("\t");
        });
        document.getElementById("waitElevation").style.display = "none";
        loaded++;
        if (loaded > 1) finished(fn);
    });
}