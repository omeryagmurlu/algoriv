export const CustomInput = () => ({ type: 'custom' });
export const InitInput = (description, invalid = () => false) => ({
	type: 'init',
	invalid,
	options: {
		description
	}
});
