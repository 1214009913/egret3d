namespace egret3d.particle {
    export const enum ParticleCompEventType {
        MainChanged = "mainChanged",
        ColorChanged = "colorChanged",
        VelocityChanged = "velocityChanged",
        SizeChanged = "sizeChanged",
        RotationChanged = "rotationChanged",
        TextureSheetChanged = "textureSheetChanged",
        ShapeChanged = "shapeChanged",
        StartRotation3DChanged = "rotation3DChanged",
        SimulationSpaceChanged = "simulationSpace",
        ScaleModeChanged = "scaleMode",
        MaxParticlesChanged = "maxParticles"
    }

    export class ParticleComponent extends paper.BaseComponent {
        //主模块
        @paper.serializedField
        public readonly main: MainModule = new MainModule(this);
        //发射模块
        @paper.serializedField
        public readonly emission: EmissionModule = new EmissionModule(this);
        //发射形状模块
        @paper.serializedField
        public readonly shape: ShapeModule = new ShapeModule(this);
        //速率变换模块
        @paper.serializedField
        public readonly velocityOverLifetime: VelocityOverLifetimeModule = new VelocityOverLifetimeModule(this);
        //旋转变换模块
        @paper.serializedField
        public readonly rotationOverLifetime: RotationOverLifetimeModule = new RotationOverLifetimeModule(this);
        //尺寸变化模块
        @paper.serializedField
        public readonly sizeOverLifetime: SizeOverLifetimeModule = new SizeOverLifetimeModule(this);
        //颜色变化模块
        @paper.serializedField
        public readonly colorOverLifetime: ColorOverLifetimeModule = new ColorOverLifetimeModule(this);
        //序列帧变化模块
        @paper.serializedField
        public readonly textureSheetAnimation: TextureSheetAnimationModule = new TextureSheetAnimationModule(this);
        /**
         * @internal
         */
        public _isPlaying: boolean = false;
        /**
         * @internal
         */
        public _isPaused: boolean = false;
        private readonly _batcher: ParticleBatcher = new ParticleBatcher();
        /**
         * @internal
         */
        public _clean() {
            //
            this._batcher.clean();
            this._isPlaying = false;
            this._isPaused = false;
        }
        /**
         * @internal 
         */
        public uninitialize() {
            super.uninitialize();
            this._clean();
        }
        /**
         * @internal 
         */
        public initialize() {
            super.initialize();
            this._clean();
        }
        /**
         * @internal 
         */
        public initBatcher() {
            this._clean();
            this._batcher.init(this, this.gameObject.getComponent(ParticleRenderer)!);
        }
        /**
         * @internal 
         */
        public update(elapsedTime: number) {
            this._batcher.update(elapsedTime);
        }

        public play(withChildren: boolean = true): void {
            if (this._isPaused) {
                this._isPaused = false;
            } else {
                this._isPlaying = true;
                this._isPaused = false;
                this._batcher.resetTime();
            }
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.play(withChildren);
                    }
                }
            }
        }

        public pause(withChildren: boolean = true): void {
            this._isPaused = true;
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.pause(withChildren);
                    }
                }
            }
        }

        public stop(withChildren: boolean = true): void {
            this._isPlaying = false;
            this._batcher.resetTime();
            //
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.stop(withChildren);
                    }
                }
            }
        }

        public clear(withChildren: boolean = true) {
            if (withChildren) {
                const children = this.gameObject.transform.children;
                for (const child of children) {
                    const particleComp = child.gameObject.getComponent(ParticleComponent);
                    if (particleComp && particleComp.isActiveAndEnabled) {
                        particleComp.stop(withChildren);
                    }
                }
            }
        }

        public get loop(): boolean {
            return this.main.loop;
        }
        public get isPlaying(): boolean {
            return this._isPlaying;
        }
        public get isPaused(): boolean {
            return this._isPaused;
        }
        public get isAlive(): boolean {
            return this._batcher.aliveParticleCount > 0 || this._isPlaying;
        }
    }
}