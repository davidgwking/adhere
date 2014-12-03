ROOT = lib
BUILD = build
TESTS = test/*
MAIN = adhere.js
LINTABLE = lib test

clean:
	rm -rf coverage build

dev:
	rm -rf node_modules
	npm install

lint:
	./node_modules/.bin/jshint \
		--exclude node_modules \
		$(LINTABLE)

browserify:
	mkdir $(BUILD)
	./node_modules/.bin/browserify \
		$(ROOT)/$(MAIN) -o $(BUILD)/$(MAIN)

test:
	./node_modules/.bin/_mocha \
		--reporter min --bail --check-leaks \
		$(TESTS)

test-travis:
	./node_modules/.bin/istanbul cover \
		node_modules/mocha/bin/_mocha --report lcovonly -- --reporter min --check-leaks \
		$(TESTS)

.PHONY: clean dev lint browserify test test-travis
