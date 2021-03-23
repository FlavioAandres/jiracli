const {Command, flags} = require('@oclif/command')
const JiraRepo = require('../repository/jira')
const Table = require('cli-table3');
const { Input, Select } = require('enquirer')

class FindProjects extends Command {
  InputObject = (message = "", initial = "abc") => new Input({
    message,
    initial,
  });
  async run() {
    const { flags } = this.parse(FindProjects)
    const JiraInstance = new JiraRepo()
    const AllViewableResults = await JiraInstance.listProjects()
    
    if(!flags.name){
      flags.name = await this.InputObject("Add a name to search", "Providers").run()
    }
    
    const Filtered = AllViewableResults.filter(({ key, name })=>{
      return flags.name && name.toLowerCase().includes(flags.name.toLocaleLowerCase())
    })
    
    const ProjectsTable = new Table({
      head: ["Project Name", "Key", "id"]
    })
    
    const ProjectsParsed = Filtered.map(item=>[item.name, item.key, item.id])
    ProjectsTable.push(...ProjectsParsed)
    this.log(ProjectsTable.toString())
  }

}

FindProjects.description = `Describe the command here
...
Extra documentation goes here
`

FindProjects.flags = {
  name: flags.string({char: 'n', description: 'Where name LIKE behavior'}),
  key: flags.string({char: "k", description: "Project Key. Ex: CEBAPP"})
}

module.exports = FindProjects
