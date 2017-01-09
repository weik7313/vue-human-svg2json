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
 * Remove file name `.svg` suffix
 * @param  {String} fileName
 * @return {String}
 */
function getFileTitle (fileName) {
  return fileName.slice(0, fileName.indexOf('.svg'));
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
 * Get icons json
 * @return {Object}
 */
function getIconsJson () {
  let icons = {};

  files = getFilesname();

  files.forEach((file) => {
    icons[getFileTitle(file)] = {
      viewBox: '0 0 32 32',
      paths: parseFile(file)
    }
  })

  return icons;
}

/**
 * Write json to file
 * @return {String}
 */
function writeFile () {
  let icons = getIconsJson();
  jsonfile.writeFileSync('dist/icons.json', icons, { spaces: 2 });

  return 'Success! icons.json';
}

console.log(writeFile());
