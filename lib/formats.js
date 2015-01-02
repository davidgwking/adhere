var utils = require('./common');
var ipRegex = require('ip-regex');

module.exports = {
  // email address
  email:  /^.+@.+\..+$/i,
  // regex
  regex: {
    test: function (str) {
      try {
        new RegExp(str);
      }
      catch (e) {
        return false;
      }
      return true;
    }
  },
  // uuid
  uuid:   /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv1: /^[a-f0-9]{8}-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv2: /^[a-f0-9]{8}-[a-f0-9]{4}-2[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv3: /^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv4: /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv5: /^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  // ip address
  ip:   {
    test: function (str) {
      return ipRegex({exact: true}).test(str);
    }
  },
  ipv4: {
    test: function (str) {
      return ipRegex.v4({exact: true}).test(str);
    }
  },
  ipv6: {
    test: function (str) {
      return ipRegex.v6({exact: true}).test(str);
    }
  },
  // iso8601 date-time
  time: /^[01][0-9]|2[0-3](?:\:[01235][0-9]){2}?:\.\d{1,3}Z$/, // hh:mm:ss[.ddd]Z
  date: { // YYYY-MM-DD
    test: function (str) {
      var dateFmt = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      return testIso8601DateFormat(dateFmt, str);
    }
  },
  'date-time': { // YYYY-MM-DDThh:mm:ss[.ddd]Z
    test: function (str) {
      var dateTimeFmt = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3])(?:\:[01235][0-9]){2}(?:\.\d{1,3})?Z$/;
      return testIso8601DateFormat(dateTimeFmt, str);
    }
  }
};

// accepts a pattern that is expected to capture at least year, month, and day (in that order)
function testIso8601DateFormat(pattern, str) {
  // reset regexp position in case it has 'g' modifier
  utils.resetRegExp(pattern);

  var isMatch = pattern.exec(str);
  if (!isMatch) return false;
  var captured = isMatch.slice(1);

  var isLeapYear = captured[0] % 4 === 0;
  // potential leap years divisible by 100 must be divisible by 400 to be an actual leap year
  if (isLeapYear && captured[0] % 100 === 0) isLeapYear = captured[0] % 400 === 0;

  // ensure days in month are not exceeded
  var daysInMonth = {
    '01': 31,
    '02': isLeapYear ? 29 : 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31
  };

  return captured[2] <= daysInMonth[captured[1]] ? true : false;
}
