const git = require('./util/git');
const linter = require('./util/linter');

function log(fails) {
    fails.forEach(fail => fail.log());

    if (fails.length > 0) {
        const message = `Linter found ${fails.length} error.`;

        console.log('\n' + message);

        process.exit(1);
    }
}

// `*.ts` files, except `*.d.ts`
const ext = ['.ts', /^(?!.*\.d\.ts$).*$/];

const diff = () => git.mergeBase().then((hash) => git.diff(hash, ...ext)).then(linter).then(log);
const status = () => git.status(...ext).then(linter).then(log);

module.exports = {
    status,
    diff,
};
