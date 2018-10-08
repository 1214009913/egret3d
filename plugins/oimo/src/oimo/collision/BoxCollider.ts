namespace egret3d.oimo {
    /**
     * 
     */
    @paper.requireComponent(Rigidbody)
    export class BoxCollider extends BaseCollider {
        public readonly colliderType: ColliderType = ColliderType.Box;

        @paper.serializedField
        protected readonly _size: Vector3 = Vector3.ONE.clone();

        protected _createShape() {
            const config = this._updateConfig();
            config.geometry = new OIMO.BoxGeometry(Vector3.create().multiplyScalar(0.5, this._size).release() as any);

            const shape = new OIMO.Shape(config);
            shape.userData = this;

            return shape;
        }
        /**
         * 
         */
        public get size() {
            return this._size;
        }
        public set size(value: Readonly<IVector3>) {
            if (this._oimoShape) {
                console.warn("Cannot change the size after the collider has been created.");
            }
            else {
                this._size.copy(value);
            }
        }
    }
}