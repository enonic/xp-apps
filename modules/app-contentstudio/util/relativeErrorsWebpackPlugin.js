const path = require('path');

const formatPath = error => path.normalize(error.module ? error.module.resource : error.file);
const formatPosition = error => error.location ? `[${error.location.line}, ${error.location.character}]` : '';
const formatFileError = error => `${formatPath(error)}${formatPosition(error)}: ${error.rawMessage}`;
const formatError = error => (error.location && error.rawMessage) ? formatFileError(error) : error;

module.exports = function () {
    this.plugin('done', (stats) => {
        const errors = stats.compilation.errors;
        if (errors && errors.length > 0) {
            errors.forEach((error) => {
                console.log(formatError(error));
            });
            process.exit(1);
        }
    });
};
