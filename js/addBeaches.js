function addBeaches(map) {
    var size = map.length;
    function getDistanceFromWater() {
        function getDistance(x, y) {
            if (terrains[map[x][y].terrain].type !== "land") return 0;
            if (x > 0 && !isFinite(map[x - 1][y].waterDistance)) return Infinity;
            if (y > 0 && !isFinite(map[x][y - 1].waterDistance)) return Infinity;
            var r = 1;
            while (r < size) {
                var iStart = Math.max(x - r, 0),
                    iEnd = Math.min(x + r, size - 1),
                    jStart = Math.max(y - r, 0),
                    jEnd = Math.min(y + r, size - 1);
                for (var i = iStart; i <= iEnd; i++) {
                    for (var j = jStart; j <= jEnd; j++) {
                        var tile = map[i][j];
                        if (terrains[tile.terrain].type !== "land") {
                            return r;
                        }
                    }
                }
                r++;
            }
            return Infinity;
        }
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                map[i][j].waterDistance = getDistance(i, j);
            }
        }
    }
    getDistanceFromWater();

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            var tile = map[i][j];
            if (tile.waterDistance === 1) {
                tile.terrain = terrains[tile.terrain].beach;
            }
        }
    }
}