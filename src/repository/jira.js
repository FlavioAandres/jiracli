const JiraAPI = require('jira').JiraApi
const Configs = require('../helpers/config')
const keytar = require('keytar')

class JiraRepository {
    constructor(){
        this.globalInstance = null
    }

    buildInstance = async () => {
        if(this.globalInstance) return this.globalInstance; 

        const LocalSettings = new Configs()
        const AuthSettings = LocalSettings.getConfig('auth')
        console.log(AuthSettings)
        let password = await keytar.getPassword('JiraCredentials', AuthSettings.user)
        if (!password) throw new Error('No Credentials Found');

        this.globalInstance = new JiraAPI(
            'https',
            AuthSettings.server,
            443,
            AuthSettings.user,
            password,
            '2',
            true
        );
        return this.globalInstance
    }

    listProjects = async (...args) => {
        await  this.buildInstance()
        return new Promise((resolve, rej) => {
            if(!this.globalInstance) 
                return rej('Unauthenticated user, please see authenticate command.')
            
            this.globalInstance.listProjects((err, res) => {
                if (err) return rej(err)
                return resolve(res)
            })
        })
    }
    searchIssue = async (query, fields) =>{
        await  this.buildInstance()
        return new Promise((resolve, rej) => {
            if(!this.globalInstance) 
                return rej('Unauthenticated user, please see authenticate command.')
            
            this.globalInstance.searchJira(query, null, (err, res) => {
                if (err) return rej(err)
                return resolve(res)
            })
        })
    }
}

module.exports = JiraRepository