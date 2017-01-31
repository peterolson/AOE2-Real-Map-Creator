var canvas = document.getElementById("map");
var ctx = canvas.getContext("2d");

var width, height, map;

function resetMap(size) {
    map = [];
    width = height = size;
    for (var i = 0; i < height; i++) {
        map[i] = [];
        for (var j = 0; j < width; j++) {
            map[i].push({ r: 250, g: 250, b: 250, a: 255 });
        }
    }
}
resetMap(config.mapSize);   

function drawMap() {
    canvas.width = width;
    canvas.height = height;
    var imgData = ctx.createImageData(width, height);
    var d = imgData.data;
    var c = 0;
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map.length; j++) {
            var cell = map[i][j];
            d[c++] = cell.r;
            d[c++] = cell.g;
            d[c++] = cell.b;
            d[c++] = cell.a;
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

var worldData;
getData(function (data) {
    worldData = data;
    renderData();
});

var slctProjection = document.getElementById("slctProjection");
var prjSettings = {
    zoom: 1,
    stretch: 1,
    dx: 0,
    dy: 0,
    rotateAngle: 0
};

function renderData() {
    var projection = projectionUtils.getProjection(prjSettings);
    for (var i = 0; i < height; i++) {
        var y = 1 - i / height;
        for (var j = 0; j < width; j++) {
            var x = j / width;
            var cell = map[i][j];
            var proj = projection(x, y),
                lat = proj[0],
                lon = proj[1];
            cell.climate = worldData.climateAt(lat, lon);
            cell.elevation = worldData.elevationAt(lat, lon);
        }
    }
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var cell = map[i][j];
            if (cell.climate && cell.elevation > 0) {
                var color = config.climateColors[cell.climate];
                var darkening = Math.round(Math.log(cell.elevation) * Math.sqrt(cell.elevation) / 6);
                cell.r = Math.max(0, color[0] - darkening);
                cell.g = Math.max(0, color[1] - darkening);
                cell.b = Math.max(0, color[2] - darkening);
            }
            else {
                var color = config.climateColors.water;
                var lightening = Math.round(cell.elevation / 100);
                cell.r = Math.min(255, color[0] + lightening);
                cell.g = Math.min(255, color[1] + lightening);
                cell.b = Math.min(255, color[2] + lightening);
            }
        }
    }
    drawMap();
}

slctProjection.onchange = function () {
    prjSettings.name = this.value;
    renderData();
}

canvas.onmousewheel = function (e) {
    var zoom = prjSettings.zoom;
    if (e.deltaY) {
        if (e.deltaY > 0) {
            zoom /= 1.2;
            if (zoom < 0.25) zoom = 1;
        } else {
            zoom *= 1.2;
        }
    }
    prjSettings.zoom = zoom;
    renderData();
}

var isDragging = false,
    dragStart, dxStart, dyStart;
canvas.onmousedown = function (e) {
    isDragging = true;
    dragStart = [e.pageX, e.pageY];
    dxStart = prjSettings.dx;
    dyStart = prjSettings.dy;
}

document.onmousemove = throttle(function (e) {
    if (isDragging) {
        var zoom = prjSettings.zoom;
        var stretch = prjSettings.stretch;
        var flipX = prjSettings.flipHorizontal ? -1 : 1;
        var flipY = prjSettings.flipVertical ? -1 : 1;
        var dx = (dragStart[0] - e.pageX) / (canvas.width * zoom * flipX),
            dy = -(dragStart[1] - e.pageY) / (canvas.height * zoom * flipY);
        var r = projectionUtils.rotateXY(dx, dy, prjSettings.rotateAngle);
        prjSettings.dx = dxStart + r[0];
        prjSettings.dy = dyStart + r[1];
        renderData();
    }
}, 100);

document.onmouseup = function () {
    isDragging = false;
}

var sldSize = document.getElementById("sldSize");
sldSize.onchange = function () {
    var value = +this.value;
    document.getElementById("sizeText").innerText = value + "×" + value;
    resetMap(value);
    canvas.width = canvas.height = value;
    renderData();
}

var sldStretch = document.getElementById("sldStretch");
sldStretch.onchange = function () {
    var value = +this.value;
    document.getElementById("stretchText").innerText = value.toFixed(2);
    prjSettings.stretch = value;
    renderData();
}

var sldRotate = document.getElementById("sldRotate");
sldRotate.onchange = function () {
    var value = +this.value;
    document.getElementById("rotateText").innerText = this.value;
    prjSettings.rotateAngle = value;
    renderData();
}

var chkFlipHorizontal = document.getElementById("chkFlipHorizontal");
chkFlipHorizontal.onchange = function () {
    prjSettings.flipHorizontal = this.checked;
    renderData();
}
var chkFlipVertical = document.getElementById("chkFlipVertical");
chkFlipVertical.onchange = function () {
    prjSettings.flipVertical = this.checked;
    renderData();
}

var slctDataset = document.getElementById("dataset");
slctDataset.onchange = terrains.refreshTerrainPanel;

var btnSave = document.getElementById("btnSave");
btnSave.onclick = function () {
    saveMap(map, saveMap.format[slctDataset.value]);
}