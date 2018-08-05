#! /usr/bin/env node

var program = require('commander');
const {
    setStubsPath,
    getStubsPath,
    getFullyQualifiedStubsPath,
    hasStubPath,
    clearConfig,
    setDestinationDirectory,
    hasDirectoryPath,
    makeFeatureModule
} = require('./core');

program
    .version('1.0.0')
    .description('Generate file from stubs')


program
    .command('set <path> <feature_path>')
    .alias('s')
    .description('Set the stubs path in config file')
    .action((stubsPath, feature_path) => {
        setStubsPath(stubsPath);
        setDestinationDirectory(feature_path);
        console.log('set stubs path and store them at ', stubsPath);
        console.log('set destination path and create stubs at ', feature_path);
    });

program
    .command('list')
    .alias('l')
    .description('Get the stubs path in config file')
    .action(() => {
        if (hasStubPath()) {
            console.log('Rrelative path', getStubsPath())
            console.log('Qualified stubs path at ', getFullyQualifiedStubsPath())
        } else {
            console.log('You must set stubs path using stub or s command option. (ex: gene s resources/stub)');
        }
    });

program
    .command('clear')
    .alias('c')
    .description('Clears the stub configuration')
    .action(() => {
        clearConfig();
        console.log('configuration have been reset');
    })

program
    .command('generate <feature>')
    .alias('g')
    .description('Generate given stub files at given directory')
    .action((feature) => {
        if (hasDirectoryPath()) {
            if (hasStubPath()) {
                console.log('generating feature');
                makeFeatureModule(feature, getStubsPath())
                .then(() => {
                    console.log('Done !');
                });
            } else {
                console.log('You must set stubs path using set or s command option. (ex: gene s resources/stub app/features)');
            }
        } else {
            console.log('You must set feature path using set or s command option. (ex: gene s resources/stub app/features)');
        }
    });



program.parse(process.argv);
