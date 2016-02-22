var _ = require('lodash');
var jsonfile = require('jsonfile');
var callNextTick = require('call-next-tick');
var jerkProfileKeywords = jsonfile.readFileSync(
  __dirname + '/data/jerk-profile-keywords.json'
);

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

  function filterJerkAccounts(userIds, done) {
    var nonBlacklisted = _.without.apply(
      _.without, [userIds].concat(blacklist)
    );

    if (userIds.length > 1500) {
      console.log(
        'Warning: There were more than 1500 userIds passed to filterJerkAccounts.'
      );
      userIds = userIds.slice(0, 1500);
    }

    var reports = [];
    if (userIds.length > 0) {
      filterNextBatch();
    }

    function filterNextBatch() {
      var nextBatch = userIds.slice(0, 100);
      userIds.splice(0, 100);

      var lookupOpts = {
        user_id: nextBatch.join(','),
        include_entities: false
      };
      twit.post('users/lookup', lookupOpts, runFilterOnUserObjects);
    }

    function runFilterOnUserObjects(error, users) {
      if (error) {
        done(error);
      }
      else {
        reports = reports.concat(users.map(filterJerkAccount));
        if (userIds.length > 0) {
          callNextTick(filterNextBatch);
        }
        else {
          sortAndFinish();
        }
      }
    }

    function sortAndFinish() {
      var sortedReports = {
        jerks: blacklist
      };
      if (reports) {
        sortedReports = splitReportsIntoUserIdsByJerkiness(reports);
        sortedReports.jerks = sortedReports.jerks.concat(blacklist);
      }
      done(null, sortedReports);
    }
  }

  return filterJerkAccounts;
}

function filterJerkAccount(user)  {
  var report = {
    userId: user.id_str,
    isJerk: true
  };

  var profile = '';

  if (user.description) {
    profile = user.description.toLowerCase();
  }
  var username = '';
  if (user.screen_name) {
    username = user.screen_name.toLowerCase();
  }
  var name = '';
  if (user.name) {
    name = user.name.toLowerCase();
  }

  if (followerRatioLooksHuman(
      user.friends_count, user.followers_count
    ) &&
    jerkProfileKeywords.every(userIsFreeOfJerkKeyword)) {

    report.isJerk = false;
  }
  else {
    console.log('Filtering user as spam:', report.userId);
  }

  return report;

  function userIsFreeOfJerkKeyword(keyword) {
    return username.indexOf(keyword) === -1 &&
      name.indexOf(keyword) === -1 &&
      profile.indexOf(keyword) === -1;
  }
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
