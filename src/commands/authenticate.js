const {Command, flags} = require('@oclif/command')
const keytar = require('keytar')
const Configs = require('../helpers/config')

class AuthenticateCommand extends Command {
  async run() {
    const { flags } = this.parse(AuthenticateCommand)
    const { name, user, password, server } = flags
    this.log(`You're login through HTTPS Authentication using: \n=>${user}`)
    //Managing credentials using Win/Linux/OSX key manager
    await keytar.setPassword('JiraCredentials', user, password)
    
    //Local credentials 
    const localCredentials = new Configs()
    localCredentials.addConfig('auth', 'server', server)
    localCredentials.addConfig('auth', 'user', user)

    this.log(`Credentials saved successfully`)
  }
}

AuthenticateCommand.description = `
To using the JIRA REST API You need to create your own API Token based on your user. 
More info: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
...
Once you have your API Key, use the command as the following: 

jiracli authenticate -u youremail@corporate.io -p yourapikeysecret123 -s yoursite.atlassian.net
`

AuthenticateCommand.flags = {
  name: flags.string({char: 'n', description: 'name user', required: false}),
  user: flags.string({char: 'u', description: "Jira Username or email", required: true}),
  password: flags.string({char: 'p', description: "Jira Password", required: true}),
  server: flags.string({char: 's', description: "Jira server, ex: yoursite.atlassian.com", required: true})
}

module.exports = AuthenticateCommand