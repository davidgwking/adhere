TESTS = test/*
LINTABLE = ./lib ./test

clean:
	rm -rf coverage

lint:
	./node_modules/.bin/jshint \
		--exclude node_modules \
		$(LINTABLE)

test:
	./node_modules/.bin/_mocha \
		--reporter min --bail --check-leaks \
		$(TESTS)

test-travis:
	./node_modules/.bin/istanbul cover \
		node_modules/mocha/bin/_mocha --report lcovonly -- --reporter min --check-leaks \
		$(TESTS)

.PHONY: clean lint test test-travis
