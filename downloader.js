/**
 * Created by Gan on 2017/11/9.
 */
const fs = require('fs');
const request = require('request');
const Promise = require('bluebird');
const path = require('path');

let pathToDownload = path.join(__dirname, 'tmp');   //默认下载路径，当前目录tmp

function prepareDownload() {
    try {
        fs.accessSync(pathToDownload)
    } catch (err) {
        if(err) {
            console.log(err.message);
            fs.mkdir(pathToDownload, err => {
                if(err) {
                    console.log(err);
                    process.exit();
                }
            });
        }
    }
}

function downloader(fileToDownload) {
    return new Promise( (resolve, reject) => {
        let filename = path.join(pathToDownload,  fileToDownload.name);
            link = fileToDownload.link;
        if(link && typeof link == 'string') {
            let writeStream = fs.createWriteStream(filename);

            writeStream.on('close', () => {
                resolve(filename);
            });
            writeStream.on('error', () => {
                console.log(`${filename} downloaded error!`);
                reject(Error(`${filename} downloaded error!`));
            });
            request(link).pipe(writeStream)
        } else {
            reject(Error(`${filename} download link error!`));
        }
    });
}

module.exports = {
    prepareDownload,
    downloader
}


