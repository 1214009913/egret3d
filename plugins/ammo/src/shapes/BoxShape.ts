namespace egret3d.ammo {
    /**
     * 
     */
    export class BoxShape extends CollisionShape {
        @paper.serializedField
        protected readonly _size: Vector3 = Vector3.ONE.clone();
        @paper.serializedField
        protected readonly _scale: Vector3 = Vector3.ONE.clone();

        protected _createCollisionShape() {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._size.x * 0.5, this._size.y * 0.5, this._size.z * 0.5);
            const btCollisionShape = new Ammo.btBoxShape(btVector3);
            btCollisionShape.setMargin(this._margin);
            this._updateScale(btCollisionShape);

            return btCollisionShape;
        }

        protected _updateScale(btCollisionShape: Ammo.btCollisionShape) {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._scale.x, this._scale.y, this._scale.z);
            btCollisionShape.setLocalScaling(btVector3);
        }
        /**
         * 
         */
        public get size(): Readonly<Vector3> {
            return this._size;
        }
        public set size(value: Readonly<Vector3>) {
            if (this._btCollisionShape) {
                console.warn("Cannot change the size after the collision shape has been created.\nSize is only the initial value.\nUse scale to change the shape of a collision shape.");
            }
            else {
                this._size.copy(value);
            }
        }
        /**
         * 
         */
        public get scale(): Readonly<Vector3> {
            return this._scale;
        }
        public set scale(value: Readonly<Vector3>) {
            this._scale.copy(value);

            if (this._btCollisionShape) {
                this._updateScale(this._btCollisionShape);
            }
        }
    }
}