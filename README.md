twitterjerkdetector
==================

Given an array of Twitter user ids, gives back an array of the subset of those user ids that aren't jerks. (Figures that out by looking for keywords in their profiles.)

Installation
------------

    npm install twitterjerkdetector

Usage
-----

    var twitterjerkdetector = require('twitterjerkdetector');
    var twit = require('twit');
    var filter = twitterjerkdetector.createFilter({
      twit: twit,
      blacklist: [2255981, 14174091]
    });
    filter(
      [
        13145012,
        12602932,
        10369032,
        10451252,
        765140,
        2255981,
        1038301,
        14174091,
        14834227
      ],
      function done(error, results) {
        console.log(JSON.stringify(results, null, '  '));
      }
    );

Output:

    {
      coolguys: [
        12602932,
        10369032,
        765140,
        14174091
      ],
      jerks: [
        13145012,
        10451252,
        2255981,
        1038301,
        14834227
      ]
    }

The blacklist opt is an array of ids that the filter will always consider bad.

Tests
-----

Run tests with `make test`.

License
-------

MIT.
