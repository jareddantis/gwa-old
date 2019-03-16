# gwa

General weighted average calculator built for the modern web.

![GitHub tag](https://img.shields.io/github/tag/illustra/gwa.svg) [![Build Status](https://travis-ci.org/illustra/gwa.svg?branch=master)](https://travis-ci.org/illustra/gwa) [![devDependencies](https://david-dm.org/illustra/gwa/dev-status.svg)](https://david-dm.org/illustra/gwa) [![Greenkeeper badge](https://badges.greenkeeper.io/illustra/gwa.svg)](https://greenkeeper.io/) [![GitHub license](https://img.shields.io/github/license/illustra/gwa.svg)](https://github.com/illustra/gwa/blob/master/LICENSE)

## Features

* GWA calculation for Philippine Science High School students
* Support for optional electives for Grade 10 PSHS students
* Support for defining a custom set of subjects (for college students)
* Progressive web app **[(can run offline on supported browsers/devices)](http://by.jared.gq/gwaoffline)**
* Night mode (can be automatically enabled at sunset)
* Cumulative GPA calculation mode (experimental)

## Building

This project uses [Gulp](https://gulpjs.com) to generate the needed HTML, CSS, and JS files. For example, `index.html` is generated by combining the HTML files inside `src/html_components/`, and the main `script.js` is generated by combining and minifying all of the JavaScript files inside `src/js/`.

To build the calculator on your machine, you will need a working installation of [Node.js](https://nodejs.org/en/download/).

Once you have Node.js installed, clone the repository locally and install the required Node.js modules (the following steps are for Linux/macOS):

```bash
git clone https://github.com/illustra/gwa.git
cd gwa
npm install -g gulp-cli
npm install
```

You also need to download the JavaScript libraries used by the calculator:

```bash
mkdir -p dist/js
curl 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js' > dist/js/jquery.min.js
curl 'https://cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min.js' > dist/js/fastclick.min.js
curl 'https://cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.18/jquery.touchSwipe.min.js' > dist/js/touchswipe.min.js
curl 'https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js' > dist/js/webfontloader.min.js
curl 'https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js' > dist/js/suncalc.min.js
curl 'https://cdn.jsdelivr.net/npm/vanilla-ripplejs@1.0.6' > dist/js/ripple.min.js
```

You are now ready to make your changes to the files inside `src/`. When you're done, build the calculator:

```bash
gulp all
```

Open the resulting `index.html` with your favorite browser.

## Contributing

The calculator is automatically built with [Travis](https://travis-ci.org) to make updating and testing easier. NPM dependencies are also automatically updated by [Greenkeeper.](https://greenkeeper.io)

If you have a suggestion for the calculator, you can either

* send me a message about it [here,](http://server.jared.gq/feedback/?subject=pisaygwa-web) or
* make a pull request on this repository if you have some code to share!

## Credits

- Google for [Material Design Icons](https://material.io/icons)
- jQuery for, well, [jQuery](https://github.com/jquery/jquery)
- TypeKit for [WebFontLoader](https://github.com/typekit/webfontloader/)
- Matt Bryson for [jQuery.touchSwipe](https://github.com/mattbryson/TouchSwipe-Jquery-Plugin)
- Vladimir Agafonkin for [SunCalc](https://github.com/mourner/suncalc)

## License

```
pisaygwa: The quick, responsive GWA calculator for PSHS and college students.
Copyright (C) 2015-2019 Aurel Jared Dantis

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
```

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/ages-12.svg)](https://forthebadge.com) [![forthebadge](https://forthebadge.com/images/badges/does-not-contain-msg.svg)](https://forthebadge.com)
