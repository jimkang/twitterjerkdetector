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
    screen_name: 'haarrryp',
    description: 'all about Harry Potter'
  },
  '111': {
    name: 'Tolkien Quotes',
    screen_name: 'tolkiensquotes',
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
  },
  '121': {
    name: 'proverbseveryday',
    screen_name: 'proverbs98',
    description: 'everyday wisdom'
  },
  '122': {
    name: 'Aquarius Zodiac',
    screen_name: 'aqquarrius',
    description: 'trust me, i am aquarius'
  },
  '123': {
    name: 'Katy Perry',
    screen_name: 'SpainKPerryFans',
    description: 'Twitter oficial de @katyperry en España.'
  },
  '124': {
    name: 'AWESOME!',
    screen_name: 'AwesomeFact5',
    description: 'Do you know this? We are here for make your timeline 100% better. Follow us for learn more and more!'
  },
  '125': {
    name: 'Will Smith',
    screen_name: 'WillSmithPage',
    description: 'Here to inspire you. *Parody* In no way affiliated with the actor Will Smith.'
  },
  '126': {
    name: 'New Mindset',
    screen_name: 'Mindset_New',
    description: 'Download Hypnosis & Subliminal MP3s - For FREE, link below  '
  },
  '127': {
    name: 'Buddha',
    screen_name: 'buddha937',
    description: 'Siddhartha Gautama    '
  },
  '128': {
    name: 'Self-Esteem',
    screen_name: '95SelfEsteem',
    description: ''
  },
  '129': {
    name: 'Hobbit',
    screen_name: 'hobbitnew',
    description: 'In a hole in the ground there lived a hobbit.    '
  },
  '130': {
    name: 'Dixit Baiju',
    screen_name: 'seodixitbaiju',
    description: 'SEO, SOCIALMEDIA, SEM Experts use ethical SEO, effective & proven SEO methods to attain #top 10 SEO rankings in Google.http://goo.gl/sQ0XY     '
  },
  '131': {
    name: 'ã¿ãã»@ç¸äºãã',
    screen_name: 'mikuho_811',
    description: ''
  },
  '132': {
    name: 'Close By Events',
    screen_name: 'closebyevents',
    description: 'COMING SOON! Post and search for events near you using geolocation technology. Follow us, It\'s FREE.    '
  },
  '133': {
    name: 'TheYumYumFoodie',
    screen_name: 'TheYumYumFoodie',
    description: 'I\'m #TVHost #Influencer @EddieZamora I unbiasedly discuss #Food #Wine #Spirits #Coffee n #travel My tweets are my own. https://www.instagram.com/theyumyumfoodie     '
  },
  '134': {
    name: 'Tariq Aziz',
    screen_name: 'iTariqAziz',
    description: 'Follow me ,i follow u back    '
  },
  '135': {
    name: 'Maroon5 Lyric',
    screen_name: 'maaarroon5',
    description: 'wanna read all lyrics of Maroon5??    '
  },
  '136': {
    name: 'Confucius',
    screen_name: 'ConfuciusQts',
    description: 'The will to win, the desire to succeed, the urge to reach ur full potential. these are the keys that unlock the door to personal excellence.    '
  },
  '137': {
    name: 'Best Video Gaming',
    screen_name: 'BestVideoGaming',
    description: 'Check it out! Instagram: http://instagram.com/bestvideogaming     '
  },
  '138': {
    name: 'Very Short Story',
    screen_name: 'StoryFestivals',
    description: 'FREE Deadline April 10th. Submit your 140 character story and have it performed by a professional actor.'
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

  filter(Object.keys(profilesForUserIds), function done(error, goodIds) {
    t.ok(!error, 'Doesn\'t return an error');
    t.deepEqual(goodIds, ['102', '103', '105'], 'Proper ids returned after filter.');
  });
});
