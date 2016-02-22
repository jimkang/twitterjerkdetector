var test = require('tape');
var twitterjerkdetector = require('../index');
var callNextTick = require('call-next-tick');
var _ = require('lodash');

var profilesForUserIds = {
  '100': {
    description: '5000 twitter followers or-- 1500 facebook fans or 3k instagram follows',
    "followers_count": 500,
    "friends_count": 500
  },
  '101': {
    description: ' Hate women but wont to touch one someday #gamergate all the way',
    "followers_count": 500,
    "friends_count": 500
  },
  '102': {
    description: 'Regular person with some hobbies.',
    "followers_count": 500,
    "friends_count": 500
  },
  '103': {
    description: 'Boring guy who works at some company',
    "followers_count": 500,
    "friends_count": 500
  },
  '104': {
    description: 'Gurantied #followback',
    "followers_count": 500,
    "friends_count": 500
  },
  '105': {
    description: 'butts',
    "followers_count": 500,
    "friends_count": 500
  },
  '106': {
    description: 'grumpy cat parody account. Stealin\` from Kate Beaton',
    "followers_count": 500,
    "friends_count": 500
  },
  '107': {
    name: "Rumi quotes",
    screen_name: "ruumi_quotes",
    description: "Nothing offensive",
    "followers_count": 500,
    "friends_count": 500
  },
  '108': {
    name: 'WOW FACTS',
    screen_name: 'wow_facts_wow',
    description: '',
    "followers_count": 500,
    "friends_count": 500
  },
  '109': {
    screen_name: 'mindoffataurus',
    description: 'These facts will make your life better',
    "followers_count": 500,
    "friends_count": 500
  },
  '110': {
    name: 'Harry Pottter',
    screen_name: 'haarrryp',
    description: 'all about Harry Potter',
    "followers_count": 500,
    "friends_count": 500
  },
  '111': {
    name: 'Tolkien Quotes',
    screen_name: 'tolkiensquotes',
    description: '',
    "followers_count": 500,
    "friends_count": 500
  },
  '112': {
    name: 'Minion_Best Quotes',
    screen_name: 'bstminionquotes',
    description: 'Don\' judge me. I was born to be awesome, not perfect.',
    "followers_count": 500,
    "friends_count": 500
  },
  '113': {
    name: 'Laura Dern Daily',
    screen_name: 'LauraDernWW',
    description: 'Be sure to follow for all the best and most current photos, events and other updates of Laura Dern',
    "followers_count": 500,
    "friends_count": 500
  },
  '114': {
    name: 'Paula Sheets',
    screen_name: 'PaulaSheets24',
    description: 'Baconaholic. Pop culture buff. Professional alcohol junkie. Certified creator. Find out how I got over 500 Facebook Fans in 2 Days!!',
    "followers_count": 500,
    "friends_count": 500
  },
  '115': {
    name: 'Dwarf Fortress News',
    screen_name: 'uyo_359',
    description: 'We use our original curation technology to create the hottest timeline all about Dwarf Fortress. We also follow you back 100% guaranteed! #followback #refollow',
    "followers_count": 500,
    "friends_count": 500
  },
  '116': {
    name: 'About Your Beauty',
    screen_name: 'AbouttBeauty',
    description: 'Looking for skin, makeup, hair, or nail care tips?',
    "followers_count": 500,
    "friends_count": 500
  },
  '117': {
    name: 'ONSUBWAY',
    screen_name: 'onsubwayworld',
    description: 'Your daily inspiration.',
    "followers_count": 500,
    "friends_count": 500
  },
  '118': {
    name: 'ShareYour69.com',
    screen_name: 'ShareYour69',
    description: 'Leading monthly subscription for underwear and panties as well as hilarious daily pics and facts about the famous number 69.',
    "followers_count": 500,
    "friends_count": 500
  },
  '119': {
    name: 'Game of Thrones',
    screen_name: 'Game_0fThrones',
    description: 'Best daily game of thrones quotes. Read and enjoy.',
    "followers_count": 500,
    "friends_count": 500
  },
  '120': {
    name: 'Health Tips Daily',
    screen_name: 'HeaIthTipDaily',
    description: 'Daily health tips to motivate you to change your life. Hard bodies come from hard work.',
    "followers_count": 500,
    "friends_count": 500
  },
  '121': {
    name: 'proverbseveryday',
    screen_name: 'proverbs98',
    description: 'everyday wisdom',
    "followers_count": 500,
    "friends_count": 500
  },
  '122': {
    name: 'Aquarius Zodiac',
    screen_name: 'aqquarrius',
    description: 'trust me, i am aquarius',
    "followers_count": 500,
    "friends_count": 500
  },
  '123': {
    name: 'Katy Perry',
    screen_name: 'SpainKPerryFans',
    description: 'Twitter oficial de @katyperry en España.',
    "followers_count": 500,
    "friends_count": 500
  },
  '124': {
    name: 'AWESOME!',
    screen_name: 'AwesomeFact5',
    description: 'Do you know this? We are here for make your timeline 100% better. Follow us for learn more and more!',
    "followers_count": 500,
    "friends_count": 500
  },
  '125': {
    name: 'Will Smith',
    screen_name: 'WillSmithPage',
    description: 'Here to inspire you. *Parody* In no way affiliated with the actor Will Smith.',
    "followers_count": 500,
    "friends_count": 500
  },
  '126': {
    name: 'New Mindset',
    screen_name: 'Mindset_New',
    description: 'Download Hypnosis & Subliminal MP3s - For FREE, link below  ',
    "followers_count": 500,
    "friends_count": 500
  },
  '127': {
    name: 'Buddha',
    screen_name: 'buddha937',
    description: 'Siddhartha Gautama    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '128': {
    name: 'Self-Esteem',
    screen_name: '95SelfEsteem',
    description: '',
    "followers_count": 500,
    "friends_count": 500
  },
  '129': {
    name: 'Hobbit',
    screen_name: 'hobbitnew',
    description: 'In a hole in the ground there lived a hobbit.    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '130': {
    name: 'Dixit Baiju',
    screen_name: 'seodixitbaiju',
    description: 'SEO, SOCIALMEDIA, SEM Experts use ethical SEO, effective & proven SEO methods to attain #top 10 SEO rankings in Google.http://goo.gl/sQ0XY     ',
    "followers_count": 500,
    "friends_count": 500
  },
  '131': {
    name: 'ã¿ãã»@ç¸äºãã',
    screen_name: 'mikuho_811',
    description: '',
    "followers_count": 500,
    "friends_count": 500
  },
  '132': {
    name: 'Close By Events',
    screen_name: 'closebyevents',
    description: 'COMING SOON! Post and search for events near you using geolocation technology. Follow us, It\'s FREE.    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '133': {
    name: 'TheYumYumFoodie',
    screen_name: 'TheYumYumFoodie',
    description: 'I\'m #TVHost #Influencer @EddieZamora I unbiasedly discuss #Food #Wine #Spirits #Coffee n #travel My tweets are my own. https://www.instagram.com/theyumyumfoodie     ',
    "followers_count": 500,
    "friends_count": 500
  },
  '134': {
    name: 'Tariq Aziz',
    screen_name: 'iTariqAziz',
    description: 'Follow me ,i follow u back    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '135': {
    name: 'Maroon5 Lyric',
    screen_name: 'maaarroon5',
    description: 'wanna read all lyrics of Maroon5??    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '136': {
    name: 'Confucius',
    screen_name: 'ConfuciusQts',
    description: 'The will to win, the desire to succeed, the urge to reach ur full potential. these are the keys that unlock the door to personal excellence.    ',
    "followers_count": 500,
    "friends_count": 500
  },
  '137': {
    name: 'Best Video Gaming',
    screen_name: 'BestVideoGaming',
    description: 'Check it out! Instagram: http://instagram.com/bestvideogaming     ',
    "followers_count": 500,
    "friends_count": 500
  },
  '138': {
    name: 'Very Short Story',
    screen_name: 'StoryFestivals',
    description: 'FREE Deadline April 10th. Submit your 140 character story and have it performed by a professional actor.',
    "followers_count": 500,
    "friends_count": 500
  },
  '139': {
    name: 'UK Bump Keys Ltd',
    screen_name: 'ukbumpkeys',
    description: 'Ultra-Discount Lock Picking Tools. 10 years online supply with a great reputation for Quality, Service, Price.',
    "followers_count": 500,
    "friends_count": 500
  },
  '140': {
    "id": 337723416,
    "id_str": "337723416",
    "name": "Leslie Kloet",
    "screen_name": "LeslieKloet",
    "description": "Time is the best teacher; Unfortunately it kills all its students!",
    "protected": false,
    "followers_count": 678,
    "friends_count": 1679
  },
  '141': {
    "name": "Astrology Daily",
    "screen_name": "astrology_day",
    "description": "",
    "protected": false,
    "followers_count": 1666,
    "friends_count": 1034
  },
  '141': {
    name: 'Albert Einstein',
    screen_name: 'einstein84',
    description: 'E=mc²',
    "followers_count": 8306,
    "friends_count": 8125
  },
  '142': {
    name: 'Fredd nietzsche',
    screen_name: 'Freddnietzsche1',
    description: '',
    "followers_count": 1273,
    "friends_count": 1319
  },
  '143': {
    name: 'Minion_Best Quotes',
    screen_name: 'bstminionquotes',
    description: 'Don\' judge me. I was born to be awesome, not perfect.',
    "followers_count": 2022,
    "friends_count": 1841
  },
  '144': {
    name: 'Paulo Coelho',
    screen_name: 'cccooelho',
    description: 'all about Paulo Coelho',
    "followers_count": 7295,
    "friends_count": 7116
  }
};

((function setIdStrs() {
  for (var id in profilesForUserIds) {
    profilesForUserIds[id].id_str = id;
  }
})());

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

  filter(Object.keys(profilesForUserIds), function done(error, results) {
    var goodIds = ['102', '103', '105'];
    t.ok(!error, 'Doesn\'t return an error');
    t.deepEqual(
      results,
      {
        coolguys: goodIds,
        jerks: _.without.apply(
          _.without,
          [Object.keys(profilesForUserIds)].concat(goodIds)
        )
      },
      'Ids properly sorted by filter.'
    );
  });
});
