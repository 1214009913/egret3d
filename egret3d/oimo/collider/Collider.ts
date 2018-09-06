namespace egret3d.oimo {
    /**
     * 
     */
    export enum GeometryType {
        Box = OIMO.GeometryType.BOX,
        Sphere = OIMO.GeometryType.SPHERE,
        Cylinder = OIMO.GeometryType.CYLINDER,
        Cone = OIMO.GeometryType.CONE,
        Capsule = OIMO.GeometryType.CAPSULE,
        ConvexHull = OIMO.GeometryType.CONVEX_HULL,
    }

    const enum ValueType {
        CollisionGroup,
        CollisionMask,
        Friction,
        Restitution,
        Density,
    }
    /**
     * 
     */
    export abstract class Collider extends paper.BaseComponent {
        protected static readonly _config: OIMO.ShapeConfig = new OIMO.ShapeConfig();

        public readonly geometryType: GeometryType;
        /**
         * [Type, Mass, LinearDamping, AngularDamping];
         */
        @paper.serializedField
        protected readonly _values: Float32Array = new Float32Array([
            paper.CullingMask.Everything, paper.CullingMask.Everything, OIMO.Setting.defaultFriction, OIMO.Setting.defaultRestitution, OIMO.Setting.defaultDensity,
        ]);
        protected _oimoShape: OIMO.Shape = null as any;

        protected abstract _createShape(): OIMO.Shape;

        protected _updateConfig() {
            const config = Collider._config;
            config.collisionGroup = this.collisionGroup;
            config.collisionMask = this.collisionMask;
            config.friction = this.friction;
            config.restitution = this.restitution;
            config.density = this.density;

            return config;
        }
        /**
         * 
         */
        public get collisionGroup() {
            return this._values[ValueType.CollisionGroup];
        }
        public set collisionGroup(value: paper.CullingMask) {
            if (this._values[ValueType.CollisionGroup] === value) {
                return;
            }

            this._values[ValueType.CollisionGroup] = value;

            if (this._oimoShape) {
                this._oimoShape.setCollisionGroup(value);
            }
        }
        /**
         * 
         */
        public get collisionMask() {
            return this._values[ValueType.CollisionMask];
        }
        public set collisionMask(value: paper.CullingMask) {
            if (this._values[ValueType.CollisionMask] === value) {
                return;
            }

            this._values[ValueType.CollisionMask] = value;

            if (this._oimoShape) {
                this._oimoShape.setCollisionMask(value);
            }
        }
        /**
         * 
         */
        public get friction() {
            return this._values[ValueType.Friction];
        }
        public set friction(value: number) {
            if (this._values[ValueType.Friction] === value) {
                return;
            }

            this._values[ValueType.Friction] = value;

            if (this._oimoShape) {
                this._oimoShape.setFriction(value);
            }
        }
        /**
         * 
         */
        public get restitution() {
            return this._values[ValueType.Restitution];
        }
        public set restitution(value: number) {
            if (this._values[ValueType.Restitution] === value) {
                return;
            }

            this._values[ValueType.Restitution] = value;

            if (this._oimoShape) {
                this._oimoShape.setRestitution(value);
            }
        }
        /**
         * 
         */
        public get density() {
            return this._values[ValueType.Density];
        }
        public set density(value: number) {
            if (this._values[ValueType.Density] === value) {
                return;
            }

            this._values[ValueType.Density] = value;

            if (this._oimoShape) {
                this._oimoShape.setDensity(value);
            }
        }
        /**
         * 
         */
        public get oimoShape() {
            if (!this._oimoShape) {
                this._oimoShape = this._createShape();
            }

            return this._oimoShape;
        }
    }
}