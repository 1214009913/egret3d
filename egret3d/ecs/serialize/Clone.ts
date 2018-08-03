namespace paper {
    /**
     * 克隆
     */
    export function clone(object: GameObject) {
        const data = serialize(object);

        return deserialize(data) as GameObject;
    }
}