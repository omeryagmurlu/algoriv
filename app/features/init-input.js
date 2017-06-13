const InitInput = (description, invalid = () => false, update, value) => ({
	invalid,
	description,
	validate: (...p) => !invalid(...p),
	update,
	value
});

export default InitInput;
