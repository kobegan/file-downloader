/**
 * Created by Gan on 2017/11/9.
 */
const unzip = require('unzip');
const path = require('path');
const fs = require('fs');
const Promise = require('bluebird');

let pathToUnzip = path.join(__dirname, 'bin');   //默认安装路径，当前目录bin

prepareUnzip();

function prepareUnzip() {
    if(process.argv.length > 2) {
        pathToUnzip = process.argv.slice(2).join("");
        if(!path.isAbsolute(pathToUnzip)) {
            pathToUnzip = path.join(__dirname, pathToUnzip);
        }
    }

    try {
        fs.accessSync(pathToUnzip)
    } catch (err) {
        if(err) {
            console.log(err.message);
            fs.mkdir(pathToUnzip, err => {
                if(err) {
                    console.log(err);
                    throw err;
                }
            });
        }
    }
}

function unZip(file) {
    try {
        fs.accessSync(file)
    } catch (err) {
        reject(err);
    }
    return new Promise( (resolve, reject) => {
        const unzipExtract = unzip.Extract({ path: pathToUnzip });

        fs.createReadStream(file).pipe(unzipExtract);
        unzipExtract.on('error', err => {
            reject(err);
        });

        unzipExtract.on('close', () => {
            let arr = file.split(path.sep);
            resolve({
                file: arr[arr.length-1],
                location: pathToUnzip
            });
        });
    } );
}

module.exports = unZip;