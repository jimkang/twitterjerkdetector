var queue = require('queue-async');
var _ = require('lodash');
var jsonfile = require('jsonfile');
var callNextTick = require('call-next-tick');

function createFilter(opts) {
  var twit;
  var blacklist;

  if (opts) {
    twit = opts.twit;
    blacklist = opts.blacklist;
  }
  if (!blacklist) {
    blacklist = [];
  }

  var jerkProfileKeywords = jsonfile.readFileSync(
    __dirname + '/data/jerk-profile-keywords.json'
  );

  function filterJerkAccounts(userIds, done) {
    var q = queue();

    userIds.forEach(queueFilter);
    q.awaitAll(collateReports);

    function queueFilter(userId) {
      q.defer(filterJerkAccount, userId);
    }

    function collateReports(error, reports) {
      if (error) {
        done(error);
      }
      else {
        done(null, splitReportsIntoUserIdsByJerkiness(reports));
      }
    }
  }

  function filterJerkAccount(userId, done)  {
    var report = {
      userId: userId,
      isJerk: true
    };

    if (blacklist.indexOf(userId) !== -1) {
      // This is a blacklisted id.
      callNextTick(done, null, report);
      return;
    }

    var getParams = {
      user_id: userId
    };

    twit.get('users/show', getParams, checkProfile);

    function checkProfile(error, result) {
      if (error) {
        done(error);
        return;
      }
      else if (typeof result.description === 'string') {
        var profile = '';

        if (result.description) {
          profile = result.description.toLowerCase();
        }
        var username = '';
        if (result.screen_name) {
          username = result.screen_name.toLowerCase();
        }
        var name = '';
        if (result.name) {
          name = result.name.toLowerCase();
        }

        if (followerRatioLooksHuman(
            result.friends_count, result.followers_count
          ) &&
          jerkProfileKeywords.every(userIsFreeOfJerkKeyword)) {

          report.isJerk = false;
        }
        else {
          console.log('Filtering user as spam:', userId);
        }
      }

      done(error, report);

      function userIsFreeOfJerkKeyword(keyword) {
        return username.indexOf(keyword) === -1 &&
          name.indexOf(keyword) === -1 &&
          profile.indexOf(keyword) === -1;
      }
    }
  }

  return filterJerkAccounts;
}

function followerRatioLooksHuman(following, followedBy) {
  if (following < 50) {
    return true;
  }
  if (followedBy / following > 0.6) {
    return true;
  }
  return false;
}

function splitReportsIntoUserIdsByJerkiness(reports) {
  var jerks = [];
  var coolguys = [];
  reports.forEach(sortIdIntoBucket);

  function sortIdIntoBucket(report) {
    var bucket = coolguys;
    if (report.isJerk) {
      bucket = jerks;
    }

    bucket.push(report.userId);
  }

  return {
    coolguys: coolguys,
    jerks: jerks
  };
}

module.exports = {
  createFilter: createFilter
};
