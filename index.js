var queue = require('queue-async');
var _ = require('lodash');
var jsonfile = require('jsonfile');

function createFilter(opts) {
  var twit = opts.twit;
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
          var profile = result.description.toLowerCase();
          function profileIsFreeOfJerkKeyword(keyword) {
            return profile.indexOf(keyword) === -1;
          }

          if (jerkProfileKeywords.every(profileIsFreeOfJerkKeyword)) {
            nonSpamUserId = userId;
          }
          else {
            console.log('Filtering user as spam:', userId);
          }
        }

        done(error, nonSpamUserId);
      }
    );
  }

  return filterJerkAccounts;
}

module.exports = {
  createFilter: createFilter
};
