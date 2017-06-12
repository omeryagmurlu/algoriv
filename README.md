# AlgoriV

A modular algorithm visualization software.

## Installation

* [Linux](https://gitlab.com/omeryagmurlu/algoriv/builds/artifacts/master/browse/release?job=linux-binary)
* [Windows](https://gitlab.com/omeryagmurlu/algoriv/builds/artifacts/master/browse/release?job=win-binary)
* For OSx you must build the project

You can always use the web app [here](https://omeryagmurlu.gitlab.io/algoriv)

## Getting Started

```bash
	$ yarn add algoriv
	$ yarn run start:electron
```

## Build

```bash
	$ git clone git@gitlab.com:omeryagmurlu/TSA-Software.git algoriv
	$ cd algoriv
	$ yarn
	$ yarn run watch:browser
```

## Packaging

```bash
	$ yarn run package-linux
	$ yarn run package-win
	$ yarn run package-all
```

## Usage

See `docs/usage.md`

---

### File Structure and Grammar

```
- app
	- containers
	- features
	- views
	- components
	- styles
	- index.js
```

- Index refers to a container.
- Containers can **only** import **features**, **data**, another **containers** and **views**.
- Views can **only** import **components** and **styles**.
	- For routing, containers, or another views must supply the needed data.

### `props.app` props, and `props.app.settings`

`app` is a common prop that every container and view has access to. It is used to trigger or retrive app specific actions. Components are prohibited to have access to it.

`app.settings` is the state saver. Only containers and views have access to it. Components may **only** have access to it's `visual-cache` subset for having persistent ui state.
