(function () {
    var climatePanel = document.getElementById("climatePanel");
    var html = [];
    var table = document.createElement("table"),
        tr = document.createElement("tr"),
        count = 0;
    for (var i in config.climateDescriptions) {
        var description = config.climateDescriptions[i].split("|"),
            title = description[0].split(" ("),
            locations = description[1];
        
        var td = document.createElement("td");
        var titleDiv = document.createElement("div"),
            clearBtn = document.createElement("button"),    
            holderDiv = document.createElement("div");
        titleDiv.className = "title";
        titleDiv.innerHTML = title[0] + "<br>(" + title[1];
        td.title = locations;
        clearBtn.innerText = "Clear";
        clearBtn.className = "clear";
        clearBtn.onclick = clear;
        titleDiv.appendChild(clearBtn);
        holderDiv.className = "holder";
        holderDiv.style.backgroundColor = "rgb(" + config.climateColors[i] + ")";
        holderDiv.climate = i;
        var holderTerrains = config.defaultTerrains[i];
        for (var i = 0; i < holderTerrains.length; i++) {
            holderDiv.appendChild(createImg(holderTerrains[i]));
        }
        td.ondrop = drop;
        td.ondragover = allowDrop;
        td.appendChild(titleDiv);
        td.appendChild(holderDiv);
        tr.appendChild(td);
        if (count++ === 3) {
            table.appendChild(tr);
            tr = document.createElement("tr");
            count = 0;
        }
    }
    table.appendChild(tr);
    climatePanel.appendChild(table);

    function refreshTerrainPanel() {
        var dataSet = document.getElementById("dataset").value;
        var terrainPanel = document.getElementById("terrainPanel");
        terrainPanel.innerHTML = "";
        for (var i = 0; i < config.terrainOrder.length; i++) {
            var j = config.terrainOrder[i];
            if (dataSet !== "hd") {
                if (j >= 40) continue;
            }    
            var img = createImg(j);
            terrainPanel.appendChild(img);
        }
        terrainPanel.style.width = table.clientWidth + "px";
    }
    refreshTerrainPanel();
    terrains.refreshTerrainPanel = refreshTerrainPanel;

    function allowDrop(e) {
        e.preventDefault();
    }    

    var dragData = {};
    function drag(e) {
        dragData.index = this.index;
    }
    function drop(e) {
        e.preventDefault();
        var holder = this.getElementsByClassName("holder")[0];
        holder.appendChild(createImg(dragData.index));
    }

    function clear() {
        this.parentElement.nextSibling.innerHTML = "";
    }
    function createImg(index) {
        var img = document.createElement("img");
        img.src = "img/terrain/" + index + ".png";
        img.title = terrains[index].description;
        img.index = index;
        img.ondrag = drag;
        return img;
    }
})();