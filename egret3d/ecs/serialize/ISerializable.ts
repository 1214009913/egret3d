namespace paper {
    /**
     * 
     */
    export interface IUUID {
        /**
         * 
         */
        readonly uuid: string;
    }
    /**
     * 
     */
    export interface IAssetReference {
        /**
         * 
         */
        readonly asset: number;
    }
    /**
     * 
     */
    export interface IClass {
        /**
         * 
         */
        readonly class: string;
    }
    /**
     * 自定义序列化接口。
     */
    export interface ISerializable {
        /**
         * 
         */
        serialize(): any | ISerializedObject;
        /**
         * 
         */
        deserialize(element: any): void;
    }

    /**
     * 序列化后的数据接口。
     */
    export interface ISerializedObject extends IUUID, IClass {
        /**
         * 
         */
        [key: string]: any | IUUID | IAssetReference;
    }

    /**
     * 序列化数据接口
     */
    export interface ISerializedData {
        /**
         * 
         */
        version?: number;
        /**
         * 
         */
        compatibleVersion?: number;
        /**
         * 所有资源。
         */
        readonly assets?: string[];
        /**
         * 所有实体。（至多含一个场景）
         */
        readonly objects?: ISerializedObject[];
        /**
         * 所有组件。
         */
        readonly components?: ISerializedObject[];
    }
}
