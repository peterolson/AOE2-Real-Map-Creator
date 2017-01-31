function addElevation(map, maxElevation) {
    var size = map.length;

    var elevations = [];
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tile = map[i][j];
            if (terrains[tile.terrain].type === "land") {
                elevations.push(tile.elevation);
            }
        }
    }
    elevations.sort(function (a, b) {
        return a - b;
    });
    var outlierCutoff = 0.95;
    elevations = elevations.slice(0, elevations.length * outlierCutoff | 0);
    var lowElevation = elevations[0],
        highElevation = elevations[elevations.length - 1];
    
    function getLevel(elevation) {
        var level = maxElevation * (elevation - lowElevation) / (highElevation - lowElevation) | 0;
        return Math.min(level, maxElevation);
    }

    function canRaise(x, y, level) {
        var avgLevel = 0, count = 0;
        for (var i = x; i < x + 2 && i < size; i++) {
            for (var j = y; j < y + 2 && j < size; j++) {
                if (map[i][j].maxLevel < level) return false;
                avgLevel += getLevel(map[i][j].elevation);
                count++;
            }
        }
        avgLevel /= count;
        if (avgLevel < level) return false;
        for (var i = Math.max(0, x - 1); i < Math.min(x + 3, size); i++) {
            for (var j = Math.max(0, y - 1); j < Math.min(y + 3, size); j++) {
                var difference = level - map[i][j].level;
                if (difference !== 0 && difference !== 1) return false;
            }
        }
        return true;
    }

    function raise(x, y, level) {
        for (var i = x; i < x + 2 && i < size; i++) {
            for (var j = y; j < y + 2 && j < size; j++) {
                map[i][j].level = level;
            }
        }
    }

    function fillHole(x, y) {
        var level = map[x][y].level;
        if (x > 0 && x < size - 1) {
            if (map[x + 1][y].level > level && map[x - 1][y].level > level) {
                map[x][y].level = map[x + 1][y].level;
                return true;
            }
        }
        if (y > 0 && y < size - 1) {
            if (map[x][y + 1].level > level && map[x][y - 1].level > level) {
                map[x][y].level = map[x][y + 1].level;
                return true;
            }
        }
        if (x > 0 && y > 0 && x < size - 1 && y < size - 1) {
            if (map[x + 1][y + 1].level > level && map[x - 1][y - 1].level > level) {
                map[x][y].level = map[x + 1][y + 1].level;
                return true;
            }
            if (map[x - 1][y + 1].level > level && map[x + 1][y - 1].level > level) {
                map[x][y].level = map[x - 1][y + 1].level;
                return true;
            }
        }
        return false;
    }


    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tile = map[i][j];
            tile.level = 0;
            tile.maxLevel = 0;
            if (tile.waterDistance > 0) {
                tile.maxLevel = Math.max(0, tile.waterDistance - 2);
            }
        }
    }

    for (var newLevel = 1; newLevel <= maxElevation; newLevel++) {
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (canRaise(i, j, newLevel)) {
                    raise(i, j, newLevel);
                }
            }
        }
    }

    var allHolesFilled;
    do {
        allHolesFilled = true;
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                if (fillHole(i, j)) {
                    allHolesFilled = false;
                }
            }
        }
    } while (!allHolesFilled);
    

    console.log(map.map(function (row) {
        return row.map(function (tile) {
            if (tile.elevation <= 0) return "w";
            return tile.level;
        }).join("");
    }).join("\n"));

}