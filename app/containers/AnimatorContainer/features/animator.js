export default class Animator {
	static calcInternalSpeed = (inComSpeed) => {
		let speed = inComSpeed;
		let internalSpeed;
		speed -= 50;
		speed /= 7;
		if (speed === 0) {
			internalSpeed = 1;
		} else if (speed < 0) {
			internalSpeed = (-1 * speed) + 1;
		} else if (speed > 0) {
			internalSpeed = 1 / (speed + 1);
		}
		return internalSpeed;
	}
	constructor(frames, setting, changeHandler, frameTime = 1) {
		Object.assign(this, { frames, setting, changeHandler, frameTime });

		this._init();
	}

	_init() {
		this.setting()('speed').default(50);

		this.speed = this.setting()('speed').get();
		this.progress = 0;
		this.directives = this.frames[0];
		this.isPaused = true;
		this.nextFrameTime = 1000 * this.frameTime;

		this.frameIndex = 0;
		this.internalSpeed = Animator.calcInternalSpeed(this.speed);

		this.didEnd = false;
	}

	refresh(frames) {
		this.frames = frames;

		this._init();
		this.changeHandler('speed');
	}

	getSpeed = () => this.speed
	getProgress = () => this.progress
	getDirectives = () => this.directives
	getIsPaused = () => this.isPaused
	getNextFrameTime = () => this.nextFrameTime

	toBegin = () => this.advanceTo(0)
	toEnd = () => this.advanceTo(this.frames.length - 1)
	stepForward = () => this.advance(1)
	stepBackward = () => this.advance(-1)
	pauseRestart = () => {
		this.isPaused = !this.isPaused;
		if (this.didEnd) {
			this.didEnd = false;
			return this.toBegin();
		}
		return this.changeHandler('pauseRestart');
	}

	changeSpeed = (sp = 50, setEvent) => {
		if (setEvent) {
			this.setting()('speed').set(this.speed);
			return;
		}
		let speed = sp;
		if (sp >= 100) { speed = 100; }
		if (sp <= 0) { speed = 0; }

		this.speed = speed;
		this.internalSpeed = Animator.calcInternalSpeed(speed);
		this.changeHandler('speed');
	}

	mount = () => {
		const timeout = fn => setTimeout(fn, this.nextFrameTime);
		const continuation = () => {
			this.nextFrameTime = Math.floor((this.frameTime * this.internalSpeed) * 1000);
			this.tick();
			this.timer = timeout(continuation);
		};
		this.timer = timeout(continuation);
	}

	unmount = () => {
		clearTimeout(this.timer);
	}

	tick() {
		if (this.isPaused) {
			return;
		}

		this.advance();
	}

	advance(step = 1) {
		return this.advanceTo(this.frameIndex + step);
	}

	advanceTo(frame) {
		this.didEnd = false;
		if (frame > this.frames.length - 1) {
			return;
		}

		this.directives = (frame > 0) ? this.frames[frame] : this.frames[0];
		this.frameIndex = (frame > 0) ? frame : 0;
		this.calculateProgress();
		if (this.progress === 100) {
			this.didEnd = true;
			this.isPaused = true;
			this.changeHandler('end');
			return;
		}
		this.changeHandler('advance');
	}

	calculateProgress() {
		this.progress = Math.round((this.frameIndex / (this.frames.length - 1)) * 100);
	}
}
