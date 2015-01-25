var test = require('tape');
var twitterjerkdetector = require('../index');
var conformAsync = require('conform-async');

var profilesForUserIds = {
  '100': {
    description: '5000 twitter followers or-- 1500 facebook fans or 3k instagram follows'
  },
  '101': {
    description: ' Hate women but wont to touch one someday #gamergate all the way'
  },
  '102': {
    description: 'Regular person with some hobbies.'
  },
  '103': {
    description: 'Boring guy who works at some company'
  },
  '104': {
    description: 'Gurantied #followback'
  },
  '105': {
    description: 'butts'
  },
  '106': {
    description: 'grumpy cat parody account. Stealin\` from Kate Beaton'
  }
};

test('Basic test', function basicTest(t) {
  t.plan(2);

  var filter = twitterjerkdetector.createFilter({
    twit: {
      get: function mockGet(path, opts, done) {
        var profile;

        if (path === 'users/show') {
          profile = profilesForUserIds[opts.user_id];
        }

        if (!profile) {
          t.fail('Unexpected request sent to twit.');
        }

        conformAsync.callBackOnNextTick(done, null, profile);
      }
    }
  });

  filter([100, 101, 102, 103, 104, 105, 106], function done(error, goodIds) {
    t.ok(!error, 'Doesn\'t return an error');
    t.deepEqual(goodIds, [102, 103, 105], 'Proper ids returned after filter.');
  });
});
