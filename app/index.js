'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var fs = require('fs.extra');

var RelishWordpressGenerator = module.exports = function RelishWordpressGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.options = options;
    this.config = config;

    this.fileEditHook = '#-- Relish Generator Hook --#';
    this.scriptsStylesAddon = '';
    this.themeSupportAddon = '';

    this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));

};

util.inherits(RelishWordpressGenerator, yeoman.generators.NamedBase);

RelishWordpressGenerator.prototype.askFor = function askFor() {
    var done = this.async();

    // have Yeoman greet the user
    //this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.green('You\'re using the Relish WordPress Generator.'));

    var prompts = [
        {
            type: 'input',
            name: 'appPath',
            message: 'please enter the directory where you\'d like to put your project',
            default: 'wordpress'
        },
        {
            type: 'input',
            name: 'themeName',
            message: 'please enter the name of your theme',
            default: 'relish'
        }
    ];

    this.prompt(prompts, function (props) {
        this.appPath = props.appPath;
        this.contentPath = this.appPath + '/wp-content';
        this.pluginPath = this.contentPath + '/plugins';

        this.themeName = props.themeName;
        done();
    }.bind(this));
};

RelishWordpressGenerator.prototype.app = function app() {
    this.mkdir(this.appPath);
};

RelishWordpressGenerator.prototype.getWordPress = function getWordPress() {
    var appPath = this.appPath;
    var done = this.async();
    this.extract('http://wordpress.org/latest.tar.gz', appPath, function (err) {
        if (err) {
            return done(err);
        }
        done();
    }.bind(this))
};
RelishWordpressGenerator.prototype.createThemeDir = function createThemeDir() {
    var done = this.async();

    this.mkdir(this.appPath + '/wp-content/themes/' + this.themeName);
    this.themePath = this.appPath + '/wp-content/themes/' + this.themeName;

    done();
};

RelishWordpressGenerator.prototype.getThemeBase = function getThemeBase() {
    var done = this.async();

    this.remote('automattic', '_s', function (err, remote) {
        if (err) {
            return done(err);
        }
        remote.directory('.', this.themePath);
        done();
    }.bind(this));
};

RelishWordpressGenerator.prototype.addScriptsStyles = function addScriptsStyles() {
    var done = this.async();
    this.template('_scripts-styles.txt', this.themePath + '/scripts-styles.txt');
    done();
};

RelishWordpressGenerator.prototype.readScriptsStyles = function readScriptsStyles() {
    var done = this.async();
    this.scriptsStylesAddon = this.readFileAsString(this.themePath + '/scripts-styles.txt');
    fs.unlinkSync(this.themePath + '/scripts-styles.txt');
    done();
};

RelishWordpressGenerator.prototype.addThemeSupport = function addThemeSupport() {
    var done = this.async();
    this.template('_theme-support.txt', this.themePath + '/theme-support.txt');
    done();
};

RelishWordpressGenerator.prototype.readThemeSupport = function readThemeSupport() {
    var done = this.async();
    this.themeSupportAddon = this.readFileAsString(this.themePath + '/theme-support.txt');
    fs.unlinkSync(this.themePath + '/theme-support.txt');
    done();
};

RelishWordpressGenerator.prototype.addThemeFunctions = function addThemeFunctions() {
    var done = this.async();
    this.template('_theme-functions.php', this.themePath + '/inc/' + this.themeName + '-functions.php');
    done();
};

RelishWordpressGenerator.prototype.editFunctionsPHP = function editFunctionsPHP() {
    var done = this.async();

    var filePath = this.themePath + '/functions.php';

    var file = this.readFileAsString(filePath);

    file = file.replace("wp_enqueue_script( '_s-navigation', get_template_directory_uri() . '/js/navigation.js', array(), '20120206', true );", this.fileEditHook);
    file = file.replace("wp_enqueue_script( '_s-skip-link-focus-fix', get_template_directory_uri() . '/js/skip-link-focus-fix.js', array(), '20130115', true );", "");

    file = file.replace(this.fileEditHook, this.scriptsStylesAddon);

    file = file.replace('function _s_setup() {', 'function _s_setup() {\n\n' + this.fileEditHook);
    file = file.replace(this.fileEditHook, this.themeSupportAddon);

    file = this._replace("'_s'", "'" + this.themeName + "'", file);
    file = this._replace("_s_", this.themeName + "_", file);
    file = this._replace(" _s", " " + this.themeName, file);
    file = this._replace("_s-", this.themeName + "-", file);

    file = file.replace("require get_template_directory() . '/inc/template-tags.php';", "//require get_template_directory() . '/inc/template-tags.php';");
    file = file.replace("require get_template_directory() . '/inc/extras.php';", "//require get_template_directory() . '/inc/extras.php';");
    file = file.replace("require get_template_directory() . '/inc/customizer.php';", "//require get_template_directory() . '/inc/customizer.php;");
    file = file.replace("require get_template_directory() . '/inc/jetpack.php';", "//require get_template_directory() . '/inc/jetpack.php;");

    file = file.concat("/**\n  * Load "+ this.themeName +"'s extra functions file.\n*/\nrequire get_template_directory() . '/inc/"+ this.themeName + "-functions.php';");

    fs.unlinkSync(filePath);
    this.write(filePath, file);

    done();
}

RelishWordpressGenerator.prototype.overwriteExistingFiles = function overwriteExistingFiles() {
    var done = this.async();

    this._replaceUnderscores(this.themePath + '/inc/custom-header.php');
    this._replaceUnderscores(this.themePath + '/inc/customizer.php');
    this._replaceUnderscores(this.themePath + '/inc/extras.php');
    this._replaceUnderscores(this.themePath + '/inc/jetpack.php');
    this._replaceUnderscores(this.themePath + '/inc/template-tags.php');
    this._replaceUnderscores(this.themePath + '/inc/wpcom.php');

    done();
};
RelishWordpressGenerator.prototype.removeJSFolder = function removeJSFolder() {
    var done = this.async();
    this._deleteDirRecursive(this.themePath + '/js');
    done();
};

RelishWordpressGenerator.prototype.createStyleCSS = function createStyleCSS() {
    fs.unlinkSync(this.themePath + '/style.css');
    this.template('_style.css', this.themePath + '/style.css');
};

RelishWordpressGenerator.prototype.addPlugins = function addPlugins() {
    this.directory('plugins', this.pluginPath);
};

RelishWordpressGenerator.prototype.packageJson = function packageJson() {
    this.template('_package.json', 'package.json');
};

RelishWordpressGenerator.prototype.bowerJson = function bowerJson() {
    this.template('_bower.json', 'bower.json');
};

RelishWordpressGenerator.prototype.deps = function deps() {
    var done = this.async();
    this.installDependencies({
        bower: true,
        npm: true,
        skipInstall: false,
        callback: done
    });
};

RelishWordpressGenerator.prototype.moveNodeModules = function moveNodeModules() {
    var done = this.async();
    fs.rename('node_modules', this.themePath + '/node_modules', done);
};

RelishWordpressGenerator.prototype.moveBowerComponents = function moveBowerComponents() {
    var done = this.async();
    fs.rename('bower_components', this.themePath + '/bower_components', done);
};

RelishWordpressGenerator.prototype.movePackageJSON = function movePackageJSON() {
    var done = this.async();
    fs.rename('package.json', this.themePath + '/package.json', done);
};

RelishWordpressGenerator.prototype.moveBowerJSON = function moveBowerJSON() {
    var done = this.async();
    fs.rename('bower.json', this.themePath + '/bower.json', done);
};

RelishWordpressGenerator.prototype.createGruntFile = function createGruntFile() {
    this.copy('_Gruntfile.js', this.themePath + '/Gruntfile.js');
};

RelishWordpressGenerator.prototype.createAssets = function createAssets() {
    this.directory('assets', this.themePath + '/assets');
};

RelishWordpressGenerator.prototype.createImagesFolder = function createImagesFolder() {
    this.mkdir(this.themePath + '/assets/img');
};

RelishWordpressGenerator.prototype.copyFontAwesomeFiles = function copyFontAwesomeFiles() {
    var done = this.async();

    fs.copyRecursive(this.themePath + '/bower_components/font-awesome/fonts', this.themePath + '/assets/fonts', function (err) {
        if (err) {
            return done(err)
        }
        done();
    });
};

RelishWordpressGenerator.prototype.copyVariablesFile = function copyVariablesFile() {
    var done = this.async();

    fs.copy(this.themePath + '/bower_components/bootstrap/less/variables.less', this.themePath + '/assets/css/variables.less', function (err) {
        if (err) {
            return done(err)
        }
        done();
    });
};

RelishWordpressGenerator.prototype.projectfiles = function projectfiles() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
};

/** PRIVATE FUNCTIONS - NOT TRIGGERED AUTOMATICALLY **/
/*
 Search for '_s' (inside single quotations) to capture the text domain.
 Search for _s_ to capture all the function names.
 Search for Text Domain: _s in style.css.
 Search for  _s (with a space before it) to capture DocBlocks.
 Search for _s- to capture prefixed handles.
 */

RelishWordpressGenerator.prototype._replaceUnderscores = function _replaceUnderscores(filePath) {
    var file = this.readFileAsString(filePath);
    var newFile, newFile2, newFile3, finalFile;

    newFile = this._replace("'_s'", "'" + this.themeName + "'", file);
    newFile2 = this._replace("_s_", this.themeName + "_", newFile);
    newFile3 = this._replace(" _s", " " + this.themeName, newFile2);
    finalFile = this._replace("_s-", this.themeName + "-", newFile3);

    fs.unlinkSync(filePath);
    this.write(filePath, finalFile);
}

RelishWordpressGenerator.prototype._replace = function _replace(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

RelishWordpressGenerator.prototype._deleteDirRecursive = function _deleteDirRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
