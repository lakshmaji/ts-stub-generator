// Write logic how to replace the file contents
// NOTE: Do not override / change this name
// Must return string
const replaceFileContents = (aline, featureName) => {
    // Your own implementation
    const className = createClassName(featureName);
    const interfaceName = className;
    const resourceName = featureName.toLowerCase().split('_').join('-');
    const globalName = featureName.toUpperCase();

    return aline.replace(/RESOURCE_CLASS_NAME/gi, className)
        .replace(/RESOURCE_GLOBAL_CONST_NAME/gi, globalName)
        .replace(/RESOURCE_CONST_NAME/gi, resourceName)
        .replace(/INTERFACE_NAME/gi, interfaceName);
};

// Write logic how to name your file
// NOTE: Do not override / change this name
// Must return string
const setFileName = (filename, featureName) => {
    // Your own implementation
    return filename.replace(/RESOURCE_CONST_NAME/gi, featureName.toLowerCase().split('_').join('-'));
}

// Do not change/ remove these lines
module.exports = {
    replaceFileContents,
    setFileName
};



const createClassName = (name) => {
    return name.split('_').reduce((acc, curr) => {
        let [first, ...rest] = curr.split('');
        return acc += String.prototype.toUpperCase.call(first) + rest.join('');
    }, '');
};

