
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

store.js: components
	@component build --standalone store --name store --out .

test: build
	open test/index.html

.PHONY: clean
