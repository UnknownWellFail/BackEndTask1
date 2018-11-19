const express = require('express');
const Request = require('request');

const router = express.Router();

/* POST request*/
router.post('/', function (req, res) {
  let startTime = new Date().getTime();
  Request.get('https://jsonplaceholder.typicode.com/comments', (error, response, body) => {
    if (error) {
      res.send(error.message);
      return console.dir(error.message);
    }
    const data = JSON.parse(body);
    res.send({
      popularAuthor: getMaxComments(data),
      popularWords: getTopWords(data, 5),
      executionTime: new Date().getTime() - startTime
    });
  });
});

/**
 * Generate array as {key:key, value:value} from array
 * This method counts the  number of keys in data array
 * @param key - key in needed array
 * @param value - name of param in returned array
 * @param array - data array
 * @param indexKey - used or not key in comparing data
 * @returns {Array}
 */
generateObjArray = (key, value, array, indexKey) => {
  const result = [];
  let index;
  for (msg of array) {
    if (indexKey)
      index = result.findIndex(mssg => mssg[key] === msg[key]);
    else
      index = result.findIndex(mssg => mssg[key] === msg);
    if (index !== -1) {
      result[index][value] += 1;
    } else {
      if (indexKey)
        result[result.length] = {[key]: msg[key], [value]: 1};
      else
        result[result.length] = {[key]: msg, [value]: 1};
    }
  }
  return result;
};

/**
 * Converts comments array to array with all words from body of comment
 * @param array - comments data array
 * @returns Words {Array}
 */
getWordsFromDataBody = (array) => {
  let words = [];
  for (msg of array) {
    words = words.concat(msg.body.split(/\W/).filter(String));
  }
  return words;
};


/**
 * Getting max vaule of comments from one author
 * @param arr - comments data array
 * @returns object as {email:'',comments:''}
 */
getMaxComments = (arr) => {
  const array = generateObjArray('email', 'count', arr, true);
  const max = {email: array[0].email, comments: array[0].count};
  for (item of array) {
    if (item.count > max.count) {
      max.popularAuthor.comments = item.count;
      max.popularAuthor.email = item.email;
    }
  }
  return max;
};

/**
 * Getting top @limit words from comments data array
 * @param arr - array of comments
 * @param limit - required number of values
 * @returns array as {word: number of words}
 */
getTopWords = (arr, limit) => {
  const words = getWordsFromDataBody(arr);
  let res = generateObjArray('word', 'count', words, false);

  //Sorting and shaping output
  res.sort((a, b) => {
    if (a.count < b.count) return 1;
    if (a.count > b.count) return -1;
  });
  res = res.slice(0, limit);

  const result = {};
  for (item of res) {
    result[item.word] = item.count;
  }
  return result;
};

module.exports = router;
