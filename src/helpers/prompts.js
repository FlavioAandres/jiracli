const { Input, Select, Confirm } = require('enquirer')

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

module.exports.parseBreakLine = (text, limit, iteration = 1) => {
    if (text.length < iteration * limit) return text
    const breakLine = text.substring(0, limit * iteration) + "\n" + text.substring(limit * iteration, text.lenght)
    return this.parseBreakLine(breakLine, limit, iteration + 1)
}