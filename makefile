.PHONY: *


build:
	npm run build

patch:
	npm version patch

minor:
	npm version minor

major:
	npm version major

publish:
	npm publish

link:
	bun link

test:
	npm run test

coverage:
	npm run coverage

lint:
	npm run lint

format:
	npm run format

link:
	bun link