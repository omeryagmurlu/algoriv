# AlgoriV

A modular algorithm visualization software.

## Installation

Grap a copy for your system from releases tab.

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
