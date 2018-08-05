const fs = require('fs');
const EXTENSION = ['.stub'];
const path = require('path');
const Store = require('data-store');
const store = new Store('gene-config.json');
const { replaceFileContents, setFileName } = require('./helpers');

const setStubsPath = (relativepath) => {
    return store.set({ 'stubs_path': relativepath });
}

const getStubsPath = () => {
    return store.get('stubs_path');
}

const getFullyQualifiedStubsPath = () => {
    return path.join(__dirname, store.get('stubs_path'));
}

const clearConfig = () => {
    return store.clear();
}

const hasStubPath = () => {
    return store.has('stubs_path');
}

const hasDirectoryPath = () => {
    return store.has('features_path');
}

const setDestinationDirectory = (relativepath) => {
    return store.set({ 'features_path': relativepath });
}

const getDestinationDirectory = () => {
    return store.get('features_path');
}

const allowedExtensions = new Set(EXTENSION.map(extension => {
    return extension.toLowerCase();
}));


// name: directory name
const getFilesByDirectory = async (name) => {
    return await fs.readdirSync(name);
}

// name: feature name
const createFeature = async (name) => {
    const exists = await directoryExists(name)
    if (!exists) {
        return await createDirectory(name);
    }
    return false;
}

// name: directory name
const createDirectory = async (name) => {
    return await fs.mkdirSync(`${getDestinationDirectory()}/${name}`);
}

// name: directory name
const directoryExists = async (name) => {
    return await fs.existsSync(name);
}

// srcPath: file path
const getStub = async (srcPath) => {
    return await fs.readFileSync(srcPath).toString();
}

// destinatPath: destination file path
const createFile = async (destinatPath, data, featureName) => {
    data.split('\n').forEach(async function (line) {
        let replcaeCamelCase = replaceFileContents.call(this, line, featureName);

        await fs.appendFileSync(destinatPath, replcaeCamelCase.toString() + "\n");
    });
}

// name: name of the file
const filterFilesByFormat = async (name) => {
    return allowedExtensions.has(path.extname(name).toLowerCase());
}

const populatStubData = async (file, feature, srcDir, featureName) => {

    let srcFilePath = path.join(__dirname, srcDir, file);
    var currentFileStubData = await getStub(srcFilePath);
    destinatPath = setFileName(file.split('.').slice(0, 3).join('.'), featureName);
    await createFile(path.join(__dirname, getDestinationDirectory(), feature, destinatPath), currentFileStubData, featureName);
}


// filesInDirectory: may be single file 
// stubs path : directory
const genGeneric = async (filesInDirectory, feature, directory, featureName) => {
    let filteredFiles = await filesInDirectory.filter(async name => await filterFilesByFormat(name));

    if (filteredFiles.length) {
        let featureDirectoryResponse = await createFeature(feature);
        if (typeof featureDirectoryResponse !== "undefined") {
            return;
        }

        return await filteredFiles.forEach(async file => await populatStubData(file, feature, directory, featureName));
    }
    return;
}



const belloBanan = async (filesInDirectory, directory, feature, featureName) => {
    let filesinCurDir = [];
    await filesInDirectory.forEach(async dirOrFileName => {
        let isDir = await fs.lstatSync(path.join(__dirname, directory, dirOrFileName)).isDirectory();
        if (isDir) {
            let filesInDirectorySUBB = await getFilesByDirectory(`${directory}/${dirOrFileName}`);
            await belloBanan(filesInDirectorySUBB, `${directory}${dirOrFileName}/`, `${feature}/${dirOrFileName}`, featureName);
        } else {
            if (dirOrFileName === '.DS_Store') {

            } else {
                filesinCurDir.push(dirOrFileName);
            }
        }
    });

    await genGeneric(filesinCurDir, feature, directory, featureName);
};

const makeFeatureModule = async (feature, directory) => {

    const filesInDirectory = await getFilesByDirectory(directory);

    await belloBanan(filesInDirectory, directory, feature.toLowerCase().split('_').join('-'), feature);
    return;
};


module.exports = {
    setStubsPath,
    getStubsPath,
    getFullyQualifiedStubsPath,
    hasStubPath,
    clearConfig,
    setDestinationDirectory,
    makeFeatureModule,
    hasDirectoryPath,
};
