import * as fs from "fs";
import multer from "multer";
import csv from "csvtojson";
import { parse } from "json2csv";
import feedback from "./feedbackSchema.mjs";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(xlsx|csv)$/)) {
      return cb(new Error("Please upload an excel file"));
    } else {
      cb(null, true);
    }
  },
});

async function uploadFile(req, res) {
  try {
    res.send(req.file);
  } catch (error) {
    console.log(error);
    res.send("Please send an excel file (csv or xlsx)");
  }
  console.log(req.file.path);
  findFileCSV(req.file.path);
  return req.file.path;
}

async function findFile(filePath, req, res) {
  let workbook = XLSX.readFile(filePath);
  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  res.send(worksheet);
  return worksheet;
}

//Finding the file
async function findFileCSV(filePath) {
  csv()
    .fromFile(filePath)
    .then(function (jsonArrayObj) {
      console.log(jsonArrayObj);
    });
  const jsonArray = await csv().fromFile(filePath);
  findEntries(jsonArray);
  return jsonArray;
}

//Finding entries in the mongoDB databas
async function findEntries(jsonArray) {
  let arr = [];
  for (let i = 0; i < jsonArray.length; i++) {
    let individualId = Object.values(jsonArray[i]);
    if (await feedback.exists({ _id: individualId })) {
      let info = await feedback.findById(individualId);
      arr.push(info);
    }
    console.log(arr);
  }
  writeEntriesToCSV(arr);
  return arr;
}

async function writeEntriesToCSV(entries) {
  let fieldsNew = ["id", "rating", "feedbackText"];
  const csv = parse(entries);
  let csvNew = parse(entries, { fields: fieldsNew });
  fs.writeFile("./feedbackInfo.csv", csvNew, function (err, result) {
    if (err) console.log("error", err);
  });
}

export { uploadFile, findFile, upload };
