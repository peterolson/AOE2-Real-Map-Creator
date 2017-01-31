var saveMap = (function () {
    var formats = {
        original: {
            headerLength: 28,
            searchOffset: 4449,
            model: "maps/tiny.scx",
            modelSize: 120,
            extension: "scx"
        },
        hd: {
            headerLength: 61,
            searchOffset: 4449,
            model: "maps/tiny.aoe2scenario",
            modelSize: 120,
            extension: "aoe2scenario"
        }
    };

    var holders = document.getElementsByClassName("holder"),
        holdersDict = {};
    for (var i = 0; i < holders.length; i++) {
        holdersDict[holders[i].climate] = holders[i];
    }

    function addTerrains(map) {
        var size = map.length;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var tile = map[i][j];
                var terrain = 1;
                if (tile.climate) {
                    var imgs = holdersDict[tile.climate].getElementsByTagName("img");
                    var img = imgs[Math.random() * imgs.length | 0];
                    terrain = img.index;
                }
                tile.terrain = terrain;
            }
        }
        addBeaches(map);
        addElevation(map, +document.getElementById("sldMaxElevation").value);
    }

    function generateMap(map) {
        addTerrains(map);
        var size = map.length;
        var data = [size, 0, 0, 0, size, 0, 0, 0];
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var tile = map[i][j];
                data.push(tile.terrain, tile.level, 0);
            }
        }
        return new Uint8Array(data);
    }

    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    function save(mapData, format) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', format.model);
        xhr.responseType = 'arraybuffer';
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var buffer = new Uint8Array(xhr.response);
                var header = buffer.slice(0, format.headerLength),
                    compressed = buffer.slice(format.headerLength);
                var uncompressed = pako.inflate(compressed, {
                    windowBits: -15
                });
                var index = uncompressed.indexOf(format.modelSize, format.searchOffset);
                var length = 8 + 3 * format.modelSize * format.modelSize;

                var head = uncompressed.slice(0, index);
                var map = generateMap(mapData);
                var foot = uncompressed.slice(index + length);
        
                var together = new Uint8Array(head.byteLength + map.byteLength + foot.byteLength);
                together.set(head);
                together.set(map, head.byteLength);
                together.set(foot, head.byteLength + map.byteLength);

                var recompressed = pako.deflate(together, {
                    level: 9,
                    windowBits: -15
                });
                var blob = new Blob([header, recompressed]),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = "real_world_scenario." + format.extension;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }
        xhr.send();
    }
    save.format = formats;
    return save;
})();