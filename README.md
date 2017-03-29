Wordpress Generator - a [Yeoman](http://yeoman.io) generator for local WordPress installs

## Getting Started

To use the generator, you will need to have [Node](http://nodejs.org/) installed.

You will also need to install [Yeoman](http://yeoman.io/), by doing the following:

```
$ npm install -g yo
```

### The Yeoman Generator

To install generator-relish-wordpress from npm, run:

```
$ npm install -g generator-relish-wordpress
```

Finally, initiate the generator:

```
$ yo relish-wordpress
```

### What it does

1. Asks you a few questions about your project
2. Asks if you'd like to create a wp-config file and if so, asks you for relevant variable names
3. Fetches the latest version of WordPress from wordpress.org
4. Adds common plugins we use to build all our sites
5. Grabs an empty theme, based on [_s](http://underscores.me/)
6. Edits the functions.php file, adding some commonly used functions, and removing some stuff we don't need
7. Downloads Bootstrap 3 (.less) and FontAwesome
8. Copies the Bootstrap variables.less file to the theme's css folder for overrides
9. Copies the FontAwesome fonts folder to the theme's fonts folder
10. Loads in come commonly used JS plugins.
11. Creates a sample main.js file
12. Sets up the Gruntfile.js in the theme folder to make this all work!


### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).
