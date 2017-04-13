export const map = (thing, cb) =>
	(Array.isArray(thing)
		? thing.map((v, i) => cb(v, i))
		: [cb(thing, 0)]);

export const flatten = (ary) => ary.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []); // http://stackoverflow.com/a/27267762/3873452
