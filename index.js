let avaiableNumbers = [];

function onLoad() {
    updateAvaiableNumbers();

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            document.getElementById("cell" + x + y).addEventListener("input", updateValue);
        }
    }
}

function clearField() {
    avaiableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            document.getElementById("cell" + x + y).value = "";
        }
    }
}

function updateAvaiableNumbers() {
    avaiableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var cellId = "cell" + x + y;
            var cell = document.getElementById(cellId);
            
            var num = parseInt(cell.value);

            if (isNaN(num) || !avaiableNumbers.includes(num))
                cell.value = "";
            else
                avaiableNumbers.splice(avaiableNumbers.indexOf(num), 1);
        }
    }
}

function updateValue(e) {
    var val = e.target.value;

    // update if empty
    if (!val) {
        updateAvaiableNumbers();
        return;
    }

    // only allow 1-9
    if (!val.match(/^[1-9]+$/)) {
        e.target.value = "";
        return;
    }

    // Don't allow duplicates
    var num = parseInt(val);

    if (isNaN(num) || !avaiableNumbers.includes(num)) {
        e.target.value = "";
        return;
    }
    else {
        avaiableNumbers.splice(avaiableNumbers.indexOf(num), 1);
        //analyzeField();
    }
}

function validateInput(e) {
    e = e || window.event;
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);

    // Only allow 1-9
    if (!charStr.match(/^[1-9]+$/))
        e.preventDefault();
    
    // Don't allow duplicates
    var num = parseInt(charStr);

    if (isNaN(num) || !avaiableNumbers.includes(num))
        e.preventDefault();
    else
        avaiableNumbers.splice(avaiableNumbers.indexOf(num), 1);

    //analyzeField();
}

const resultCells = [   
    [[0, 0], [1, 1], [2, 2]], // 0
    [[0, 0], [0, 1], [0, 2]], // 1
    [[0, 0], [1, 0], [2, 0]], // 2
    [[1, 0], [1, 1], [1, 2]], // 3
    [[0, 1], [1, 1], [2, 1]], // 4
    [[2, 0], [2, 1], [2, 2]], // 5
    [[0, 2], [1, 2], [2, 2]], // 6
    [[2, 0], [1, 1], [0, 2]] // 7
];

var totalResults = [0, 0, 0, 0, 0, 0, 0, 0]
var totalPayout = [0, 0, 0, 0, 0, 0, 0, 0]
var permutationCount = 0;

function analyze() {
    totalResults = [0, 0, 0, 0, 0, 0, 0, 0]
    totalPayout = [0, 0, 0, 0, 0, 0, 0, 0]

    var startField = [[],[],[]];

    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            var num = parseInt(document.getElementById("cell" + x + y).value);

            startField[x][y] = isNaN(num) ? 0 : num;
        }
    }

    console.debug(startField);

    var permutations = permute(avaiableNumbers);
    permutationCount = permutations.length;

    if (permutationCount != 0) {
        for (var p = 0; p < permutations.length; p++) {
            var curField = startField.map((x) => x.map((y) => y));
            var i = 0;
            
            for (var x = 0; x < 3; x++) {
                for (var y = 0; y < 3; y++) {
                    if (curField[x][y] == 0) 
                        curField[x][y] = permutations[p][i++];
                }
            }

            //console.log(curField);
            analyzeField(curField);
        }
    } else {
        analyzeField(startField);
    }

    displayResults();
}

function analyzeField(field) {
    var tmp = [0, 0, 0, 0, 0, 0, 0, 0]

    for (var i = 0; i < resultCells.length; i++) {
        for (var j = 0; j < resultCells[i].length; j++)
            tmp[i] += field[resultCells[i][j][1]][resultCells[i][j][0]];        
        totalResults[i] += tmp[i];
        totalPayout[i] += getPayout(tmp[i]);
    }

    //console.debug(tmp);
    //console.debug(tmp.map((x) => getPayout(x)));
}

function displayResults() {
    var resultArea = document.getElementById("results");

    var avgResult = totalResults.map((x) => Math.round(x / permutationCount));
    var avgPayout = totalPayout.map((x) => Math.round(x / permutationCount));

    var highestPayout = 0;
    var picks = "";

    for (var i = 0; i < avgPayout.length; i++) {
        if (avgPayout[i] > highestPayout) {
            picks = i;
            highestPayout = avgPayout[i];
        } else if (avgPayout[i] == highestPayout) {
            picks += " or " + i;
        }
    }

    resultArea.value = "You should pick " + picks + "\n\n" + 
        "Totals: \n" + 
        "\t- Results: [" + totalResults + "]\n" +
        "\t\t- 0: " + totalResults[0] + "\n" +
        "\t\t- 1: " + totalResults[1] + "\n" +
        "\t\t- 2: " + totalResults[2] + "\n" +
        "\t\t- 3: " + totalResults[3] + "\n" +
        "\t\t- 4: " + totalResults[4] + "\n" +
        "\t\t- 5: " + totalResults[5] + "\n" +
        "\t\t- 6: " + totalResults[6] + "\n" +
        "\t\t- 7: " + totalResults[7] + "\n" +  
        "\t- Payout: [" + totalPayout + "]\n" +
        "\t\t- 0: " + totalPayout[0] + "\n" +
        "\t\t- 1: " + totalPayout[1] + "\n" +
        "\t\t- 2: " + totalPayout[2] + "\n" +
        "\t\t- 3: " + totalPayout[3] + "\n" +
        "\t\t- 4: " + totalPayout[4] + "\n" +
        "\t\t- 5: " + totalPayout[5] + "\n" +
        "\t\t- 6: " + totalPayout[6] + "\n" +
        "\t\t- 7: " + totalPayout[7] + "\n" +  
        "Average: \n" + 
        "\t- Results: [" + avgResult + "]\n" +
        "\t\t- 0: " + avgResult[0] + "\n" +
        "\t\t- 1: " + avgResult[1] + "\n" +
        "\t\t- 2: " + avgResult[2] + "\n" +
        "\t\t- 3: " + avgResult[3] + "\n" +
        "\t\t- 4: " + avgResult[4] + "\n" +
        "\t\t- 5: " + avgResult[5] + "\n" +
        "\t\t- 6: " + avgResult[6] + "\n" +
        "\t\t- 7: " + avgResult[7] + "\n" + 
        "\t- Payout: [" + avgPayout + "]\n" +
        "\t\t- 0: " + avgPayout[0] + "\n" +
        "\t\t- 1: " + avgPayout[1] + "\n" +
        "\t\t- 2: " + avgPayout[2] + "\n" +
        "\t\t- 3: " + avgPayout[3] + "\n" +
        "\t\t- 4: " + avgPayout[4] + "\n" +
        "\t\t- 5: " + avgPayout[5] + "\n" +
        "\t\t- 6: " + avgPayout[6] + "\n" +
        "\t\t- 7: " + avgPayout[7] + "\n";

    console.debug("Totals: \nResult: [" + totalResults + "]\nPayout: [" + totalPayout + "]");
}

function getPayout(sum) {
    switch (sum) {
        case 6:
            return 10000;
        case 7:
        case 19:
            return 36;
        case 8:
            return 720;
        case 9:
            return 360;
        case 10:
            return 80;
        case 11:
            return 252;
        case 12:
            return 108;
        case 13:
        case 16:
            return 72;
        case 14:
            return 54;
        case 15:
        case 17:
            return 180;
        case 18:
            return 119;
        case 20:
            return 306;
        case 21:
            return 1080;
        case 22:
            return 144;
        case 23:
            return 1800;
        case 24:
            return 3600;
    }
}

function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;
  
    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function showStatus(status) {
    stateLabel = document.getElementById("status");
    stateLabel.innerHTML = status;
}