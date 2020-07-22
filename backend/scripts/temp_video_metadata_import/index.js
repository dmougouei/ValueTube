const exec = require('child_process').exec;
const fs = require('fs');
var getSubtitles = require('youtube-captions-scraper').getSubtitles;
var scraper = require("youtube-comment-scraper");

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ callback(stdout); });
};

fs.readFile('../../data/temp_video_list.json', function read(err, data) {
    if (err) {
        throw err;
    }
    
    let content = JSON.parse(data);

    for (let i = 0; i < content.length; i++) {
        execute(`"../youtube-dl.exe" -j https://www.youtube.com/watch?v=` + content[i].id, function(videoMetadata){
            const metadata = JSON.parse(videoMetadata);
            
            content[i].metadata = metadata;

            /*getSubtitles({
                videoID: content[i].id,
            }).then(function(captions) {
                content[i].captions = captions;
            }).catch((error) => {
                console.error(error);
            });*/

            /*scraper.comments(`https://www.youtube.com/watch?v=` + content[i].id).then(function(comments) {
                // Printing the result.
                content[i].comments = comments;
               
                // Close scraper.
                scraper.close();
            });*/

            fs.writeFile('../../data/temp_video_list.json', JSON.stringify(content), function (err) {
                if (err) throw err;
                console.log('Sucessfully Updated Video Metadata');
            });
        });
    };
});