namespace paper.editor {

    //创建游戏对象
    export class CreateGameObjectState extends BaseState {
        public static toString(): string {
            return "[class common.AddGameObjectState]";
        }

        public static create(parentList: GameObject[], createType: string): CreateGameObjectState | null {
            let infos = parentList.map((obj) => { return { parentUUID: obj.uuid, serializeData: null } });
            let state = new CreateGameObjectState();
            state.infos = infos;
            state.createType = createType;
            return state;
        }
        public infos: { parentUUID: string, serializeData: any }[];
        public createType: string;
        public addList: string[];
        private isFirst: boolean = true;
        public undo(): boolean {
            if (super.undo()) {
                let objs = Editor.editorModel.getGameObjectsByUUids(this.addList);
                Editor.editorModel._deleteGameObject(objs);
                this.dispatchEditorModelEvent(editor.EditorModelEvent.DELETE_GAMEOBJECTS, this.addList);
                return true;
            }
            return false;
        }

        public redo(): boolean {
            if (super.redo()) {
                this.addList = [];
                //一条信息都没有则添加到场景根
                if (this.infos.length === 0) {
                    this.infos.push({ parentUUID: null, serializeData: null });
                }
                for (let i: number = 0; i < this.infos.length; i++) {
                    let obj: GameObject;
                    if (this.isFirst) {
                        obj = this.createGameObjectByType(this.createType);
                        this.infos[i].serializeData = serialize(obj);
                    }
                    else {
                        obj = deserialize(this.infos[i].serializeData, true);
                    }
                    let parent = Editor.editorModel.getGameObjectByUUid(this.infos[i].parentUUID);
                    if (parent)
                        obj.transform.parent = parent.transform;
                    this.addList.push(obj.uuid);
                }
                this.dispatchEditorModelEvent(EditorModelEvent.ADD_GAMEOBJECTS, this.addList);
                this.isFirst=false;
                return true;
            }
            return false;
        }

        private createGameObjectByType(createType: string): GameObject {
            let obj: GameObject;
            switch (createType) {
                case 'empty':
                    obj = new GameObject();
                    obj.name = "NewGameObject";
                    break;
                case 'cube':
                    obj = new paper.GameObject();
                    obj.name = "cube";
                    let mat = new egret3d.Material(egret3d.DefaultShaders.GIZMOS_COLOR);
                    mat.setVector4v("_Color", [1, 0, 0, 1]);
                    let mesh = obj.addComponent(egret3d.MeshFilter);
                    mesh.mesh = egret3d.DefaultMeshes.CUBE;
                    let renderer = obj.addComponent(egret3d.MeshRenderer);
                    renderer.materials = [mat];
                    break;
            }
            return obj;
        }
    }
}