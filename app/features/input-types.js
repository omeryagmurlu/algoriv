export const ModuleInput = (targetModule, inputIdentifier) => ({
	type: 'module',
	invalid: () => false,
	data: {
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
