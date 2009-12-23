VERSION = 1.5.0
SHELL = /bin/sh
DOWNLOAD = /var/www/www.appelsiini.net/htdocs/download
JSPACKER = /home/tuupola/bin/jspacker
JSMIN    = /home/tuupola/bin/jsmin

all: lazyload packed minified latest

lazyload: jquery.lazyload.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).js

packed: jquery.lazyload.js
	$(JSPACKER) < jquery.lazyload.js > jquery.lazyload.pack.js
	cp jquery.lazyload.pack.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).pack.js

minified: jquery.lazyload.js
	$(JSMIN) < jquery.lazyload.js > jquery.lazyload.mini.js 
	cp jquery.lazyload.mini.js $(DOWNLOAD)/jquery.lazyload-$(VERSION).mini.js

latest: jquery.lazyload.js jquery.lazyload.pack.js jquery.lazyload.mini.js
	cp jquery.lazyload.js $(DOWNLOAD)/jquery.lazyload.js
	cp jquery.lazyload.pack.js $(DOWNLOAD)/jquery.lazyload.pack.js
	cp jquery.lazyload.mini.js $(DOWNLOAD)/jquery.lazyload.mini.js

