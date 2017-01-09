const fs = require("fs");
const cheerio = require('cheerio');
const lodash = require('lodash');
const jsonfile = require('jsonfile');

/**
 * Files name list in some folder
 * @return {Array}
 */
function getFilesname () {
  // 仅读取 .svg 文件
  return lodash.filter(fs.readdirSync('svg'), (file) => {
    return /.svg$/.test(file)
  });
}

/**
 * Parse file, get path node in svg xml, return paths
 * @param  {String} fileName
 * @return {Array}
 */
function parseFile (fileName) {
  let paths = [];

  let html = fs.readFileSync(`svg/${fileName}`, 'utf8')
  let $ = cheerio.load(html)
  $('svg > path').each((index, element) => {
    let path = {};
    path.d = $(element).attr('d');
    paths.push(path)
  });

  return paths;
}

/**
 * Write json to file
 * @param {String} fileName
 * @param {Object} json
 */
function writeFile (fileName, json) {
  jsonfile.writeFileSync(`dist/sperate/${fileName}.json`, json, { spaces: 2 });
}

/**
 * Remove file name `.svg` suffix
 * @param  {String} fileName
 * @return {String}
 */
function getFileTitle (fileName) {
  return fileName.slice(0, fileName.indexOf('.svg'));
}

/**
 * Handle svg file to write json
 */
function handleSvgFile () {
  const files = getFilesname()

  files.forEach(fileName => {
    const title = getFileTitle(fileName)
    const json = {
      name: title,
      viewBox: '0 0 32 32',
      paths: parseFile(fileName)
    }
    writeFile(title, json)
  })
}

handleSvgFile()
