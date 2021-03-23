const LocalConf = require('./config')
module.exports.generateIssueUrl = (key)=>{
    const LocalSettings = new LocalConf()
    const AuthSettings = LocalSettings.getConfig('auth')
    return `https://${AuthSettings.server}/browse/${key}`
}