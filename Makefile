clean:
	rm -rf coverage build

dev:
	rm -rf node_modules
	npm install

lint:
	./node_modules/.bin/jshint \
		--exclude node_modules \
		lib test

browserify:
	rm -rf build
	mkdir -p build/lib
	./node_modules/.bin/browserify \
		lib/adhere.js -o build/lib/adhere.js

test:
	./node_modules/.bin/_mocha \
		--reporter min --bail --check-leaks \
		test/*

test-travis:
	./node_modules/.bin/istanbul cover \
		node_modules/mocha/bin/_mocha --report lcovonly -- --reporter min --check-leaks \
		test/*

.PHONY: clean dev lint browserify test test-travis
