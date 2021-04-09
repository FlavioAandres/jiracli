const {Command, flags} = require('@oclif/command')
const prompt = require('../helpers/prompts')
const JiraRepo = require('../repository/jira')

class CreateIssueCommand extends Command {
  async run() {
    const JiraInstance = new JiraRepo()

    const AvailableBoards = await JiraInstance.listProjects()
    const projectsObject = AvailableBoards.reduce((prev, current)=>{
      prev[current.name] = {id: current.id, key: current.key}; 
      return prev
    }, {})

    const choosedProjectName = await prompt.autoCompleteObject(
      'Choose Issue', 
      '√ Type the project name for your issue', 
      Object.keys(projectsObject)
    ).run()

    const issueTitle = await prompt.InputObject(
      'How your issue will be named? ', 
      'Query in prod :)'
    ).run()
    
    const choosedProjectObj = projectsObject[choosedProjectName]
    const issueMetadata = await JiraInstance.getAvailableMetadataForProjects(
      [choosedProjectObj.id], [choosedProjectObj.key]
    )
    
    if(!issueMetadata.projects || !issueMetadata.projects[0]){
      return this.log('🔍 Could not find metadata to create issue in ' + choosedProjectObj.key)
    }
    const issueMetadataObject = issueMetadata.projects[0].issuetypes.reduce((prev, current)=>{
      prev[current.name] = current.id; 
      return prev
    }, {})
    
    const issueTypeChoosed = await prompt.SelectObject(
      'Select issue type', 
      'Select the issue type you prefeer', 
      Object.keys(issueMetadataObject)
    ).run()

    this.log('Insert file description: ')
    await new Promise((res)=>setTimeout(res, 1000))
    
    const issueDescription = await prompt.EditorInputObject()
    const newIssueObject = {
      project: {
        key: choosedProjectObj.key
      }, 
      summary: issueTitle,
      description: issueDescription,
      issueType: issueMetadataObject[issueTypeChoosed]
    }

    //CreateIssue :rock: 
    console.log(JSON.stringify(newIssueObject, null, 2))
  }
}

CreateIssueCommand.description = `Describe the command here
...
Extra documentation goes here
`

CreateIssueCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = CreateIssueCommand
