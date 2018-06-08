# @rapid-build-ui/utils
Set of automation tasks for Rapid Build UI components and utils.


## Installation
Run in project root!

```bash
$ npm install @rapid-build-ui/utils
```


## How To Use: Option 1
Simple way, place in project's root package.json scripts property.

##### components
```json
{
  "scripts": {
    "build-continuous": "node node_modules/@rapid-build-ui/utils/ci component continuous",
    "build-release": "node node_modules/@rapid-build-ui/utils/ci component release",
    "bump": "node node_modules/@rapid-build-ui/utils/bump component patch"
  }
}
```

##### utils
```json
{
  "scripts": {
    "build-continuous": "node node_modules/@rapid-build-ui/utils/ci utils continuous",
    "build-release": "node node_modules/@rapid-build-ui/utils/ci utils release",
    "bump": "node node_modules/@rapid-build-ui/utils/bump utils patch"
  }
}
```


## How To Use: Option 2
Use the API. The [process.cwd()](https://goo.gl/QS1WtL) must be the project's root path!

```js
const utils = require('@rapid-build-ui/utils');
// See API Documentation
```


## API
All return a promise.

* utils.bump.run(type, semver);
	* params
		* type (string): utils | component
		* semver (string): 1.0.0 | patch | [reference](https://docs.npmjs.com/cli/version)
	* overview
		* bumps the version in all package.json(s)
		* updates the changelog


* utils.ci.component.continuous(config);
	* builds component
	* copies root files to: dist/client/ (ex: LICENSE)
	* triggers showcase ci build


* utils.ci.component.release(config);
	* builds component
	* copies root files to: dist/client/
	* copies npm config to dist/client/
	* publishes npm package from dist/client/
	* publishes github release from master


* utils.ci.utils.continuous(config);
	* copies root files to: dist/server/ (ex: LICENSE)


* utils.ci.utils.release(config);
	* copies root files to: dist/server/
	* copies npm config to dist/server/
	* publishes npm package from dist/server/
	* publishes github release from master


* utils.ci methods
```coffeescript
# config example
repo:
	name:  'rb-alert'
	owner: 'rapid-build-ui'
	slug:  'rapid-build-ui/rb-alert'
tokens:
	github: 'token' # all projects
	npm:    'token' # components and utils
	travis: 'token' # components
paths:
	project: '/rb-alert' # absolute os project path
	abs: # absolute os paths
		dist:
			root:   '/rb-alert/dist'
			client: '/rb-alert/dist/client'
			server: '/rb-alert/dist/server'
	rel: # relative paths from project root
		dist:
			root:   'dist'
			client: 'dist/client'
			server: 'dist/server'
```


## Release Process
Applies to all projects.

```bash
$ git checkout master
$ git pull
$ git merge continuous --no-ff -m "chore(merge): continuous"
$ npm run bump # then check CHANGELOG.md (might need tweaking)
$ git commit -am "chore(bump): v1.x.x"
$ git push # ✓ then wait for successful travis ci build
$ git checkout continuous
$ git pull
$ git merge master -m "chore(merge): master"
$ git push
```