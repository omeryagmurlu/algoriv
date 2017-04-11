export default class Animator {
	constructor(frames, pushDirectives, { frameTime = 1 }) {
		Object.assign(this, { frames, pushDirectives, frameTime });

		this.frameIndex = -1;
		this._speed = 1;
		this.isPaused = true;

		this.speed = 5;
		this.progress = 0;
		this.didEnd = false;
	}

	changeSpeed(sp = 5) {
		let speed = sp;
		if (sp >= 10) { speed = 10; }
		if (sp <= 0) { speed = 0; }
		this.speed = speed;

		speed -= 5;
		if (speed === 0) {
			this._speed = 1;
			return;
		}

		if (speed < 0) {
			this._speed = (-1 * speed) + 1;
			return;
		}

		if (speed > 0) {
			this._speed = 1 / (speed + 1);
		}
	}

	toBegin() {
		this.advanceTo(-1);
	}

	toEnd() {
		this.advanceTo(this.frames.length - 1);
	}

	stepForward() {
		this.advance();
	}

	stepBackward() {
		this.advance(-1);
	}

	pauseRestart() {
		this.isPaused = !this.isPaused;
		if (this.didEnd) {
			this.didEnd = false;
			this.toBegin();
		}
	}

	mount() {
		const timeout = fn => setTimeout(fn, (this.frameTime * this._speed) * 1000);
		const continuation = () => {
			this.tick();
			this.timer = timeout(continuation);
		};
		this.timer = timeout(continuation);
	}

	unmount() {
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
			return;
		}

		const payload = (frame !== -1) ? this.frames[frame] : {};

		this.frameIndex = frame;
		this.calculateProgress();
		this.pushDirectives(payload);
	}

	calculateProgress() {
		this.progress = Math.round((this.frameIndex / (this.frames.length - 1)) * 100);
	}
}
