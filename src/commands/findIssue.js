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
  parseBreakLine = (text, limit, iteration = 1)=> {
    if(text.length < iteration * limit) return text
    const breakLine = text.substring(0,limit*iteration ) + "\n" + text.substring(limit*iteration, text.lenght) 
    return this.parseBreakLine(breakLine, limit, iteration + 1)
  }
  async run() {
    const { flags } = this.parse(FindIssueCommand)
    const JiraInstance = new JiraRepo()
    
    if(!flags.name){
      flags.name = await this.InputObject("Add a name to search", "Query in prod").run()
    }

    const JQL = `summary ~ "${flags.name}" 
      ${flags.owner ? 'AND reporter in (currentUser())' : ''}
      order by created DESC
    `
    console.log(JQL)
    const JQLResult = await JiraInstance.searchIssue(JQL)
    
    const issuesTable = new Table({
      head: ["Name", "Status", "URL"]
    })

    const parsedIssues = JQLResult.issues.map(item=>[
      this.parseBreakLine(item.fields.summary, 40), 
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
  name: flags.string({char: 'n', description: 'name to print.'}),
  owner: flags.boolean({char: 'o', description: 'Look for the issues reported by me.'})
}

module.exports = FindIssueCommand
