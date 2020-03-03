const TWO_HOURS = 1000 * 60 * 60 * 2;
const SESS_NAME = 'sid';
const SESS_SECRET = 'ssh!quiet,it\'asecret!';

module.exports = {
    mongoURI: 'mongodb+srv://shabdan:1q2w3e4r@minecluster-gdzus.mongodb.net/test?retryWrites=true&w=majority',
    SESS_LIFETIME: TWO_HOURS,
    SESS_NAME,
    SESS_SECRET
}