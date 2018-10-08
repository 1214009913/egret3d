namespace egret3d.ammo {
    /**
     * 
     */
    export class PhysicsSystem extends paper.BaseSystem {
        private static _helpVector3A: Ammo.btVector3 | null = null;
        private static _helpVector3B: Ammo.btVector3 | null = null;
        private static _helpVector3C: Ammo.btVector3 | null = null;
        private static _helpVector3D: Ammo.btVector3 | null = null;
        private static _helpQuaternionA: Ammo.btQuaternion | null = null;
        private static _helpTransformA: Ammo.btTransform | null = null;
        private static _helpTransformB: Ammo.btTransform | null = null;

        /**
         * @internal
         */
        public static get helpVector3A(): Ammo.btVector3 {
            if (!this._helpVector3A) {
                this._helpVector3A = new Ammo.btVector3();
            }

            return this._helpVector3A;
        }
        /**
         * @internal
         */
        public static get helpVector3B(): Ammo.btVector3 {
            if (!this._helpVector3B) {
                this._helpVector3B = new Ammo.btVector3();
            }

            return this._helpVector3B;
        }
        /**
         * @internal
         */
        public static get helpVector3C(): Ammo.btVector3 {
            if (!this._helpVector3C) {
                this._helpVector3C = new Ammo.btVector3();
            }

            return this._helpVector3C;
        }
        /**
         * @internal
         */
        public static get helpVector3D(): Ammo.btVector3 {
            if (!this._helpVector3D) {
                this._helpVector3D = new Ammo.btVector3();
            }

            return this._helpVector3D;
        }
        /**
         * @internal
         */
        public static get helpQuaternionA(): Ammo.btQuaternion {
            if (!this._helpQuaternionA) {
                this._helpQuaternionA = new Ammo.btQuaternion();
            }

            return this._helpQuaternionA;
        }
        /**
         * @internal
         */
        public static get helpTransformA(): Ammo.btTransform {
            if (!this._helpTransformA) {
                this._helpTransformA = new Ammo.btTransform();
            }

            return this._helpTransformA;
        }
        /**
         * @internal
         */
        public static get helpTransformB(): Ammo.btTransform {
            if (!this._helpTransformB) {
                this._helpTransformB = new Ammo.btTransform();
            }

            return this._helpTransformB;
        }

        protected readonly _interests = [
            {
                componentClass: Rigidbody
            },
            {
                componentClass: [BoxShape, CapsuleShape, ConeShape, ConvexHullShape, CylinderShape, HeightfieldTerrainShape, SphereShape],
                type: paper.InterestType.Unessential
            },
            {
                componentClass: [FixedConstraint, SliderConstraint, HingeConstraint, ConeTwistConstraint],
                type: paper.InterestType.Unessential
            },
        ];

        private _worldType: Ammo.WorldType = Ammo.WorldType.RigidBodyDynamics; // TODO
        private _collisionType: Ammo.CollisionConfType = Ammo.CollisionConfType.DefaultDynamicsWorldCollisionConf; // TODO
        private _broadphaseType: Ammo.BroadphaseType = Ammo.BroadphaseType.DynamicAABBBroadphase; // TODO
        private readonly _axis3SweepBroadphaseMin: Vector3 = new Vector3(-1000.0, -1000.0, -1000.0); // TODO
        private readonly _axis3SweepBroadphaseMax: Vector3 = new Vector3(1000.0, 1000.0, 1000.0); // TODO
        private readonly _gravity: Vector3 = new Vector3(0.0, -9.8, 0.0);
        private _btCollisionWorld: Ammo.btCollisionWorld = null as any;
        private _btDynamicsWorld: Ammo.btDynamicsWorld | null = null;
        // // TODO 完善系统生命周期
        // private readonly _startGameObjects: paper.GameObject[] = [];
        // private readonly _constraints: TypedConstraint[] = [];

        // protected _onAddComponent(component: CollisionShape | CollisionObject) {
        //     if (!super._onAddComponent(component)) {
        //         return false;
        //     }

        //     if (this._startGameObjects.indexOf(component.gameObject) < 0) {
        //         this._startGameObjects.push(component.gameObject);
        //     }

        //     return true;
        // }

        // protected _onRemoveComponent(component: CollisionShape | CollisionObject) {
        //     if (!super._onRemoveComponent(component)) {
        //         return false;
        //     }

        //     const index = this._startGameObjects.indexOf(component.gameObject);
        //     if (index >= 0) {
        //         this._startGameObjects.splice(index, 1);
        //     }
        //     else {
        //         const collisionObject = this._getComponent(component.gameObject, 1) as CollisionObject;
        //         this._btCollisionWorld.removeCollisionObject(collisionObject.btCollisionObject);
        //     }

        //     return true;
        // }

        protected _updateGravity() {
            const btVector3 = PhysicsSystem.helpVector3A;
            btVector3.setValue(this._gravity.x, this._gravity.y, this._gravity.z);
            (this._btDynamicsWorld as Ammo.btDynamicsWorld).setGravity(btVector3);
        }

        public onAwake() {
            const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
            const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
            const broadphase = new Ammo.btDbvtBroadphase();
            const solver = new Ammo.btSequentialImpulseConstraintSolver();
            this._btCollisionWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
            // 
            this._btDynamicsWorld = this._btCollisionWorld as Ammo.btDiscreteDynamicsWorld;

            if (this._btDynamicsWorld) {
                this._updateGravity();
            }

            // // TODO 完善约束初始化机制。
            // const constraintClasses = [
            //     FixedConstraint,
            //     SliderConstraint,
            //     HingeConstraint,
            //     ConeTwistConstraint,
            // ];

            // for (const constraintClass of constraintClasses) {
            //     paper.EventPool.addEventListener(paper.EventPool.EventType.Enabled, constraintClass as any, (component: TypedConstraint) => {
            //         if (this._constraints.indexOf(component) < 0) {
            //             this._constraints.push(component);
            //         }
            //     });
            //     paper.EventPool.addEventListener(paper.EventPool.EventType.Disabled, constraintClass as any, (component: TypedConstraint) => {
            //         const index = this._constraints.indexOf(component);
            //         const btTypedConstraint = component.btTypedConstraint;

            //         if (index >= 0) {
            //             this._constraints.splice(index, 1);
            //         }
            //         else if (this._btDynamicsWorld && btTypedConstraint) {
            //             this._btDynamicsWorld.removeConstraint(btTypedConstraint);
            //         }
            //     });
            // }
        }

        public onAddGameObject(gameObject: paper.GameObject, group: paper.GameObjectGroup) {
            const rigidbody = gameObject.getComponent(Rigidbody) as Rigidbody;
            const collisionShape = gameObject.getComponent(CollisionShape as any) as CollisionShape;
            const btCollisionObject = rigidbody.btCollisionObject;
            const btCollisionShape = collisionShape.btCollisionShape;
            btCollisionObject.setCollisionShape(btCollisionShape);

            switch (this._worldType) {
                // case Ammo.WorldType.CollisionOnly:
                //     this._btCollisionWorld.addCollisionObject(btCollisionObject, collisionObject.collisionGroups, collisionObject.collisionMask);
                //     break;

                case Ammo.WorldType.RigidBodyDynamics:
                    if (rigidbody.collisionObjectType & Ammo.CollisionObjectTypes.RigidBody) {
                        rigidbody._updateMass();
                        this._btDynamicsWorld!.addRigidBody((rigidbody).btRigidbody, rigidbody.collisionGroups, rigidbody.collisionMask);
                    }
                    else {
                        this._btCollisionWorld.addCollisionObject(btCollisionObject, rigidbody.collisionGroups, rigidbody.collisionMask);
                    }
                    break;

                case Ammo.WorldType.MultiBodyWorld:
                    // TODO
                    break;

                case Ammo.WorldType.SoftBodyAndRigidBody:
                    // TODO
                    break;
            }
        }

        public onAddComponent(component: CollisionShape | TypedConstraint, group: paper.GameObjectGroup) {
            if (group !== this._groups[0]) {
                return;
            }

            // if (this._startGameObjects.length > 0) {
            //     for (const gameObject of this._startGameObjects) {
            //         const collisionObject = this._getComponent(gameObject, 1) as CollisionObject;
            //         const collisionShape = this._getComponent(gameObject, 0) as CollisionShape;
            //         const btCollisionObject = collisionObject.btCollisionObject;
            //         const btCollisionShape = collisionShape.btCollisionShape;
            //         btCollisionObject.setCollisionShape(btCollisionShape);

            //         switch (this._worldType) {
            //             case Ammo.WorldType.CollisionOnly:
            //                 this._btCollisionWorld.addCollisionObject(btCollisionObject, collisionObject.collisionGroups, collisionObject.collisionMask);
            //                 break;

            //             case Ammo.WorldType.RigidBodyDynamics:
            //                 if (this._btDynamicsWorld) {
            //                     if (collisionObject.collisionObjectType & Ammo.CollisionObjectTypes.RigidBody) {
            //                         (collisionObject as Rigidbody)._updateMass();
            //                         this._btDynamicsWorld.addRigidBody((collisionObject as Rigidbody).btRigidbody, collisionObject.collisionGroups, collisionObject.collisionMask);
            //                     }
            //                     else {
            //                         this._btCollisionWorld.addCollisionObject(btCollisionObject, collisionObject.collisionGroups, collisionObject.collisionMask);
            //                     }
            //                 }
            //                 else {
            //                     throw new Error("Arguments error.");
            //                 }
            //                 break;

            //             case Ammo.WorldType.MultiBodyWorld:
            //                 // TODO
            //                 break;

            //             case Ammo.WorldType.SoftBodyAndRigidBody:
            //                 // TODO
            //                 break;
            //         }
            //     }

            //     this._startGameObjects.length = 0;
            // }

            // if (this._constraints.length > 0) {
            //     for (const constraint of this._constraints) {
            //         const btTypedConstraint = constraint.btTypedConstraint;
            //         if (this._btDynamicsWorld && btTypedConstraint) {
            //             this._btDynamicsWorld.addConstraint(btTypedConstraint, !constraint.collisionEnabled);
            //         }
            //     }

            //     this._constraints.length = 0;
            // }
        }

        // public onRemoveComponent(component: BaseCollider | Joint<any>, group: paper.GameObjectGroup) {
        //     if (group !== this._groups[0]) {
        //         return;
        //     }

        //     if (component instanceof BaseCollider) {
        //         const rigidbody = component.gameObject.getComponent(Rigidbody) as Rigidbody;
        //         if ((component.oimoShape as any)._rigidBody) {
        //             rigidbody.oimoRigidbody.removeShape(component.oimoShape);
        //         }
        //         // rigidbody._updateMass(rigidbody.oimoRigidbody);
        //     }
        //     else if (component instanceof Joint) {
        //         this._oimoWorld.removeJoint(component.oimoJoint);
        //     }
        // }

        // public onRemoveGameObject(gameObject: paper.GameObject, group: paper.GameObjectGroup) {
        //     const rigidbody = gameObject.getComponent(Rigidbody) as Rigidbody;

        //     for (const joint of gameObject.getComponents(Joint as any, true) as Joint<any>[]) {
        //         this._oimoWorld.removeJoint(joint.oimoJoint);
        //     }

        //     this._oimoWorld.removeRigidBody(rigidbody.oimoRigidbody);
        // }

        public onUpdate(deltaTime: number) {
            // let currentTimes = 0; TODO
            // let fixedTime = this._clock.fixedTime;
            const gameObjects = this._groups[0].gameObjects;
            const helpTransformA = PhysicsSystem.helpTransformA;

            // for (const gameObject of gameObjects) {
            //     const transform = gameObject.transform;
            //     const rigidbody = gameObject.getComponent(Rigidbody)!;
            //     const collisionFlags = rigidbody.collisionFlags;

            //     if (collisionFlags & (Ammo.CollisionFlags.StaticObject | Ammo.CollisionFlags.KinematicObject)) {
            //         const motionState = rigidbody.btRigidbody.getMotionState()!;
            //         motionState.getWorldTransform(helpTransformA);
            //         const t = helpTransformA.getOrigin();
            //         const r = helpTransformA.getRotation();
            //         transform.setPosition(t.x(), t.y(), t.z());
            //         transform.setRotation(r.x(), r.y(), r.z(), r.w());
            //     }
            // }

            this._btDynamicsWorld!.stepSimulation(deltaTime, this._clock.maxFixedSubSteps, this._clock.fixedDeltaTime);

            for (const gameObject of gameObjects) {
                const transform = gameObject.transform;
                const rigidbody = gameObject.getComponent(Rigidbody)!;
                // const collisionFlags = rigidbody.collisionFlags;

                if (rigidbody.isDynamic()) {
                    const motionState = rigidbody.btRigidbody.getMotionState()!;
                    motionState.getWorldTransform(helpTransformA);
                    const t = helpTransformA.getOrigin();
                    const r = helpTransformA.getRotation();
                    transform.setPosition(t.x(), t.y(), t.z());
                    transform.setRotation(r.x(), r.y(), r.z(), r.w());
                }
            }
        }
        /**
         * 
         */
        // public rayTest(
        //     from: Readonly<Vector3>, to: Readonly<Vector3>,
        //     group: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.DefaultFilter, mask: Ammo.CollisionFilterGroups = Ammo.CollisionFilterGroups.AllFilter,
        // ) {
        //     const rayResult = new Ammo.ClosestRayResultCallback();
        //     const rayFrom = (rayResult as any).get_m_rayFromWorld() as Ammo.btVector3;
        //     const rayTo = (rayResult as any).get_m_rayToWorld() as Ammo.btVector3;
        //     (rayResult as any).set_m_collisionFilterGroup(group);
        //     (rayResult as any).set_m_collisionFilterMask(mask);
        //     rayFrom.setValue(from.x, from.y, from.z);
        //     rayTo.setValue(to.x, to.y, to.z);
        //     this._btCollisionWorld.rayTest(rayFrom, rayTo, rayResult);
        //     if (rayResult.hasHit()) {
        //         const raycastInfo = PhysicsSystem._raycastInfoPool.get() || new RaycastInfo();
        //         // raycastInfo.clean(); TODO cache
        //         // PhysicsSystem._raycastInfoPool.add(raycastInfo);

        //         const btCollisionObject = (rayResult as any).get_m_collisionObject() as Ammo.btCollisionObject;
        //         const position = (rayResult as any).get_m_hitPointWorld() as Ammo.btVector3;
        //         const normal = (rayResult as any).get_m_hitNormalWorld() as Ammo.btVector3;
        //         raycastInfo.collisionObject = (Ammo as any).castObject(btCollisionObject.getUserPointer(), Ammo.btVector3).egretComponent as CollisionObject;
        //         raycastInfo.transform = raycastInfo.collisionObject.gameObject.transform;
        //         raycastInfo.position.set(position.x(), position.y(), position.z());
        //         raycastInfo.normal.set(normal.x(), normal.y(), normal.z());
        //         raycastInfo.distance = from.getDistance(raycastInfo.position); // distance 是否应该惰性计算。
        //         Ammo.destroy(rayResult);

        //         return raycastInfo;
        //     }

        //     Ammo.destroy(rayResult);

        //     return null;
        // }
        /**
         * 
         */
        public get gravity(): Readonly<Vector3> {
            return this._gravity;
        }
        public set gravity(value: Readonly<Vector3>) {
            this._gravity.copy(value);

            if (this._btDynamicsWorld) {
                this._updateGravity();
            }
        }

        public get btCollisionWorld() {
            return this._btCollisionWorld;
        }

        public get btDynamicsWorld() {
            return this._btDynamicsWorld;
        }
    }
}
