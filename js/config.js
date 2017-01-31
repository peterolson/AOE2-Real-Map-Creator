var config = {
    climateColors: {
        Af: [58, 81, 55],
        Am: [68, 91, 65],
        As: [80, 107, 77],
        Aw: [92, 123, 86],
        BWk: [169, 131, 96],
        BWh: [236, 191, 152],
        BSk: [189, 151, 116],
        BSh: [207, 171, 136],
        Cfa: [35, 71, 38],
        Cfb: [48, 99, 52],
        Cfc: [65, 133, 70],
        Csa: [188, 169, 146],
        Csb: [172, 192, 141],
        Csc: [143, 193, 87],
        Cwa: [83, 90, 75],
        Cwb: [98, 94, 68],
        Cwc: [154, 134, 122],
        Dfa: [150, 137, 122],
        Dfb: [86, 102, 85],
        Dfc: [48, 73, 59],
        Dfd: [96, 97, 86],
        Dsa: [136, 139, 90],
        Dsb: [166, 169, 120],
        Dsc: [181, 184, 146],
        Dsd: [197, 199, 167],
        Dwa: [99, 124, 104],
        Dwb: [69, 94, 74],
        Dwc: [79, 104, 84],
        Dwd: [89, 114, 94],
        EF: [237, 237, 236],
        ET: [162, 152, 154],
        wb: [141, 167, 230],
        w1: [121, 147, 200],
        w2: [101, 127, 180],
        w3: [81, 107, 160],
        w4: [61, 87, 140],
        w5: [41, 67, 120]
    },
    climateDescriptions: {
        Af: "Tropical (rainforest)|Colombia, Central Africa, Indonesia",
        Am: "Tropical (monsoon)|Northern Brazil, Central Africa, Phillipines",
        As: "Tropical (dry summer)|Eastern Brazil, Eastern Kenya, Central India",
        Aw: "Tropical (savannah)|Southern Brazil, Central Africa, Thailand, Northern Australia",
        BWk: "Desert (cool)|Caucasus, Northwest China",
        BWh: "Desert (hot)|Sahara, Saudi Arabia, Pakistan, Australia",
        BSk: "Steppe (cool)|U.S. Great Plains, Southeast Argentina, Central Mongolia",
        BSh: "Steppe (hot)|Northern Mexico, Botswana, Northeast Australia",
        Cfa: "Temperate (humid, hot summer)|Eastern U.S., Northeast Argentina, Southeast China, Eastern Australia",
        Cfb: "Temperate (humid, warm summer)|Western Europe, Southeast Australia, Southern Chile",
        Cfc: "Temperate (humid, cool summer)|Scotland",
        Csa: "Temperate (hot & dry summer)|Iberian coast, Southern Turkey, North central India",
        Csb: "Temperate (warm & dry summer)|Northern Spain & Portugal, Northwest U.S., Central Chile",
        Csc: "Temperate (cool & dry summer)|Southeast Chile & Southwest Argentina",
        Cwa: "Temperate (dry winter, hot summer)|Zambia, Northwest Argentina, China south coast, Nepal",
        Cwb: "Temperate (dry winter, warm summer)|Eastern South Africa, China Yunnan Province",
        Cwc: "Temperate (dry winter, cool summer)|Andes",
        Dfa: "Cold (humid, warm summer)|Northern U.S., Russia (between Ukraine and Kazakhstan)",
        Dfb: "Cold (humid, cool summer)|Southeast Canada, Eastern Europe",
        Dfc: "Cold (humid, cold summer)|Northwest Canada, Scandinavia, Northern Russia",
        Dfd: "Cold (humid, very cold summer)|Northern Yakutia",
        Dsa: "Cold (warm & dry summer)|Northern Iran, Western Uzbekistan",
        Dsb: "Cold (cool & dry summer)|Armenia, Azerbaijan, Eastern Turkmenistan",
        Dsc: "Cold (cold & dry summer)|Alaska, Kamchatka",
        Dsd: "Cold (very cold & dry summer)|Western Chukotka",
        Dwa: "Cold (dry winter, warm summer)|Northeast China, North Korea",
        Dwb: "Cold (dry winter, cool summer)|Northeast China, North Korea",
        Dwc: "Cold (dry winter, cold summer)|Southeast Russia, Northern Mongolia",
        Dwd: "Cold (dry winter, very cold summer)|Yakutia, Chukotka",
        EF: "Polar frost (always freezing)|Antarctica, Greenland",
        ET: "Tundra (1 month above freezing)|Northeast Canada, Southern Argentina, Tibet",
        wb: "Water (beach)|",
        w1: "Water (<200 meters)|",
        w2: "Water (200-2500 meters)|",
        w3: "Water (2500-3650 meters)|",
        w4: "Water (3650-4500 meters)|",
        w5: "Water (>4500 meters)|"
    },
    terrainOrder: [
        0, 12, 9, 60, 44, 62, // Grasses
        56, 5, //Leaves
        6, 11, 3, 42, 41, 48, 49, 50, //Dirts
        14, 45, 46, // Deserts
        32, 33, 34, 35, // Snowy
        24, 25, 38, 43, 61,  //Roads
        2, 51, 52, 53, 37, // Beaches
        7, 8, 29, 30, 31, 63, 64, 65, 66, 67, //Farms
        58, 1, 15, 23, 22, 57, 4, 59, 54, 26, // Waters
        28, 40, 47 // Other
    ],
    defaultTerrains: {
        Af: [12, 12, 5],
        Am: [0, 12],
        As: [9, 3],
        Aw: [3, 11],
        BWk: [14, 11],
        BWh: [14],
        BSk: [6, 11],
        BSh: [6],
        Cfa: [12, 0, 3],
        Cfb: [0, 9],
        Cfc: [12, 9],
        Csa: [3],
        Csb: [11],
        Csc: [9],
        Cwa: [11, 3, 9, 6],
        Cwb: [9, 5, 11, 3],
        Cwc: [12, 9, 11],
        Dfa: [34, 0, 0],
        Dfb: [34, 0],
        Dfc: [32, 34, 34, 0],
        Dfd: [34, 34, 32],
        Dsa: [33, 6, 6],
        Dsb: [33, 6],
        Dsc: [32, 33, 33, 6],
        Dsd: [33, 33, 32],
        Dwa: [34, 12],
        Dwb: [34, 34, 12],
        Dwc: [32, 34, 12],
        Dwd: [32, 32, 34],
        EF: [35],
        ET: [32],
        wb: [1],
        w1: [1, 1, 23],
        w2: [1, 23, 23],
        w3: [23],
        w4: [23, 22],
        w5: [22]
    },
    mapSize: 200
};