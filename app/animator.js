export default class Animator {
	constructor(frames, changeHandler, frameTime = 1) {
		Object.assign(this, { frames, changeHandler, frameTime });

		this.frameIndex = -1;
		this.internalSpeed = 1;

		this.didEnd = false;

		this.speed = 5;
		this.progress = 0;
		this.directives = {};
		this.isPaused = true;
	}

	getSpeed = () => this.speed
	getProgress = () => this.progress
	getDirectives = () => this.directives
	getIsPaused = () => this.isPaused

	toBegin = () => this.advanceTo(-1)
	toEnd = () => this.advanceTo(this.frames.length - 1)
	stepForward = () => this.advance(1)
	stepBackward = () => this.advance(-1)
	pauseRestart = () => {
		this.isPaused = !this.isPaused;
		if (this.didEnd) {
			this.didEnd = false;
			return this.toBegin();
		}
		return this.changeHandler();
	}

	changeSpeed = (sp = 5) => {
		let speed = sp;
		if (sp >= 10) { speed = 10; }
		if (sp <= 0) { speed = 0; }

		this.speed = speed;

		speed -= 5;
		if (speed === 0) {
			this.internalSpeed = 1;
		} else if (speed < 0) {
			this.internalSpeed = (-1 * speed) + 1;
		} else if (speed > 0) {
			this.internalSpeed = 1 / (speed + 1);
		}
		this.changeHandler();
	}

	mount = () => {
		const timeout = fn => setTimeout(fn, (this.frameTime * this.internalSpeed) * 1000);
		const continuation = () => {
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
			this.didEnd = true;
			this.isPaused = true;
			if (frame === this.frames.length) { // we must inform dumbs that animation is paused.
				this.changeHandler();
			}
			return;
		}

		this.directives = (frame !== -1) ? this.frames[frame] : {};
		this.frameIndex = frame;
		this.calculateProgress();
		this.changeHandler();
	}

	calculateProgress() {
		this.progress = Math.round((this.frameIndex / (this.frames.length - 1)) * 100);
	}
}
