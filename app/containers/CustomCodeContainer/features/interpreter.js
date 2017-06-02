import Interpreter from 'js-interpreter';
import NativeHelpers from './NativeHelpers';

export const create = (
	algorithm,
	algInput = {},
	frame = () => {},
	bindings = {},
	code,
) => new Interpreter(code, (ip, scp) => {
	const helper = new NativeHelpers(ip);

	ip.setProperty(scp, 'frame', helper.toInterpreter(frame), ip.READONLY_DESCRIPTOR);
	ip.setProperty(scp, 'input', helper.toInterpreter(algInput), ip.READONLY_DESCRIPTOR);
	ip.setProperty(scp, 'Algorithm', helper.toInterpreter(algorithm), ip.READONLY_DESCRIPTOR);

	Object.keys(bindings).forEach(binding => {
		ip.setProperty(scp, binding, helper.toInterpreter(bindings[binding]), ip.READONLY_DESCRIPTOR);
	});
});

export default create;
