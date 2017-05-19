// One must supply targetModule if there are more than 1 same modules, otherwise unnecessary
export const ModuleInput = (moduleName, targetModule, inputIdentifier) => ({
	type: 'module',
	invalid: () => false,
	data: {
		moduleName,
		targetModule,
		inputIdentifier
	}
});
export const InitInput = (description, invalid = () => false) => ({
	type: 'init',
	invalid,
	data: {
		description
	}
});
