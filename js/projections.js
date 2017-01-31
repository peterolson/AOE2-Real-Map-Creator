var projections = (function () {
    function scaleTo(x, y, rx, ry) {
        x -= 0.5;
        y -= 0.5;
        return [x * rx, y * ry];
    }

    return {
        rectangular: function (x, y, dx, dy) {
            var lat = y * 180 - 90,
                lon = x * 360 - 180;
            return [dy * 180 + lat, dx * 360 + lon];
        },
        mercator: function (x, y, dx, dy) {
            var scaled = scaleTo(x, y, 360, Math.PI);
            x = scaled[0];
            y = scaled[1];
            var lat = 2 * Math.atan(Math.exp(y)) - Math.PI / 2,
                lon = x;
            return [dy * 180 + lat * 73, dx * 360 + lon];
        },
        cylindrical: function (x, y, dx, dy) {
            var scaled = scaleTo(x, y, 219, Math.PI);
            x = scaled[0];
            y = scaled[1];
            var cos_phi = Math.cos(52 * Math.PI / 180);
            var lat = Math.asin(y * cos_phi),
                lon = x / cos_phi;
            return [dy * 180 + lat * 65, dx * 360 + lon];
        },
        eckertIV: function (x, y, dx, dy) {
            var scaled = scaleTo(x, y, Math.PI, Math.PI * 0.84);
            x = scaled[0];
            y = scaled[1];
            var t = Math.asin((y / 2) * Math.sqrt((4 + Math.PI) / Math.PI));
            var lat = Math.asin((t + Math.sin(t) * Math.cos(t) + 2 * Math.sin(t)) / (2 + Math.PI / 2)),
                lon = Math.sqrt(Math.PI * (4 + Math.PI)) * x / (2 * (1 + Math.cos(t)));
            return [dy * 180 + lat * 58, dx * 360 + lon * 88];
        },
        orthographic: function (x, y, dx, dy) {
            var scaled = scaleTo(x, y, Math.PI, Math.PI);
            x = scaled[0]; y = scaled[1];
            dx *= 2 * Math.PI; dy *= Math.PI;
            var rho = Math.sqrt(x * x + y * y),
                R = Math.PI / 2,
                c = Math.asin(rho / R);
            var lat = Math.asin(Math.cos(c) * Math.sin(dy) + (y * Math.sin(c) * Math.cos(dy) / rho));
            var con = Math.cos(c) - Math.sin(dy) * Math.sin(lat);
            var lon = dx + Math.atan2(x * Math.sin(c) * Math.cos(dy), con * rho);
            return [lat * 180 / Math.PI, lon * 180 / Math.PI];
        },
        stereographic: function (x, y, dx, dy) {
            var scaled = scaleTo(x, y, Math.PI, Math.PI);
            x = scaled[0]; y = scaled[1];
            dx *= 2 * Math.PI; dy *= Math.PI;
            var R = 1;
            var rho = Math.sqrt(x * x + y * y),
                c = 2 * Math.atan(rho / (2 * R));
            var lat = Math.asin(Math.cos(c) * Math.sin(dy) + y * Math.sin(c) * Math.cos(dy) / rho),
                lon = dx - Math.atan2((rho * Math.cos(dy) * Math.cos(c) - y * Math.sin(dy) * Math.sin(c)), x * Math.sin(c));
            return [lat * 180 / Math.PI, lon * 180 / Math.PI];
        }
    };
})();

var projectionUtils = {
    zoom: function (zoom, projection) {
        return function (x, y, dx, dy) {
            x = (x - 0.5) / zoom + 0.5;
            y = (y - 0.5) / zoom + 0.5;
            return projection(x, y, dx, dy);
        }
    },
    offset: function (dx, dy, projection) {
        return function (x, y) {
            return projection(x, y, dx, dy);
        }
    },
    stretch: function (stretch, projection) {
        return function (x, y, dx, dy) {
            var result = projection(x, y, dx, dy);
            result[1] /= stretch;
            return result;
        }
    },
    flipHorizontal: function (isFlipped, projection) {
        return function (x, y, dx, dy) {
            if (isFlipped) x = 1 - x;
            return projection(x, y, dx, dy);
        }
    },
    flipVertical: function (isFlipped, projection) {
        return function (x, y, dx, dy) {
            if (isFlipped) y = 1 - y;
            return projection(x, y, dx, dy);
        }
    },
    rotate: function (deg, projection) {
        return function (x, y, dx, dy) {
            x -= 0.5;
            y -= 0.5;
            var r = projectionUtils.rotateXY(x, y, deg);
            return projection(r[0] + 0.5, r[1] + 0.5, dx, dy);
        }
    },
    getProjection: function (settings) {
        var dx = settings.dx || 0,
            dy = settings.dy || 0,
            zoom = settings.zoom || 1,
            stretch = settings.stretch || 1,
            flipH = settings.flipHorizontal || false,
            flipV = settings.flipVertical || false,
            angle = settings.rotateAngle || 0,
            name = settings.name || "rectangular",
            p = projectionUtils;
        return p.offset(dx, dy,
            p.stretch(stretch,
                p.zoom(zoom,
                    p.flipHorizontal(flipH,
                        p.flipVertical(flipV,
                            p.rotate(angle,
                                projections[name]))))));
    },
    rotateXY: function (x, y, deg) {
        var t = deg * Math.PI / 180,
        cost = Math.cos(t),
        sint = Math.sin(t);
        var x1 = x * cost + y * sint,
            y1 = -x * sint + y * cost;
        return [x1, y1];
    }
};