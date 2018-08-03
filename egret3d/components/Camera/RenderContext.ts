namespace egret3d {

    let helpVec3_1: Vector3 = new Vector3();

    /**
     * 缓存场景通用数据
     * 包括矩阵信息，灯光，光照贴图，viewport尺寸等等
     */
    export class RenderContext {
        /**
         * 
         */
        public version: number = 0;
        /**
         * 
         */
        public lightCount: number = 0;
        public directLightCount: number = 0;
        public pointLightCount: number = 0;
        public spotLightCount: number = 0;
        /**
         * 
         */
        public lightmap: Texture | null = null;
        public lightmapUV: number = 1;
        public lightmapIntensity: number = 1.0;
        public lightmapOffset: Float32Array | null = null;

        public boneData: Float32Array | null = null;

        // 15: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public directLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, shadow, shadowBias, shadowRadius, shadowCameraNear, shadowCameraFar, shadowMapSizeX, shadowMapSizeY
        public pointLightArray: Float32Array = new Float32Array(0);
        // 19: x, y, z, dirX, dirY, dirZ, colorR, colorG, colorB, intensity, distance, decay, coneCos, penumbraCos, shadow, shadowBias, shadowRadius, shadowMapSizeX, shadowMapSizeY
        public spotLightArray: Float32Array = new Float32Array(0);
        public directShadowMatrix: Float32Array = new Float32Array(0);
        public spotShadowMatrix: Float32Array = new Float32Array(0);
        public readonly matrix_m: Matrix = new Matrix();
        public readonly matrix_mvp: Matrix = new Matrix();
        public readonly directShadowMaps: (WebGLTexture | null)[] = [];
        public readonly pointShadowMaps: (WebGLTexture | null)[] = [];
        public readonly spotShadowMaps: (WebGLTexture | null)[] = [];

        public readonly viewPortPixel: IRectangle = { x: 0, y: 0, w: 0, h: 0 };

        //
        public readonly cameraPosition: Float32Array = new Float32Array(3);
        public readonly cameraForward: Float32Array = new Float32Array(3);
        public readonly cameraUp: Float32Array = new Float32Array(3);


        // transforms
        public readonly matrix_v: Matrix = new Matrix();
        public readonly matrix_p: Matrix = new Matrix();
        public readonly matrix_mv: Matrix = new Matrix();
        public readonly matrix_vp: Matrix = new Matrix();
        //matrixNormal: paper.matrix = new paper.matrix();

        /**
         * 
         */
        public drawCall: DrawCall;

        public updateLightmap(texture: Texture, uv: number, offset: Float32Array, intensity: number) {
            if (this.lightmap !== texture) {
                this.lightmap = texture;
                this.version++;
            }

            if (this.lightmapUV !== uv) {
                this.lightmapUV = uv;
                this.version++;
            }

            if (this.lightmapOffset !== offset ||
                this.lightmapOffset[0] !== offset[0] ||
                this.lightmapOffset[1] !== offset[1] ||
                this.lightmapOffset[2] !== offset[2] ||
                this.lightmapOffset[3] !== offset[3]) {
                this.lightmapOffset = offset;
                this.version++;
            }

            if (this.lightmapIntensity !== intensity) {
                this.lightmapIntensity = intensity;
                this.version++;
            }
        }

        public updateCamera(camera: Camera, matrix: Matrix) {
            camera.calcViewPortPixel(this.viewPortPixel); // update viewport

            const asp = this.viewPortPixel.w / this.viewPortPixel.h;
            this.matrix_v.copy(matrix).inverse();
            camera.calcProjectMatrix(asp, this.matrix_p);
            Matrix.multiply(this.matrix_p, this.matrix_v, this.matrix_vp);

            const worldMatrix = matrix.rawData;

            if (this.cameraPosition[0] !== worldMatrix[12] ||
                this.cameraPosition[1] !== worldMatrix[13] ||
                this.cameraPosition[2] !== worldMatrix[14]) {
                this.cameraPosition[0] = worldMatrix[12];
                this.cameraPosition[1] = worldMatrix[13];
                this.cameraPosition[2] = worldMatrix[14];
                this.version++;
            }

            if (this.cameraUp[0] !== worldMatrix[4] ||
                this.cameraUp[1] !== worldMatrix[5] ||
                this.cameraUp[2] !== worldMatrix[6]) {
                this.cameraUp[0] = worldMatrix[4];
                this.cameraUp[1] = worldMatrix[5];
                this.cameraUp[2] = worldMatrix[6];
                this.version++;
            }

            if (this.cameraForward[0] !== worldMatrix[8] ||
                this.cameraForward[1] !== worldMatrix[9] ||
                this.cameraForward[2] !== worldMatrix[10]) {
                this.cameraForward[0] = -worldMatrix[8];
                this.cameraForward[1] = -worldMatrix[9];
                this.cameraForward[2] = -worldMatrix[10];
                this.version++;
            }
        }

        public updateLights(lights: ReadonlyArray<BaseLight>) {
            let allLightCount = 0, directLightCount = 0, pointLightCount = 0, spotLightCount = 0;

            for (const light of lights) { // TODO 如何 灯光组件关闭，此处有何影响。
                
                if (light instanceof DirectLight) {
                    directLightCount++;
                }
                else if (light instanceof PointLight) {
                    pointLightCount++;
                }
                else if (light instanceof SpotLight) {
                    spotLightCount++;
                }

                allLightCount++;
            }

            // TODO
            if (this.directLightArray.length !== directLightCount * 15) {
                this.directLightArray = new Float32Array(directLightCount * 15);
            }

            if (this.pointLightArray.length !== pointLightCount * 19) {
                this.pointLightArray = new Float32Array(pointLightCount * 19);
            }

            if (this.spotLightArray.length !== spotLightCount * 19) {
                this.spotLightArray = new Float32Array(spotLightCount * 19);
            }

            if (this.directShadowMatrix.length !== directLightCount * 16) {
                this.directShadowMatrix = new Float32Array(directLightCount * 16);
            }

            if (this.spotShadowMatrix.length !== spotLightCount * 16) {
                this.spotShadowMatrix = new Float32Array(spotLightCount * 16);
            }

            this.directShadowMaps.length = directLightCount;
            this.pointShadowMaps.length = pointLightCount;
            this.spotShadowMaps.length = spotLightCount;

            this.lightCount = allLightCount;
            this.directLightCount = directLightCount;
            this.pointLightCount = pointLightCount;
            this.spotLightCount = spotLightCount;

            let directLightIndex = 0, pointLightIndex = 0, spotLightIndex = 0, index = 0, size = 0;

            for (const light of lights) {
                let lightArray = this.directLightArray;

                if (light.type === LightType.Direction) {
                    lightArray = this.directLightArray;
                    index = directLightIndex;
                    size = 15;
                }
                else if (light.type === LightType.Point) {
                    lightArray = this.pointLightArray;
                    index = pointLightIndex;
                    size = 19;
                }
                else if (light.type === LightType.Spot) {
                    lightArray = this.spotLightArray;
                    index = spotLightIndex;
                    size = 19;
                }

                let offset = 0;

                const pos = light.gameObject.transform.getPosition();
                lightArray[index * size + offset++] = pos.x;
                lightArray[index * size + offset++] = pos.y;
                lightArray[index * size + offset++] = pos.z;

                const dir = light.gameObject.transform.getForward(helpVec3_1);
                lightArray[index * size + offset++] = dir.x;
                lightArray[index * size + offset++] = dir.y;
                lightArray[index * size + offset++] = dir.z;

                lightArray[index * size + offset++] = light.color.r;
                lightArray[index * size + offset++] = light.color.g;
                lightArray[index * size + offset++] = light.color.b;

                lightArray[index * size + offset++] = light.intensity;

                if (light.type === LightType.Point || light.type === LightType.Spot) {
                    lightArray[index * size + offset++] = light.distance;
                    lightArray[index * size + offset++] = light.decay;
                    if (light.type === LightType.Spot) {
                        lightArray[index * size + offset++] = Math.cos(light.angle);
                        lightArray[index * size + offset++] = Math.cos(light.angle * (1 - light.penumbra));
                    }
                }

                if (light.castShadows) {
                    lightArray[index * size + offset++] = 1;

                    if (light.type === LightType.Direction) {
                        lightArray[index * size + offset++] = light.shadowBias;
                        lightArray[index * size + offset++] = light.shadowRadius;
                        lightArray[index * size + offset++] = light.shadowSize;
                        lightArray[index * size + offset++] = light.shadowSize;
                        this.directShadowMatrix.set(light.matrix.rawData, directLightIndex * 16);
                        this.directShadowMaps[directLightIndex] = light.renderTarget.texture;
                    }
                    else if (light.type === LightType.Point) {
                        lightArray[index * size + offset++] = light.shadowBias;
                        lightArray[index * size + offset++] = light.shadowRadius
                        lightArray[index * size + offset++] = light.shadowCameraNear;
                        lightArray[index * size + offset++] = light.shadowCameraFar;
                        lightArray[index * size + offset++] = light.shadowSize
                        lightArray[index * size + offset++] = light.shadowSize
                        this.pointShadowMaps[pointLightIndex] = light.renderTarget.texture;
                    }
                    else if (light.type === LightType.Spot) {
                        lightArray[index * size + offset++] = light.shadowBias;
                        lightArray[index * size + offset++] = light.shadowRadius;
                        lightArray[index * size + offset++] = light.shadowSize;
                        lightArray[index * size + offset++] = light.shadowSize;
                        this.spotShadowMatrix.set(light.matrix.rawData, spotLightIndex * 16);
                        this.spotShadowMaps[spotLightIndex] = light.renderTarget.texture;
                    }
                }
                else {
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;
                    lightArray[index * size + offset++] = 0;

                    if (light.type === LightType.Direction) {
                        this.directShadowMaps[directLightIndex] = null;
                    }
                    else if (light.type === LightType.Point) {
                        this.pointShadowMaps[pointLightIndex] = null;
                    }
                    else if (light.type === LightType.Spot) {
                        this.spotShadowMaps[spotLightIndex] = null;
                    }
                }

                if (light.type === LightType.Direction) {
                    directLightIndex++;
                }
                else if (light.type === LightType.Point) {
                    pointLightIndex++;
                }
                else if (light.type === LightType.Spot) {
                    spotLightIndex++;
                }
            }

            this.version++;
        }

        updateModel(matrix: Matrix) {
            Matrix.copy(matrix, this.matrix_m); // clone matrix because getWorldMatrix returns a reference
            Matrix.multiply(this.matrix_v, this.matrix_m, this.matrix_mv);
            Matrix.multiply(this.matrix_vp, this.matrix_m, this.matrix_mvp);

            this.version++;
        }

        updateBones(data: Float32Array | null) {
            this.boneData = data;

            this.version++;
        }

        public readonly lightPosition: Float32Array = new Float32Array([0.0, 0.0, 0.0, 1.0]);
        public lightShadowCameraNear: number = 0;
        public lightShadowCameraFar: number = 0;
        public updateLightDepth(light: BaseLight) {
            const position = light.gameObject.transform.getPosition();
            if (this.lightPosition[0] !== position.x ||
                this.lightPosition[1] !== position.y ||
                this.lightPosition[2] !== position.z) {
                this.lightPosition[0] = position.x;
                this.lightPosition[1] = position.y;
                this.lightPosition[2] = position.z;
                this.version++;
            }

            if (this.lightShadowCameraNear !== light.shadowCameraNear ||
                this.lightShadowCameraNear !== light.shadowCameraFar) {
                this.lightShadowCameraNear = light.shadowCameraNear;
                this.lightShadowCameraFar = light.shadowCameraFar;
                this.version++;
            }
        }
    }
}
