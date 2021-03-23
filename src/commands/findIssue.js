const {Command, flags} = require('@oclif/command')
const JiraRepo = require('../repository/jira')
const Table = require('cli-table3');
const { Input, Select } = require('enquirer')
const urlHelper = require('../helpers/url')
class FindIssueCommand extends Command {
  InputObject = (message = "", initial = "abc") => new Input({
    message,
    initial,
  });
  async run() {
    const { flags } = this.parse(FindIssueCommand)
    const JiraInstance = new JiraRepo()
    
    if(!flags.name){
      flags.name = await this.InputObject("Add a name to search", "Query in prod").run()
    }
    const JQL = `summary ~ "${flags.name}" AND reporter in (currentUser()) order by created DESC`
    const JQLResult = await JiraInstance.searchIssue(JQL)
    
    const issuesTable = new Table({
      head: ["Name", "Status", "URL"]
    })

    const parsedIssues = JQLResult.issues.map(item=>[
      item.fields.summary.slice(0,40), 
      item.fields.status.name,
      urlHelper.generateIssueUrl(item.key)
    ])

    issuesTable.push(...parsedIssues)
    this.log(issuesTable.toString())
  }

}

FindIssueCommand.description = `Describe the command here
...
Extra documentation goes here
`

FindIssueCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = FindIssueCommand
