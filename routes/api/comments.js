let express = require('express');
let Request = require("request");
let router = express.Router();

/* POST*/
router.post('/', function (req, res) {
    let startTime = new Date().getTime();
    Request.get("https://jsonplaceholder.typicode.com/comments", (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        let test = JSON.parse(body);
        res.send({
            popularAuthor: getMaxComments(test),
            popularWords: getTopWords(test),
            excetionTime: new Date().getTime() - startTime
        });
    });
});


function getMaxComments(arr) {
    let tmp = [];
    let index;
    for (msg of arr) {
        index = tmp.findIndex(mssg => mssg.email === msg.email);
        if (index !== -1) {
            tmp[index].count += 1;
        } else {
            tmp[tmp.length] = {email: msg.email, count: 1};
        }
    }
    let max = {email: tmp[0].email, comments: tmp[0].count};
    for (item of tmp) {
        if (item.count > max.count) {
            max.popularAuthor.comments = item.count;
            max.popularAuthor.email = item.email;
        }
    }
    return max;
}

function getTopWords(arr) {
    let words = [];
    for (msg of arr) {
        words = words.concat(msg.body.split(/\W/).filter(String));
    }
    let res = [];
    let index;
    for (word of words) {
        index = res.findIndex(w => w.word === word);
        if (index !== -1) {
            res[index].count += 1;
        } else {
            res[res.length] = {word: word, count: 1};
        }
    }
    res.sort((a, b) => {
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
    });
    res = res.slice(0, 5);
    let result = {};
    for (item of res) {
        result[item.word] = item.count;
    }
    return result;
}


module.exports = router;
