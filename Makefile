# $Id: Makefile 193 2007-08-13 15:03:17Z tuupola $

VERSION = 1.1.0
SHELL = /bin/sh
DOWNLOAD = /export/home/tuupola/rails/mephisto-svn/public/download
JSPACKER = /export/home/tuupola/bin/jspacker
JSMIN    = /export/home/tuupola/bin/jsmin

all: lazyload packed minified latest

lazyload: jquery.lazyload.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).js

packed: jquery.lazyload.js
	$(JSPACKER) -i jquery.lazyload.js -o jquery.lazyload.pack.js -f -e62
	cp jquery.lazyload.pack.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).pack.js

minified: jquery.lazyload.js
	$(JSMIN) < jquery.lazyload.js > jquery.lazyload.mini.js 
	cp jquery.lazyload.mini.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).mini.js

latest: jquery.lazyload.js jquery.lazyload.pack.js jquery.lazyload.mini.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload.js
	cp jquery.lazyload.pack.js $(DOWNLOAD)/jquery.lazyload.pack.js
	cp jquery.lazyload.mini.js $(DOWNLOAD)/jquery.lazyload.mini.js

