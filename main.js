const { dir } = require("console");
let fs = require("fs");
const { dirname } = require("path");
let path = require("path");

let inputArr = process.argv.slice(2); // 01 index is node installed path, 02 index is file location or path
console.log(inputArr);
let command = inputArr[0];
let dirPath = inputArr.splice(1).join(" ");

let types = {
    videos: ["mp4", "mkv"],
    images: ["jpeg", "jpg", "fig", "pmg", "svg"],
    archives: ["zip", "7z", "rar", "tar", "gz", "ar", "iso", "xz"],
    documents: ["docx", "doc", "pdf", "xlsv", "xls", "odt", "ods", "odp", "odg", "odf", "txt", "m"],
    apps: ["exe", "dmg", "pkg", "deb", "msi"]

}

switch (command) {
    case "tree":
        treeFn(dirPath);
        break;
    case "organize":
        organizeFn(dirPath);
        break;
    case "help":
        helpFn();
        break;
    default:
        console.log("Please 🙏 Input Valid Command");
}

function treeFn(dirPath) {
    if (dirPath == undefined) {
        console.log("Kindly enter the path");
        return;
    } else {
        if (fs.existsSync(dirPath)) {
            treeHelper(dirPath, "");
        } else {
            console.log("kindly enter the correct path");
            return;
        }
    }
}

function treeHelper(dirpath, indent){
    let isFile = fs.lstatSync(dirpath).isFile();
    if(isFile){
        let fileName = path.basename(dirpath);
        console.log(indent , "___", fileName);
    }else{
        let dirName = path.basename(dirpath);
        console.log(indent, "|___", dirName);
        let children = fs.readdirSync(dirpath);
        for(let i = 0; i < children.length; i++){
            let childPath = path.join(dirpath, children[i]);
            treeHelper(childPath, indent+ "\t");
        }
    }

}

function organizeFn(dirPath) {
    // console.log("Organize command implemented for ", dirPath);
    // 1. input -> directory path given
    // 2. create -> organised files -> directory
    // 3. Identify categories of all the files present in the input directory -> 
    // 4. copy/cut files to that organised directory inside of any of category folder
    let destPath;
    if (dirPath == undefined) {
        console.log("kindly enter the path");
        return;
    } else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist == true) {
            // 2. create -> organize files -> directory
            destPath = path.join(dirPath, "organized_files");
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath);
            }
        } else {
            console.log("Kindly enter the correct path");
            return;
        }
    }

    organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
    // identify categories of all the files present in the input directory ->
    // Q -> How to check variable type?
    // Q -> How to identify categories of the file
    // Q -> how to find whether the extension belongs to image, videos or documents group.
    // Td -> check Whether that type of directory is present in the dest directory
    // Q -> How to cut and paste a file from one directory to another
    let childNames = fs.readdirSync(src);
    // console.log(childNames);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            let ct = getCategory(childNames[i]);
            // console.log(childNames[i], "belongs to -->", ct);
            sendFiles(childAddress, dest, ct);
        }
    }
}

function getCategory(childName) {
    let ext = path.extname(childName).slice(1);
    // console.log(ext);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }

    }
    return "others";
}

function sendFiles(childAddress, dest, category) {
    // making the category path
    let categoryPath = path.join(dest, category);
    if (!fs.existsSync(categoryPath)) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(childAddress);
    let fileNamePath = path.join(categoryPath, fileName);
    // fs.copyFileSync(childAddress, fileNamePath);
    console.log(fileName, "is copied succesfully to", category);
    // fs.unlinkSync(childAddress);
    fs.unlinkSync(childAddress);
}

function helpFn() {
    console.log(`
    List of all the commands:
        Node main.js tree "Directory Path"
        Node main.js organize "Directory Path"
        Node main.js help
    ` );
}