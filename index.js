/**
 * Created by Gan on 2017/11/9.
 */
const Promise = require('bluebird');
const fileDownloader = require('./downloader');
const filesToDownload = require('./files_to_download');
const unZip = require('./unzip');

fileDownloader.prepareDownload();

let downloaders = [];
for(let i = 0; i < filesToDownload.length; i++) {
    downloaders.push(fileDownloader.downloader(filesToDownload[i]));
}

if(downloaders.length > 0) {
    Promise.all(downloaders).then( files => {
        console.log(`All files downloaded successfully!`);
        console.log(files);
        files.forEach( file => {
            unZip(file)
                .then( (data) => {
                    console.log(`${data.file} extract done! Location: ${data.location}`);
                })
                .catch( err => {
                    console.log(err);
                })
        })
    })
}
