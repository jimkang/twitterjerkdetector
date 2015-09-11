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

    userIds.forEach(function queueFilter(userId) {
      q.defer(filterJerkAccount, userId);
    });
    q.awaitAll(function accountsChecked(error, results) {
      if (error) {
        done(error);
      }
      else {
        done(null, _.compact(results));
      }    
    });
  }

  function filterJerkAccount(userId, done)  {
    if (blacklist.indexOf(userId) !== -1) {
      // This is a blacklisted id.
      callNextTick(done);
      return;
    }
    twit.get(
      'users/show',
      {
        user_id: userId
      },
      function checkProfile(error, result) {
        var nonSpamUserId;
        // Left undefined if userId corresponds to a spam account.

        if (error) {
          console.log('Error for ', userId, ':', error);
        }
        else if (typeof result.description === 'string') {

          var profile = '';

          if (result.description) {
            profile = result.description.toLowerCase();;
          }
          var username = '';
          if (result.screen_name) {
            username = result.screen_name.toLowerCase();;
          }
          var name = '';
          if (result.name) {
            name = result.name.toLowerCase();
          }

          if (followerRatioLooksHuman(
              result.friends_count, result.followers_count
            ) &&
            jerkProfileKeywords.every(userIsFreeOfJerkKeyword)) {

            nonSpamUserId = userId;
          }
          else {
            console.log('Filtering user as spam:', userId);
          }
        }

        done(error, nonSpamUserId);

        function userIsFreeOfJerkKeyword(keyword) {
          return username.indexOf(keyword) === -1 &&
            name.indexOf(keyword) === -1 &&
            profile.indexOf(keyword) === -1;
        }
      }
    );
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

module.exports = {
  createFilter: createFilter
};
