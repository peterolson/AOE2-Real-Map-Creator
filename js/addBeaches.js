function addBeaches(map) {
    var size = map.length;

    var queue = [];

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tile = map[i][j];
            tile.waterDistance = undefined;
            if (terrains[tile.terrain].type !== "land") {
                tile.waterDistance = 0;
                queue.push([i, j, 0]);
            }
        }
    }

    if (!queue.length) {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                var tile = map[i][j];
                tile.waterDistance = Infinity;
            }
        }
    }

    while (queue.length) {
        var coords = queue.shift(),
            x = coords[0],
            y = coords[1],
            distance = coords[2];
        for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, size); i++) {
            for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, size); j++) {
                var tile = map[i][j];
                if (tile.waterDistance === undefined) {
                    tile.waterDistance = distance + 1;
                    queue.push([i, j, distance + 1]);
                }
            }
        }
    }

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tile = map[i][j];
            if (tile.waterDistance === 1) {
                tile.terrain = terrains[tile.terrain].beach;
            }
        }
    }
}

function isBeachWater(map, x, y) {
    var size = map.length;
    if (map[x][y].climate[0] !== "w") return false;
    for (var i = Math.max(x - 1, 0); i < Math.min(x + 2, size); i++) {
        for (var j = Math.max(y - 1, 0); j < Math.min(y + 2, size); j++) {
            var tile = map[i][j];
            if (tile.climate[0] !== "w") return true;
        }
    }
    return false;
}