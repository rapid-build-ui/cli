# @rapid-build-ui/cli
Set of automation tasks for Rapid Build UI cli, components, mixins and showcase.


## Installation
Run in project root!

```bash
$ npm install @rapid-build-ui/cli
```


## How To Use: Option 1
Simple way, place in project's root package.json scripts property.

#### cli
```json
{
  "scripts": {
    "build-continuous": "node node_modules/@rapid-build-ui/cli/ci cli continuous",
    "build-release": "node node_modules/@rapid-build-ui/cli/ci cli release",
    "bump": "node node_modules/@rapid-build-ui/cli/bump cli patch"
  }
}
```

#### components
```json
{
  "scripts": {
    "build-continuous": "node node_modules/@rapid-build-ui/cli/ci component continuous",
    "build-release": "node node_modules/@rapid-build-ui/cli/ci component release",
    "bump": "node node_modules/@rapid-build-ui/cli/bump component patch"
  }
}
```

#### showcase
```json
{
  "scripts": {
    "build-continuous": "node node_modules/@rapid-build-ui/cli/ci showcase continuous",
    "build-release": "node node_modules/@rapid-build-ui/cli/ci showcase release",
    "bump": "node node_modules/@rapid-build-ui/cli/bump showcase patch"
  }
}
```


## How To Use: Option 2
Use the API. The [process.cwd()](https://goo.gl/QS1WtL) must be the project's root path!

```js
const cli = require('@rapid-build-ui/cli');
// See API Documentation
```


## API
All return a promise.

* #### cli.bump.run(type, semver, extraBumpFile = null)
	* params
		* type (string): cli | component
		* semver (string): 1.0.0 | patch | [reference](https://docs.npmjs.com/cli/version)
		* extraBumpFile (string, optional): file path relative to project root
	* overview
		* bump version in all package.json(s)
		* bump extra file (optional)
		* update changelog

* #### cli.ci.component.continuous(config)
	* build component
	* copy root files to: dist/client/ (ex: LICENSE)
	* trigger showcase ci build

* #### cli.ci.component.release(config)
	* build component
	* copy root files to: dist/client/
	* copy npm config to dist/client/
	* publish npm package from dist/client/
	* publish github release from master

* #### cli.ci.cli.continuous(config)
	* copy root files to: dist/server/ (ex: LICENSE)

* #### cli.ci.cli.release(config)
	* copy root files to: dist/server/
	* copy npm config to dist/server/
	* publish npm package from dist/server/
	* publish github release from master

* #### cli.ci.showcase.continuous(config)
	* create directory for cloned components (.rb-components)
	* clone component repos (into .rb-components)
	* setup components
	* setup showcase
	* build showcase
	* create heroku dist/package.json
	* publish heroku app rapid-build-ui-io-dev

* #### cli.ci.showcase.release(config)
	* install client
	* install server
	* build showcase
	* create heroku dist/package.json
	* publish heroku app rapid-build-ui-io-staging
	* publish github release from master

* #### cli.ci methods
```coffeescript
# config example
repo:
	name:  'rb-alert'
	owner: 'rapid-build-ui'
	slug:  'rapid-build-ui/rb-alert'
tokens:
	github: 'token' # all projects
	heroku: 'token' # showcase
	npm:    'token' # components and cli
	travis: 'token' # components
paths:
	abs: # absolute os paths
		project:    '/rb-alert'
		components: '/rapid-build-ui.io/.rb-components' # (showcase only)
		dist:
			root:   '/rb-alert/dist'
			client: '/rb-alert/dist/client'
			server: '/rb-alert/dist/server'
		src:
			root:   '/rb-alert/src'
			client: '/rb-alert/src/client'
			server: '/rb-alert/src/server'
	rel: # relative paths from project root
		dist:
			root:   'dist'
			client: 'dist/client'
			server: 'dist/server'
		src:
			root:   'src'
			client: 'src/client'
			server: 'src/server'
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