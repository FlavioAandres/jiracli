jiracli
=======

Jira CLI made to interact with jira

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/jiracli.svg)](https://npmjs.org/package/jiracli)
[![Downloads/week](https://img.shields.io/npm/dw/jiracli.svg)](https://npmjs.org/package/jiracli)
[![License](https://img.shields.io/npm/l/jiracli.svg)](https://github.com/https://github.com/FlavioAandres/jiracli/jiracli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g jiracli
$ jiracli COMMAND
running command...
$ jiracli (-v|--version|version)
jiracli/0.0.0 darwin-x64 node-v15.11.0
$ jiracli --help [COMMAND]
USAGE
  $ jiracli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`jiracli authenticate`](#jiracli-authenticate)
* [`jiracli findIssue`](#jiracli-findissue)
* [`jiracli findProject`](#jiracli-findproject)
* [`jiracli hello`](#jiracli-hello)
* [`jiracli help [COMMAND]`](#jiracli-help-command)
* [`jiracli issue-transition`](#jiracli-issue-transition)

## `jiracli authenticate`

To using the JIRA REST API You need to create your own API Token based on your user. 

```
USAGE
  $ jiracli authenticate

OPTIONS
  -n, --name=name          name user
  -p, --password=password  (required) Jira Password
  -s, --server=server      (required) Jira server, ex: yoursite.atlassian.com
  -u, --user=user          (required) Jira Username or email

DESCRIPTION
  To using the JIRA REST API You need to create your own API Token based on your user. 
  More info: https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/
  ...
  Once you have your API Key, use the command as the following: 

  jiracli authenticate -u youremail@corporate.io -p yourapikeysecret123 -s yoursite.atlassian.net
```

_See code: [src/commands/authenticate.js](https://github.com/FlavioAandres/jiracli/jiracli/blob/v0.0.0/src/commands/authenticate.js)_

## `jiracli findIssue`

Describe the command here

```
USAGE
  $ jiracli findIssue

OPTIONS
  -n, --name=name  name to print.
  -o, --owner      Look for the issues reported by me.

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/findIssue.js](https://github.com/FlavioAandres/jiracli/jiracli/blob/v0.0.0/src/commands/findIssue.js)_

## `jiracli findProject`

Describe the command here

```
USAGE
  $ jiracli findProject

OPTIONS
  -k, --key=key    Project Key. Ex: CEBAPP
  -n, --name=name  Where name LIKE behavior

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/findProject.js](https://github.com/FlavioAandres/jiracli/jiracli/blob/v0.0.0/src/commands/findProject.js)_

## `jiracli hello`

Describe the command here

```
USAGE
  $ jiracli hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/FlavioAandres/jiracli/jiracli/blob/v0.0.0/src/commands/hello.js)_

## `jiracli help [COMMAND]`

display help for jiracli

```
USAGE
  $ jiracli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `jiracli issue-transition`

Describe the command here

```
USAGE
  $ jiracli issue-transition

OPTIONS
  -i, --issueID=issueID  name to print

DESCRIPTION
  Describe the command here
  ...
  Extra documentation goes here
```

_See code: [src/commands/issue-transition.js](https://github.com/FlavioAandres/jiracli/jiracli/blob/v0.0.0/src/commands/issue-transition.js)_
<!-- commandsstop -->
