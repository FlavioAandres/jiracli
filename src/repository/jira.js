const JiraAPI = require('jira').JiraApi
const Configs = require('../helpers/config')
const keytar = require('keytar')
class JiraRepository {
    constructor() {
        this.globalInstance = null
    }

    buildInstance = async () => {
        if (this.globalInstance) return this.globalInstance;

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
        await this.buildInstance()
        return new Promise((resolve, rej) => {
            if (!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')

            this.globalInstance.listProjects((err, res) => {
                if (err) return rej(err)
                return resolve(res)
            })
        })
    }
    searchIssue = async (query, fields) => {
        await this.buildInstance()
        return new Promise((resolve, rej) => {
            if (!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')

            this.globalInstance.searchJira(query, null, (err, res) => {
                if (err) return rej(err)
                return resolve(res)
            })
        })
    }

    getAvailableTransitions = async (issueId) => {
        await this.buildInstance()
        return new Promise((resolve, reject) => {
            if (!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')
            this.globalInstance.listTransitions(issueId, (err, res) => {
                if (err) return reject(err)
                return resolve(res)
            })
        })
    }

    transitionIssue = async (issueId, transitionId) => {
        await this.buildInstance()
        return new Promise((response, rej) => {
            if (!this.globalInstance)
                return rej('Unauthenticated user, please see authenticate command.')
            this.globalInstance.transitionIssue(issueId, {
                transition: { id: transitionId }
            }, (err, res) => {
                if (err) return rej(err);
                return response(res)
            })
        })
    }

    createIssue = async (issueObject) => {
        await this.buildInstance()
        return new Promise((resolve, reject) => {
            this.globalInstance.doRequest({
                rejectUnauthorized: this.globalInstance.strictSSL,
                uri: this.globalInstance.makeUri('/issue/', null, 2), //version 2 JiraAPI
                method: 'POST',
                body: issueObject,
                json: true
            }, (error, response, body)=>{
                return handleJiraLibResponse(error, response, body, resolve, reject); 
            })
        }); 
    }

    getAvailableMetadataForProjects = async (projectIds = [], projectKeys = []) => {
        await this.buildInstance()
        return new Promise((resolve, reject) => {
            let queryParams = projectIds.length 
                ? '?projectIds[]=' + projectIds.join(',')
                : ''
            queryParams += projectKeys.length 
                ? '&projectKeys='+projectKeys.join(',')
                : ''
            this.globalInstance.doRequest({
                rejectUnauthorized: this.globalInstance.strictSSL,
                uri: this.globalInstance.makeUri('/issue/createmeta?projectIds' + queryParams, null, 2), //version 2 JiraAPI
                method: 'GET',
                json: true
            }, (error, response, body) => {
               return handleJiraLibResponse(error, response, body, resolve, reject); 
            })
        })
    }
}

const handleJiraLibResponse = (error, response, body, resolve, reject)=>{
    if (error) {
        return reject(error);
    }

    if (response.statusCode === 404) {
        return reject('Invalid version.');
    }

    if(![201,200].includes(response.statusCode)) {
        reject(response.statusCode + ': Unable to connect to Jira during issue creation.');
        return;
    }

    return resolve(body);
}

module.exports = JiraRepository