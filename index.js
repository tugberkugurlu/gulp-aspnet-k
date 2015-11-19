var _ = require('lodash'),
  shell = require('gulp-shell'),
  gutil = require('gulp-util');

var PLUGIN_NAME = 'dnx';

function dnxRunner(dnxCommand, options) {
  if (!dnxCommand) {
    throw new gutil.PluginError(PLUGIN_NAME, 'Please specify the dnx command to run.');
  }

  options = _.extend({
    restore: true,
    build: false,
    watch: true,
    run: false,
    cwd: './'
  }, options);

  if (!options.restore && !options.build && !options.run) {
    throw new gutil.PluginError(PLUGIN_NAME, 'No action has been specified');
  }

  if (options.watch && options.run) {
    throw new gutil.PluginError(PLUGIN_NAME, 'Run and watch cannot both be true');
  }

  var commands = [];

  if (options.restore === true) {
    commands.push('dnu restore');
  }

  if (options.build === true) {
    commands.push('dnu build');
  }

  if (options.watch === true) {
    commands.push('@powershell -NoProfile -ExecutionPolicy unrestricted -Command "for(;;) { Write-Output \"Starting...\"; dnx --watch ' + dnxCommand + ' }"');
  }

  if (options.run === true) {
      commands.push('@powershell -NoProfile -ExecutionPolicy unrestricted -Command "Write-Output \"Starting...\"; dnx ' + dnxCommand + ' "');
  }

  return shell.task(commands, {
    env: process.env,
    cwd: options.cwd
  });
}

dnxRunner.build = function(cwd) {
  return dnxRunner({
    build: true,
    restore: false,
    run: false,
    cwd: cwd
  });
};

dnxRunner.restore = function(cwd) {
  return dnxRunner({
    restore: true,
    build: false,
    run: false,
    cwd: cwd
  });
};

dnxRunner.restoreBuild = function(cwd) {
  return dnxRunner({
    restore: true,
    build: true,
    run: false,
    cwd: cwd
  });
};

module.exports = dnxRunner;
