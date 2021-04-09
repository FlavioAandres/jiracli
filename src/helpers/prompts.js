const { Input, Select, Confirm, AutoComplete } = require('enquirer')
const childProcess = require('child_process')
const filesystem = require('fs')
const path = require('path')

module.exports.EditorInputObject = () => new Promise((resolve, reject)=>{
    const DEFAULT_NAME_TEMP_FILE = 'JIRA_ISSUE_MSG'
    const ABSOLUTE_PATH_FILE = path.join(__dirname, '../../',DEFAULT_NAME_TEMP_FILE);

    filesystem.createWriteStream(
        ABSOLUTE_PATH_FILE,
        { flags: 'w' }
    ); 

    const editor = childProcess.spawn('nano', [ABSOLUTE_PATH_FILE], { stdio: 'inherit' })
    editor.on('exit', ()=>{
        const textFile = filesystem.readFileSync(ABSOLUTE_PATH_FILE).toString('utf-8')
        filesystem.rmSync(ABSOLUTE_PATH_FILE)
        resolve(textFile)
    })
    editor.on('error', reject)
})

module.exports.InputObject = (message = "", initial = "abc") => new Input({
    message,
    initial,
});

module.exports.SelectObject = (name,message, choices)=> new Select({
   name, choices, message, 
})

module.exports.confirmObject = (name, message) => new Confirm({
    name, message, 
})

module.exports.autoCompleteObject = (name, message, suggestions) => new AutoComplete({
    name,
    message,
    limit: 6,
    initial: 2,
    choices: suggestions
})

module.exports.parseBreakLine = (text, limit, iteration = 1) => {
    if (text.length < iteration * limit) return text
    const breakLine = text.substring(0, limit * iteration) + "\n" + text.substring(limit * iteration, text.lenght)
    return this.parseBreakLine(breakLine, limit, iteration + 1)
}