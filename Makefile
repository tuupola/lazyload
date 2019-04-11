.DEFAULT_GOAL := help

help:
	@echo ""
	@echo "Available tasks:"
	@echo "    lint   Run linter and code style checker"
	@echo "    unit   Run unit tests and generate coverage"
	@echo "    test   Run linter and unit tests"
	@echo "    watch  Run linter and unit tests when any of the source files change"
	@echo "    deps   Install dependencies"
	@echo "    build  Build minified version"
	@echo "    all    Install dependencies and run linter and unit tests"
	@echo ""

deps:
	yarn install

lint:
	node_modules/.bin/jshint lazyload.js

unit:
	@echo "No unit tests."

watch:
	find . -name "*.js" -not -path "./node_modules/*" -o -name "*.json" -not -path "./node_modules/*" | entr -c make test

test: lint unit

travis: lint unit

build:
	node_modules/.bin/uglifyjs lazyload.js --compress --mangle --source-map --output lazyload.min.js
	sed -i "1s/^/\/*! Lazy Load 2.0.0-rc.2 - MIT license - Copyright 2007-2019 Mika Tuupola *\/\n/" lazyload.min.js

all: deps test build

.PHONY: help deps lint test watch build all
