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
        },
        {
            type: 'confirm',
            name: 'configSetup',
            message: 'would you like to set up the config file?',
            default: true
        }
    ];

    this.prompt(prompts, function (props) {

        this.appPath = props.appPath;
        this.contentPath = this.appPath + '/wp-content';
        this.pluginPath = this.contentPath + '/plugins';

        this.themeName = props.themeName;

        this.configSetup = props.configSetup;
        done();
    }.bind(this));
};

RelishWordpressGenerator.prototype.checkDB = function checkDB() {
    var done = this.async();

    if (!this.configSetup){
        return done();
    }

    var prompts = [
        {
            type: 'input',
            name: 'dbName',
            message: 'enter the database name',
            default: this.themeName + '_db'
        },
        {
            type: 'input',
            name: 'dbUser',
            message: 'please enter username for the database',
            default: this.themeName + '_user'
        },
        {
            type: 'input',
            name: 'dbPass',
            message: 'please enter password for the database',
            default: 'Cucumb3r'
        },
        {
            type: 'input',
            name: 'dbHost',
            message: 'enter the db host',
            default: 'localhost'
        },
        {
            type: 'input',
            name: 'tablePrefix',
            message: 'enter the db table prefix',
            default: '_wp'
        }
    ];

    this.prompt(prompts, function (props) {

        this.dbName = props.dbName;
        this.dbUser = props.dbUser;
        this.dbPass = props.dbPass;
        this.dbHost = props.dbHost;
        this.tablePrefix = props.tablePrefix;

        done();
    }.bind(this));
}

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


RelishWordpressGenerator.prototype.makeConfigFile = function makeConfigFile() {
    var done = this.async();
    if (!this.configSetup){
        return done();
    }
    var configFile = this.readFileAsString(this.appPath + '/wp-config-sample.php');

    configFile = configFile.replace("define('DB_NAME', 'database_name_here');","define('DB_NAME', '"+this.dbName+"');");
    configFile = configFile.replace("define('DB_USER', 'username_here');","define('DB_USER', '"+this.dbUser+"');");
    configFile = configFile.replace("define('DB_PASSWORD', 'password_here');","define('DB_PASSWORD', '"+this.dbPass+"');");
    configFile = configFile.replace("define('DB_HOST', 'localhost');","define('DB_HOST', '"+this.dbHost+"');");
    configFile = configFile.replace("$table_prefix  = 'wp_';","$table_prefix  = '"+this.tablePrefix+"';");
    configFile = configFile.replace("define('WP_DEBUG', false);","define('WP_DEBUG', true);");

    this.write(this.appPath + '/wp-config.php', configFile);
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

RelishWordpressGenerator.prototype.removeOldThemes = function removeOldThemes(){
    this._deleteDirRecursive(this.contentPath + '/themes/twentytwelve');
    this._deleteDirRecursive(this.contentPath + '/themes/twentythirteen');
}

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

    //file = file.replace("require get_template_directory() . '/inc/template-tags.php';", "//require get_template_directory() . '/inc/template-tags.php';");
    file = file.replace("require get_template_directory() . '/inc/extras.php';", "//require get_template_directory() . '/inc/extras.php';");
    file = file.replace("require get_template_directory() . '/inc/customizer.php';", "//require get_template_directory() . '/inc/customizer.php;");
    file = file.replace("require get_template_directory() . '/inc/jetpack.php';", "//require get_template_directory() . '/inc/jetpack.php;");

    file = file.concat("\n/**\n  * Load "+ this.themeName +"'s extra functions file.\n */\nrequire get_template_directory() . '/inc/"+ this.themeName + "-functions.php';");

    fs.unlinkSync(filePath);
    this.write(filePath, file);

    done();
}

RelishWordpressGenerator.prototype.changeThemeNamesWithinExistingFiles = function changeThemeNamesWithinExistingFiles() {
    var done = this.async();
    this._replaceUnderscoresRecursive(this.themePath);
    done();
};

RelishWordpressGenerator.prototype.renameLanguageFile = function renameLanguageFile(){
    var done = this.async();
    fs.rename(this.themePath + '/languages/_s.pot', this.themePath + '/languages/'+ this.themeName + '.pot', done);
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

RelishWordpressGenerator.prototype._replaceUnderscores = function _replaceUnderscores(filePath) {
    var file = this.readFileAsString(filePath);

    file = this._replace("'_s'", "'" + this.themeName + "'", file);
    file = this._replace("_s_", this.themeName + "_", file);
    file = this._replace(" _s", " " + this.themeName, file);
    file = this._replace("_s-", this.themeName + "-", file);

    fs.unlinkSync(filePath);
    this.write(filePath, file);
}

RelishWordpressGenerator.prototype._replace = function _replace(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

RelishWordpressGenerator.prototype._deleteDirRecursive = function _deleteDirRecursive(path) {
    var self = this;
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                self._deleteDirRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

RelishWordpressGenerator.prototype._replaceUnderscoresRecursive = function _replaceUnderscoresRecursive(path) {
    var self = this;
    var curPath;

    fs.readdirSync(path).forEach(function (file, index) {
        curPath = path + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            self._replaceUnderscoresRecursive(curPath);
        }else{
            self._replaceUnderscores(curPath);
        }
    });
};