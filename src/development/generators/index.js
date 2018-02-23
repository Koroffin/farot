module.exports = function (plop) {
    plop.setGenerator('migration', require('./migration/index.js'));
};