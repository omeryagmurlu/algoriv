const InitInput = (description, invalid = () => false, update, value, group = '') => ({
	invalid,
	description,
	validate: (...p) => !invalid(...p),
	update,
	value,
	group,
});

export default InitInput;
