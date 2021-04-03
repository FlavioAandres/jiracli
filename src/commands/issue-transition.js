const {Command, flags} = require('@oclif/command')
const promptHelper = require('../helpers/prompts')
const urlHelper = require('../helpers/url')
const JiraRepo = require('../repository/jira')
const Table = require('cli-table3');

class IssueTransitionCommand extends Command {
  async run() {
    const {flags} = this.parse(IssueTransitionCommand)
    if(!flags.issueID){
      flags.issueID = await promptHelper.InputObject("Issue Id to transition: ", "PDD").run()
    }

    //get available transitions for issue 
    const JiraInstance = new JiraRepo()
    const JiraTransitionsResult = await JiraInstance.getAvailableTransitions(flags.issueID).catch(err=>err)

    if(!JiraTransitionsResult || !JiraTransitionsResult.transitions || !JiraTransitionsResult.transitions.length)
      return this.log("> Cannot Transition issue: " + flags.issueID)
    
    const AvaliableTransitions = {}; 
    JiraTransitionsResult.transitions.forEach(item=>{
      AvaliableTransitions[item.to.name] = item.id;  
    })

    //Choose a transition
    const choosedTransition = await promptHelper.SelectObject(
      'transition', 
      '> Select one of the following availables transitions: (ctrl + c to cancel)', 
      Object.keys(AvaliableTransitions)
    ).run()

    //Confirm Transition  :) 
    const confirmTransition = await promptHelper.confirmObject(
      'Confirm Transition', 
      `Confirm Transition Issue ${flags.issueID} to ${choosedTransition} - (ID: ${AvaliableTransitions[choosedTransition]})`  
    ).run()

    if(confirmTransition){
      const confirmation = await JiraInstance.transitionIssue(flags.issueID, AvaliableTransitions[choosedTransition]).catch(err=>err);
      console.info(confirmation) //success or error
    }else{
      this.log('Thanks for using jiradev 🤟🏼')
    }
  }
}

IssueTransitionCommand.description = `
Describe the command here
...
Extra documentation goes here
`

IssueTransitionCommand.flags = {
  issueID: flags.string({char: 'i', description: 'name to print'}),
}

module.exports = IssueTransitionCommand
