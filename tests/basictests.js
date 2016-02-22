var test = require('tape');
var twitterjerkdetector = require('../index');
var callNextTick = require('call-next-tick');
var _ = require('lodash');

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
  },
  '107': {
    name: "Rumi quotes",
    screen_name: "ruumi_quotes",
    description: "Nothing offensive"
  },
  '108': {
    name: 'WOW FACTS',
    screen_name: 'wow_facts_wow',
    description: ''
  },
  '109': {
    screen_name: 'mindoffataurus',
    description: 'These facts will make your life better'
  },
  '110': {
    name: 'Harry Pottter',
    screen_name: '@haarrryp',
    description: 'all about Harry Potter'
  },
  '111': {
    name: 'Tolkien Quotes',
    screen_name: '@tolkiensquotes',
    description: ''
  },
  '112': {
    name: 'Minion_Best Quotes',
    screen_name: 'bstminionquotes',
    description: 'Don\' judge me. I was born to be awesome, not perfect.'
  },
  '113': {
    name: 'Laura Dern Daily',
    screen_name: 'LauraDernWW',
    description: 'Be sure to follow for all the best and most current photos, events and other updates of Laura Dern'
  },
  '114': {
    name: 'Paula Sheets',
    screen_name: 'PaulaSheets24',
    description: 'Baconaholic. Pop culture buff. Professional alcohol junkie. Certified creator. Find out how I got over 500 Facebook Fans in 2 Days!!'
  },
  '115': {
    name: 'Dwarf Fortress News',
    screen_name: 'uyo_359',
    description: 'We use our original curation technology to create the hottest timeline all about Dwarf Fortress. We also follow you back 100% guaranteed! #followback #refollow'
  },
  '116': {
    name: 'About Your Beauty',
    screen_name: 'AbouttBeauty',
    description: 'Looking for skin, makeup, hair, or nail care tips?'
  },
  '117': {
    name: 'ONSUBWAY',
    screen_name: 'onsubwayworld',
    description: 'Your daily inspiration.'
  },
  '118': {
    name: 'ShareYour69.com',
    screen_name: 'ShareYour69',
    description: 'Leading monthly subscription for underwear and panties as well as hilarious daily pics and facts about the famous number 69.'
  },
  '119': {
    name: 'Game of Thrones',
    screen_name: 'Game_0fThrones',
    description: 'Best daily game of thrones quotes. Read and enjoy.'
  },
  '120': {
    name: 'Health Tips Daily',
    screen_name: 'HeaIthTipDaily',
    description: 'Daily health tips to motivate you to change your life. Hard bodies come from hard work.'
  }
};

test('Basic test', function basicTest(t) {
  t.plan(2);

  var filter = twitterjerkdetector.createFilter({
    twit: {
      post: function mockPost(path, opts, done) {
        var profiles;

        if (path === 'users/lookup') {
          debugger;
          profiles = _.values(_.pick(profilesForUserIds, opts.user_id.split(',')));
        }

        if (!profiles) {
          t.fail('Unexpected request sent to twit.');
        }

        callNextTick(done, null, profiles);
      }
    }
  });

  filter(Object.keys(profilesForUserIds), function done(error, goodIds) {
    t.ok(!error, 'Doesn\'t return an error');
    t.deepEqual(goodIds, ['102', '103', '105'], 'Proper ids returned after filter.');
  });
});
