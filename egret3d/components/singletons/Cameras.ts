namespace egret3d {
    /**
     * 
     */
    export class Cameras extends paper.SingletonComponent {
        public readonly cameras: Camera[] = [];

        private _sortCamera(a: Camera, b: Camera) {
            return a.order - b.order;
        }

        public update(cameras: ReadonlyArray<Camera>) {
            this.cameras.length = 0;

            for (const camera of cameras) {
                this.cameras.push(camera);
            }

            this.sort();
        }

        public sort() {
            this.cameras.sort(this._sortCamera);
        }
    }
}