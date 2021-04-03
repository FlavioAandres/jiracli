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

    getAvailableTransitions = async (issueId) =>{
        await this.buildInstance()
        return new Promise((resolve, reject)=>{
            if(!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')
            this.globalInstance.listTransitions(issueId, (err, res)=>{
                if(err) return reject(err)
                return resolve(res)
            })
        })
    }

    transitionIssue = async (issueId, transitionId) =>{
        await this.buildInstance()
        return new Promise((response, rej)=>{
            if(!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')
            this.globalInstance.transitionIssue(issueId, {
                transition: { id: transitionId }
            }, (err,res)=>{
                if(err) return rej(err); 
                return response(res)
            })
        })
    }
}

module.exports = JiraRepository