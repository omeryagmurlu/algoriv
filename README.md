#### File Structure and Grammar

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
	- For routing, needed data must be supplied by container, or an another view.
