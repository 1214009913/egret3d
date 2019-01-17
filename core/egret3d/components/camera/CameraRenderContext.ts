namespace egret3d {

    const enum LightSize {
        Directional = 11,
        Spot = 18,
        RectangleArea = 12,
        Point = 15,
        Hemisphere = 9,
    }

    const enum ShadowSize {
        Directional = 16,
        Spot = 16,
        Point = 16,
    }

    const _helpVector3 = Vector3.create();
    /**
     * 相机渲染上下文。
     */
    export class CameraRenderContext {
        /**
         * 
         */
        public logDepthBufFC: number = 0.0;
        /**
         * 
         */
        public readonly defines: egret3d.Defines = new egret3d.Defines();
        /**
         * 
         */
        public readonly camera: Camera = null!;
        /**
         * 12: dirX, dirY, dirZ, colorR, colorG, colorB, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
         * @internal
         */
        public directLightBuffer: Float32Array = new Float32Array(0);
        /**
         * 18: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
         * @internal
         */
        public spotLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public rectangleAreaLightBuffer: Float32Array = new Float32Array(0);
        /**
         * 16: x, y, z, colorR, colorG, colorB, distance, decay, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY, shadowCameraNear, shadowCameraFar,
         * @internal
         */
        public pointLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public hemisphereLightBuffer: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public directShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public pointShadowMatrix: Float32Array = new Float32Array(0);
        /**
         * @internal
         */
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        /**
         * @internal
         */
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];
        /**
         * @internal
         */
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];

        private readonly _drawCallCollecter: DrawCallCollecter = paper.GameObject.globalGameObject.getComponent(DrawCallCollecter)!;
        private readonly _cameraAndLightCollecter: CameraAndLightCollecter = paper.GameObject.globalGameObject.getComponent(CameraAndLightCollecter)!;
        /**
         * 此帧的非透明绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly opaqueCalls: DrawCall[] = [];
        /**
         * 此帧的透明绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly transparentCalls: DrawCall[] = [];
        /**
         * 此帧的阴影绘制信息列表。
         * - 已进行视锥剔除的。
         * @internal
         */
        public readonly shadowCalls: DrawCall[] = [];
        /**
         * 禁止实例化。
         */
        public constructor(camera: Camera) {
            this.camera = camera;
        }
        /**
         * 所有非透明的, 按照从近到远排序
         */
        private _sortOpaque(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA.renderQueue !== materialB.renderQueue) {
                return materialA.renderQueue - materialB.renderQueue;
            }
            else if (materialA._technique.program !== materialB._technique.program) {
                return materialA._technique.program! - materialB._technique.program!;
            }
            else if (materialA._id !== materialB._id) {
                return materialA._id - materialB._id;
            }
            else {
                return a.zdist - b.zdist;
            }
        }
        /**
         * 所有透明的，按照从远到近排序
         */
        private _sortFromFarToNear(a: DrawCall, b: DrawCall) {
            const materialA = a.material!;
            const materialB = b.material!;

            if (materialA.renderQueue === materialB.renderQueue) {
                return b.zdist - a.zdist;
            }
            else {
                return materialA.renderQueue - materialB.renderQueue;
            }
        }

        private _shadowFrustumCulling() {
            const camera = this.camera;
            const cameraFrustum = camera.frustum;
            const shadowDrawCalls = this.shadowCalls;
            shadowDrawCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;
                if (
                    renderer.castShadows &&
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    shadowDrawCalls.push(drawCall!);
                }
            }

            shadowDrawCalls.sort(this._sortFromFarToNear);
        }

        private _frustumCulling() {
            const camera = this.camera;
            const cameraPosition = camera.gameObject.transform.position;
            const cameraFrustum = camera.frustum;
            const opaqueCalls = this.opaqueCalls;
            const transparentCalls = this.transparentCalls;

            opaqueCalls.length = 0;
            transparentCalls.length = 0;

            for (const drawCall of this._drawCallCollecter.drawCalls) {
                const renderer = drawCall!.renderer!;
                if (
                    (camera.cullingMask & renderer.gameObject.layer) !== 0 &&
                    (!renderer.frustumCulled || math.frustumIntersectsSphere(cameraFrustum, renderer.boundingSphere))
                ) {
                    // if (drawCall.material.renderQueue >= paper.RenderQueue.Transparent && drawCall.material.renderQueue <= paper.RenderQueue.Overlay) {
                    if (drawCall!.material!.renderQueue >= RenderQueue.Mask) {
                        transparentCalls.push(drawCall!);
                    }
                    else {
                        opaqueCalls.push(drawCall!);
                    }

                    drawCall!.zdist = renderer.gameObject.transform.position.getDistance(cameraPosition);
                }
            }

            opaqueCalls.sort(this._sortOpaque);
            transparentCalls.sort(this._sortFromFarToNear);
        }

        private _updateLights() {
            const { directionalLights, spotLights, rectangleAreaLights, pointLights, hemisphereLights } = this._cameraAndLightCollecter;
            const directLightCount = directionalLights.length;
            const spotLightCount = spotLights.length;
            const rectangleAreaLightCount = rectangleAreaLights.length;
            const pointLightCount = pointLights.length;
            const hemisphereLightCount = hemisphereLights.length;
            renderState.castShadows = false;
            //
            if (this.directLightBuffer.length !== directLightCount * LightSize.Directional) {
                this.directLightBuffer = new Float32Array(directLightCount * LightSize.Directional);
            }

            if (this.spotLightBuffer.length !== spotLightCount * LightSize.Spot) {
                this.spotLightBuffer = new Float32Array(spotLightCount * LightSize.Spot);
            }

            if (this.rectangleAreaLightBuffer.length !== rectangleAreaLightCount * LightSize.RectangleArea) {
                this.rectangleAreaLightBuffer = new Float32Array(rectangleAreaLightCount * LightSize.RectangleArea);
            }

            if (this.pointLightBuffer.length !== pointLightCount * LightSize.Point) {
                this.pointLightBuffer = new Float32Array(pointLightCount * LightSize.Point);
            }

            if (this.hemisphereLightBuffer.length !== hemisphereLightCount * LightSize.Hemisphere) {
                this.hemisphereLightBuffer = new Float32Array(hemisphereLightCount * LightSize.Hemisphere);
            }
            //
            if (this.directShadowMatrix.length !== directLightCount * ShadowSize.Directional) {
                this.directShadowMatrix = new Float32Array(directLightCount * ShadowSize.Directional);
            }

            if (this.spotShadowMatrix.length !== spotLightCount * ShadowSize.Spot) {
                this.spotShadowMatrix = new Float32Array(spotLightCount * ShadowSize.Spot);
            }

            if (this.pointShadowMatrix.length !== pointLightCount * ShadowSize.Point) {
                this.pointShadowMatrix = new Float32Array(pointLightCount * ShadowSize.Point);
            }
            //
            const {
                directLightBuffer, spotLightBuffer, rectangleAreaLightBuffer, pointLightBuffer, hemisphereLightBuffer,
                directShadowMatrix, spotShadowMatrix, pointShadowMatrix,
                directShadowMaps, spotShadowMaps, pointShadowMaps,
            } = this;

            if (directShadowMaps.length !== directLightCount) {
                directShadowMaps.length = directLightCount;
            }

            if (spotShadowMaps.length !== spotLightCount) {
                spotShadowMaps.length = spotLightCount;
            }

            if (pointShadowMaps.length !== pointLightCount) {
                pointShadowMaps.length = pointLightCount;
            }

            let index = 0, shadowIndex = 0, offset = 0;
            const helpVector3 = _helpVector3;
            const worldToCameraMatrix = this.camera.worldToCameraMatrix;

            for (const light of directionalLights) {
                const intensity = light.intensity;
                const color = light.color;
                offset = (index++) * LightSize.Directional;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                directLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                directLightBuffer[offset++] = -helpVector3.y;
                directLightBuffer[offset++] = -helpVector3.z;
                //
                directLightBuffer[offset++] = color.r * intensity;
                directLightBuffer[offset++] = color.g * intensity;
                directLightBuffer[offset++] = color.b * intensity;
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    directLightBuffer[offset++] = 1;
                    directLightBuffer[offset++] = shadow.bias;
                    directLightBuffer[offset++] = shadow.radius;
                    directLightBuffer[offset++] = shadow.textureSize;
                    directLightBuffer[offset++] = shadow.textureSize;
                    directShadowMatrix.set(shadow.matrix.rawData, shadowIndex * ShadowSize.Directional);
                    directShadowMaps[shadowIndex++] = shadow.renderTarget;
                    renderState.castShadows = true;
                }
                else {
                    directLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of spotLights) {
                const intensity = light.intensity;
                const distance = light.distance;
                const color = light.color;
                offset = (index++) * LightSize.Spot;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                spotLightBuffer[offset++] = helpVector3.x;
                spotLightBuffer[offset++] = helpVector3.y;
                spotLightBuffer[offset++] = helpVector3.z;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                spotLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                spotLightBuffer[offset++] = -helpVector3.y;
                spotLightBuffer[offset++] = -helpVector3.z;
                //
                spotLightBuffer[offset++] = color.r * intensity;
                spotLightBuffer[offset++] = color.g * intensity;
                spotLightBuffer[offset++] = color.b * intensity;
                //
                spotLightBuffer[offset++] = distance;
                spotLightBuffer[offset++] = distance === 0 ? 0 : light.decay;
                spotLightBuffer[offset++] = Math.cos(light.angle);
                spotLightBuffer[offset++] = Math.cos(light.angle * (1.0 - light.penumbra));
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    spotLightBuffer[offset++] = 1;
                    spotLightBuffer[offset++] = shadow.bias;
                    spotLightBuffer[offset++] = shadow.radius;
                    spotLightBuffer[offset++] = shadow.textureSize;
                    spotLightBuffer[offset++] = shadow.textureSize;
                    spotShadowMatrix.set(shadow.matrix.rawData, shadowIndex * ShadowSize.Spot);
                    spotShadowMaps[shadowIndex++] = shadow.renderTarget;
                    renderState.castShadows = true;
                }
                else {
                    spotLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of rectangleAreaLights) {
                const intensity = light.intensity;
                const color = light.color;
                offset = (index++) * LightSize.RectangleArea;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                rectangleAreaLightBuffer[offset++] = helpVector3.x;
                rectangleAreaLightBuffer[offset++] = helpVector3.y;
                rectangleAreaLightBuffer[offset++] = helpVector3.z;
                //
                rectangleAreaLightBuffer[offset++] = color.r * intensity;
                rectangleAreaLightBuffer[offset++] = color.g * intensity;
                rectangleAreaLightBuffer[offset++] = color.b * intensity;
                // TODO
                light.castShadows = false;//TODO 不支持阴影，防止贴图报错
            }

            index = shadowIndex = 0;
            for (const light of pointLights) {
                const intensity = light.intensity;
                const distance = light.distance;
                const color = light.color;
                offset = (index++) * LightSize.Point;
                //
                helpVector3.applyMatrix(worldToCameraMatrix, light.gameObject.transform.position);
                pointLightBuffer[offset++] = helpVector3.x;
                pointLightBuffer[offset++] = helpVector3.y;
                pointLightBuffer[offset++] = helpVector3.z;
                //
                pointLightBuffer[offset++] = color.r * intensity;
                pointLightBuffer[offset++] = color.g * intensity;
                pointLightBuffer[offset++] = color.b * intensity;
                //
                pointLightBuffer[offset++] = distance;
                pointLightBuffer[offset++] = distance === 0.0 ? 0.0 : light.decay;
                //
                if (light.castShadows) {
                    const shadow = light.shadow;
                    pointLightBuffer[offset++] = 1;
                    pointLightBuffer[offset++] = shadow.bias;
                    pointLightBuffer[offset++] = shadow.radius;
                    pointLightBuffer[offset++] = shadow.textureSize;
                    pointLightBuffer[offset++] = shadow.textureSize;
                    pointLightBuffer[offset++] = shadow.near;
                    pointLightBuffer[offset++] = shadow.far;

                    pointShadowMatrix.set(shadow.matrix.rawData, shadowIndex * ShadowSize.Point);
                    pointShadowMaps[shadowIndex++] = shadow.renderTarget;
                    renderState.castShadows = true;
                }
                else {
                    pointLightBuffer[offset++] = 0;
                }
            }

            index = shadowIndex = 0;
            for (const light of hemisphereLights) {
                const intensity = light.intensity;
                const color = light.color;
                const groundColor = light.groundColor;
                offset = (index++) * LightSize.Hemisphere;
                //
                light.gameObject.transform.getForward(helpVector3).applyDirection(worldToCameraMatrix);
                hemisphereLightBuffer[offset++] = -helpVector3.x; // Left-hand.
                hemisphereLightBuffer[offset++] = -helpVector3.y;
                hemisphereLightBuffer[offset++] = -helpVector3.z;
                //
                hemisphereLightBuffer[offset++] = color.r * intensity;
                hemisphereLightBuffer[offset++] = color.g * intensity;
                hemisphereLightBuffer[offset++] = color.b * intensity;
                //
                hemisphereLightBuffer[offset++] = groundColor.r * intensity;
                hemisphereLightBuffer[offset++] = groundColor.g * intensity;
                hemisphereLightBuffer[offset++] = groundColor.b * intensity;

                light.castShadows = false;//TODO 不支持阴影，防止贴图报错
            }
        }
        /**
         * @internal
         */
        public _update() {
            if (renderState.logarithmicDepthBuffer) {
                this.logDepthBufFC = 2.0 / (Math.log(this.camera.far + 1.0) / Math.LN2);
            }

            if (this._cameraAndLightCollecter.currentLight) {
                this._shadowFrustumCulling();
            }
            else {
                this._frustumCulling();
                this._updateLights();
            }
        }
    }
}
