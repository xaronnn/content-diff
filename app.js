#!/usr/bin/env node

const yargs = require("yargs"),
fs = require("fs-extra");

const seperators = ["\n", "\r", ",", "|", ":", "_", "="];
const log = (text, type = null) => {
    type = (type ? type.toUpperCase() : type);
    switch(type) {
        case "INFO":
            console.log("[INFO] "+text);
        case "ERROR":
            console.log("[ERROR] "+text);
        default:
            console.log("[ERROR] "+text);
    }
}
const remove_array_value = (array, value) => {
    var index = array.indexOf(value);
    if (index >= 0) {
        array.splice(index, 1);
        reindex_array(array);
    }
}
const reindex_array = (array) => {
   var result = [];
    for (var key in array) {
        result.push(array[key]);
    }
    return result;
}
const clean_array = (array) => {
    for(var i = 0; i < array.length; ++i)
        array[i] = array[i].replace(/(\r\n|\n|\r)/gm,"")
    
    return array;
}
const options = yargs
 .usage("Usage: -m <./main.txt> -c <./current.txt> -d <./destination.txt> -f <seperator main & current> -g <seperator dest>")
 .option("m", { alias: "main", describe: "Main File", type: "string", demandOption: true })
 .option("c", { alias: "current", describe: "Current File", type: "string", demandOption: true })
 .option("d", { alias: "destination", describe: "Destination File", type: "string", demandOption: true })
 .option("f", { alias: "seperatorMain", describe: "Seperator for Main and Current File", type: "string", demandOption: true })
 .option("g", { alias: "seperatorDestination", describe: "Seperator for Destination File", type: "string", demandOption: true })
 .argv;

if(!fs.existsSync(options.main)) {
    log("File "+options.main+" not found")
} else if(!fs.existsSync(options.current)) {
    log("File "+options.main+" not found")
} else if(options.main == options.current) {
    log("Main and Current file should be different.")
} else if(options.main == options.destination || options.current == options.destination) {
    log("Destination file should be different.")
} else if(!seperators.includes(options.seperatorMain) || !seperators.includes(options.seperatorDestination)) {
    log("Invalid main seperator. Must be one of them: "+seperators)
} else {
    log("Please wait..")
    let mainFile = options.main;
    mainFile = fs.readFileSync(mainFile, "utf8").split(options.seperatorMain)
    mainFile = clean_array(mainFile);
    let currentFile = options.current;
    currentFile = fs.readFileSync(currentFile, "utf8").split(options.seperatorMain)

    currentFile.forEach((k, v) => {
        remove_array_value(mainFile, k);
    });

    let tempData = "";
    mainFile.forEach((k) => {
        tempData += k+options.seperatorDestination;
    });

    try {
        fs.unlinkSync(options.destination)
    } catch(err) {}
    setTimeout(() => {
        fs.writeFileSync(options.destination, tempData, "utf8");
        log("File successfully seperated and created as named "+options.destination)
    }, 1500);
}