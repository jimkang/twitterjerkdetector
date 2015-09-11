test:
	node tests/basictests.js
	node tests/blacklist-tests.js

pushall:
	git push origin master && npm publish