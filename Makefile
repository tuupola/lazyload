VERSION = 1.8.5
SHELL = /bin/sh
DOWNLOAD = /srv/www/www.appelsiini.net/shared/static/download
JSMIN    = /home/tuupola/bin/jsmin

all: lazyload minified latest

lazyload: jquery.lazyload.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).js

minified: jquery.lazyload.js
	cp jquery.lazyload.min.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).min.js

latest: jquery.lazyload.js jquery.lazyload.min.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload.js
	cp jquery.lazyload.min.js $(DOWNLOAD)/jquery.lazyload.min.js

