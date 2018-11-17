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

        res.send({popularAuthor: getMaxComments(test), excetionTime: new Date().getTime() - startTime});
    });
});


getMaxComments = (arr) => {
    let tmp = [];
    let index = -1;
    arr.forEach((msg) => {
        index = tmp.findIndex(mssg => mssg.email === msg.email);
        if (index !== -1) {
            tmp[index].count += 1;
        } else {
            tmp[tmp.length] = {email: msg.email, count: 1};
        }
    });

    let max = {email: tmp[0].email, comments: tmp[0].count};

    tmp.forEach((item) => {
        if (item.count > max.count) {
            max.popularAuthor.comments = item.count;
            max.popularAuthor.email = item.email;
        }
    });
    return max;
};


module.exports = router;
