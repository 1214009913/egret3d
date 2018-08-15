namespace egret3d {

    const _helpVectorA: Vector3 = new Vector3();

    export class Matrix {
        private static readonly _instances: Matrix[] = [];

        public static create() {
            if (this._instances.length > 0) {
                return this._instances.pop();
            }

            return new Matrix();
        }

        public static release(value: Matrix) {
            if (this._instances.indexOf(value) >= 0) {
                return;
            }

            this._instances.push(value);
        }

        public readonly rawData: Float32Array;

        public constructor(rawData: Float32Array | null = null) {
            if (rawData) {
                this.rawData = rawData;
            }
            else {
                this.rawData = new Float32Array(
                    [
                        1.0, 0.0, 0.0, 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        0.0, 0.0, 1.0, 0.0,
                        0.0, 0.0, 0.0, 1.0
                    ]
                );
            }
        }

        public copy(value: Readonly<Matrix>) {
            const fromRawData = value.rawData;
            const toRawData = this.rawData;
            toRawData[0] = fromRawData[0];
            toRawData[1] = fromRawData[1];
            toRawData[2] = fromRawData[2];
            toRawData[3] = fromRawData[3];

            toRawData[4] = fromRawData[4];
            toRawData[5] = fromRawData[5];
            toRawData[6] = fromRawData[6];
            toRawData[7] = fromRawData[7];

            toRawData[8] = fromRawData[8];
            toRawData[9] = fromRawData[9];
            toRawData[10] = fromRawData[10];
            toRawData[11] = fromRawData[11];

            toRawData[12] = fromRawData[12];
            toRawData[13] = fromRawData[13];
            toRawData[14] = fromRawData[14];
            toRawData[15] = fromRawData[15];

            return this;
        }

        public clone() {
            const value = new Matrix();
            value.copy(this);

            return value;
        }

        public set(
            n11: number, n21: number, n31: number, n41: number,
            n12: number, n22: number, n32: number, n42: number,
            n13: number, n23: number, n33: number, n43: number,
            n14: number, n24: number, n34: number, n44: number,
        ) {
            this.rawData[0] = n11;
            this.rawData[1] = n12;
            this.rawData[2] = n13;
            this.rawData[3] = n14;

            this.rawData[4] = n21;
            this.rawData[5] = n22;
            this.rawData[6] = n23;
            this.rawData[7] = n24;

            this.rawData[8] = n31;
            this.rawData[9] = n32;
            this.rawData[10] = n33;
            this.rawData[11] = n34;

            this.rawData[12] = n41;
            this.rawData[13] = n42;
            this.rawData[14] = n43;
            this.rawData[15] = n44;

            return this;
        }

        public set3x3(
            n11: number, n21: number, n31: number,
            n12: number, n22: number, n32: number,
            n13: number, n23: number, n33: number,
        ) {
            this.rawData[0] = n11;
            this.rawData[1] = n12;
            this.rawData[2] = n13;

            this.rawData[4] = n21;
            this.rawData[5] = n22;
            this.rawData[6] = n23;

            this.rawData[8] = n31;
            this.rawData[9] = n32;
            this.rawData[10] = n33;

            return this;
        }

        public setTranslation(translation: Readonly<Vector3>) {
            this.rawData[12] = translation.x;
            this.rawData[13] = translation.y;
            this.rawData[14] = translation.z;
            this.rawData[15] = 1.0;

            return this;
        }

        public identity() {
            this.rawData[0] = 1.0;
            this.rawData[1] = 0.0;
            this.rawData[2] = 0.0;
            this.rawData[3] = 0.0;

            this.rawData[4] = 0.0;
            this.rawData[5] = 1.0;
            this.rawData[6] = 0.0;
            this.rawData[7] = 0.0;

            this.rawData[8] = 0.0;
            this.rawData[9] = 0.0;
            this.rawData[10] = 1.0;
            this.rawData[11] = 0.0;

            this.rawData[12] = 0.0;
            this.rawData[13] = 0.0;
            this.rawData[14] = 0.0;
            this.rawData[15] = 1.0;

            return this;
        }

        public inverse() {
            const l1 = this.rawData[0];
            const l2 = this.rawData[1];
            const l3 = this.rawData[2];
            const l4 = this.rawData[3];
            const l5 = this.rawData[4];
            const l6 = this.rawData[5];
            const l7 = this.rawData[6];
            const l8 = this.rawData[7];
            const l9 = this.rawData[8];
            const l10 = this.rawData[9];
            const l11 = this.rawData[10];
            const l12 = this.rawData[11];
            const l13 = this.rawData[12];
            const l14 = this.rawData[13];
            const l15 = this.rawData[14];
            const l16 = this.rawData[15];
            const l17 = (l11 * l16) - (l12 * l15);
            const l18 = (l10 * l16) - (l12 * l14);
            const l19 = (l10 * l15) - (l11 * l14);
            const l20 = (l9 * l16) - (l12 * l13);
            const l21 = (l9 * l15) - (l11 * l13);
            const l22 = (l9 * l14) - (l10 * l13);
            const l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            const l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            const l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            const l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            const l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            const l28 = (l7 * l16) - (l8 * l15);
            const l29 = (l6 * l16) - (l8 * l14);
            const l30 = (l6 * l15) - (l7 * l14);
            const l31 = (l5 * l16) - (l8 * l13);
            const l32 = (l5 * l15) - (l7 * l13);
            const l33 = (l5 * l14) - (l6 * l13);
            const l34 = (l7 * l12) - (l8 * l11);
            const l35 = (l6 * l12) - (l8 * l10);
            const l36 = (l6 * l11) - (l7 * l10);
            const l37 = (l5 * l12) - (l8 * l9);
            const l38 = (l5 * l11) - (l7 * l9);
            const l39 = (l5 * l10) - (l6 * l9);

            const rawData = this.rawData;

            rawData[0] = l23 * l27;
            rawData[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            rawData[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            rawData[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            rawData[4] = l24 * l27;
            rawData[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            rawData[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            rawData[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            rawData[8] = l25 * l27;
            rawData[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            rawData[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            rawData[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            rawData[12] = l26 * l27;
            rawData[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            rawData[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            rawData[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;

            return this;
        }

        public transformVector3(value: Vector3) {
            const x = (value.x * this.rawData[0]) + (value.y * this.rawData[4]) + (value.z * this.rawData[8]) + this.rawData[12];
            const y = (value.x * this.rawData[1]) + (value.y * this.rawData[5]) + (value.z * this.rawData[9]) + this.rawData[13];
            const z = (value.x * this.rawData[2]) + (value.y * this.rawData[6]) + (value.z * this.rawData[10]) + this.rawData[14];
            const w = (value.x * this.rawData[3]) + (value.y * this.rawData[7]) + (value.z * this.rawData[11]) + this.rawData[15];

            value.x = x / w;
            value.y = y / w;
            value.z = z / w;

            return value;
        }

        public transformNormal(value: Vector3): Vector3 {
            let x = (value.x * this.rawData[0]) + (value.y * this.rawData[4]) + (value.z * this.rawData[8]);
            let y = (value.x * this.rawData[1]) + (value.y * this.rawData[5]) + (value.z * this.rawData[9]);
            let z = (value.x * this.rawData[2]) + (value.y * this.rawData[6]) + (value.z * this.rawData[10]);

            value.x = x;
            value.y = y;
            value.z = z;

            return value;
        }

        public static set(
            n11: number, n21: number, n31: number, n41: number,
            n12: number, n22: number, n32: number, n42: number,
            n13: number, n23: number, n33: number, n43: number,
            n14: number, n24: number, n34: number, n44: number,
            result: Matrix
        ): Matrix {
            const rawData = result.rawData;
            rawData[0] = n11;
            rawData[1] = n12;
            rawData[2] = n13;
            rawData[3] = n14;
            rawData[4] = n21;
            rawData[5] = n22;
            rawData[6] = n23;
            rawData[7] = n24;
            rawData[8] = n31;
            rawData[9] = n32;
            rawData[10] = n33;
            rawData[11] = n34;
            rawData[12] = n41;
            rawData[13] = n42;
            rawData[14] = n43;
            rawData[15] = n44;
            return result;
        }

        public static getScale(m: Matrix, out: Vector3): Vector3 {
            out.x = m.rawData[0];
            out.y = m.rawData[5];
            out.z = m.rawData[10];

            return out;
        }

        public static getTranslation(m: Matrix, out: Vector3): Vector3 {
            out.x = m.rawData[12];
            out.y = m.rawData[13];
            out.z = m.rawData[14];

            return out;
        }

        public static getQuaternion(m: Matrix, out: Quaternion): Quaternion {
            const data = m.rawData;
            const m11 = data[0], m12 = data[4], m13 = data[8];
            const m21 = data[1], m22 = data[5], m23 = data[9];
            const m31 = data[2], m32 = data[6], m33 = data[10];
            const trace = m11 + m22 + m33;
            let s;

            if (trace > 0) {
                s = 0.5 / Math.sqrt(trace + 1.0);
                out.w = 0.25 / s;
                out.x = (m32 - m23) * s;
                out.y = (m13 - m31) * s;
                out.z = (m21 - m12) * s;
            }
            else if (m11 > m22 && m11 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
                out.w = (m32 - m23) / s;
                out.x = 0.25 * s;
                out.y = (m12 + m21) / s;
                out.z = (m13 + m31) / s;
            }
            else if (m22 > m33) {
                s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
                out.w = (m13 - m31) / s;
                out.x = (m12 + m21) / s;
                out.y = 0.25 * s;
                out.z = (m23 + m32) / s;
            }
            else {
                s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
                out.w = (m21 - m12) / s;
                out.x = (m13 + m31) / s;
                out.y = (m23 + m32) / s;
                out.z = 0.25 * s;
            }

            return out;
        }

        public static add(left: Matrix, right: Matrix, out: Matrix): Matrix {
            out.rawData[0] = left.rawData[0] + right.rawData[0];
            out.rawData[1] = left.rawData[1] + right.rawData[1];
            out.rawData[2] = left.rawData[2] + right.rawData[2];
            out.rawData[3] = left.rawData[3] + right.rawData[3];

            out.rawData[4] = left.rawData[4] + right.rawData[4];
            out.rawData[5] = left.rawData[5] + right.rawData[5];
            out.rawData[6] = left.rawData[6] + right.rawData[6];
            out.rawData[7] = left.rawData[7] + right.rawData[7];

            out.rawData[8] = left.rawData[8] + right.rawData[8];
            out.rawData[9] = left.rawData[9] + right.rawData[9];
            out.rawData[10] = left.rawData[10] + right.rawData[10];
            out.rawData[11] = left.rawData[11] + right.rawData[11];

            out.rawData[12] = left.rawData[12] + right.rawData[12];
            out.rawData[13] = left.rawData[13] + right.rawData[13];
            out.rawData[14] = left.rawData[14] + right.rawData[14];
            out.rawData[15] = left.rawData[15] + right.rawData[15];

            return out;
        }

        public static multiply(lhs: Matrix, rhs: Matrix, out: Matrix): Matrix {
            const a00 = lhs.rawData[0], a01 = lhs.rawData[1], a02 = lhs.rawData[2], a03 = lhs.rawData[3];
            const a10 = lhs.rawData[4], a11 = lhs.rawData[5], a12 = lhs.rawData[6], a13 = lhs.rawData[7];
            const a20 = lhs.rawData[8], a21 = lhs.rawData[9], a22 = lhs.rawData[10], a23 = lhs.rawData[11];
            const a30 = lhs.rawData[12], a31 = lhs.rawData[13], a32 = lhs.rawData[14], a33 = lhs.rawData[15];

            let b0 = rhs.rawData[0],
                b1 = rhs.rawData[1],
                b2 = rhs.rawData[2],
                b3 = rhs.rawData[3];

            out.rawData[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[4];
            b1 = rhs.rawData[5];
            b2 = rhs.rawData[6];
            b3 = rhs.rawData[7];

            out.rawData[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[8];
            b1 = rhs.rawData[9];
            b2 = rhs.rawData[10];
            b3 = rhs.rawData[11];

            out.rawData[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            b0 = rhs.rawData[12];
            b1 = rhs.rawData[13];
            b2 = rhs.rawData[14];
            b3 = rhs.rawData[15];

            out.rawData[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
            out.rawData[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
            out.rawData[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
            out.rawData[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

            return out;
        }

        public static scale(scaler: number, m: Matrix): Matrix {
            m.rawData[0] *= scaler;
            m.rawData[1] *= scaler;
            m.rawData[2] *= scaler;
            m.rawData[3] *= scaler;

            m.rawData[4] *= scaler;
            m.rawData[5] *= scaler;
            m.rawData[6] *= scaler;
            m.rawData[7] *= scaler;

            m.rawData[8] *= scaler;
            m.rawData[9] *= scaler;
            m.rawData[10] *= scaler;
            m.rawData[11] *= scaler;

            m.rawData[12] *= scaler;
            m.rawData[13] *= scaler;
            m.rawData[14] *= scaler;
            m.rawData[15] *= scaler;

            return m;
        }

        public static transpose(m: Matrix, out: Matrix): Matrix {
            out.rawData[1] = m.rawData[4];
            out.rawData[2] = m.rawData[8];
            out.rawData[3] = m.rawData[12];
            out.rawData[4] = m.rawData[1];
            out.rawData[6] = m.rawData[9];
            out.rawData[7] = m.rawData[13];
            out.rawData[8] = m.rawData[2];
            out.rawData[9] = m.rawData[6];
            out.rawData[11] = m.rawData[14];
            out.rawData[12] = m.rawData[3];
            out.rawData[13] = m.rawData[7];
            out.rawData[14] = m.rawData[11];
            return out;
        }

        public static inverse(src: Matrix, out: Matrix): Matrix {
            // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
            var te = out.rawData,
                me = src.rawData,

                n11 = me[0], n21 = me[1], n31 = me[2], n41 = me[3],
                n12 = me[4], n22 = me[5], n32 = me[6], n42 = me[7],
                n13 = me[8], n23 = me[9], n33 = me[10], n43 = me[11],
                n14 = me[12], n24 = me[13], n34 = me[14], n44 = me[15],

                t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
                t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
                t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
                t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

            var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

            if (det === 0) {


            }

            var detInv = 1 / det;

            te[0] = t11 * detInv;
            te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
            te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
            te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

            te[4] = t12 * detInv;
            te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
            te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
            te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

            te[8] = t13 * detInv;
            te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
            te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
            te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

            te[12] = t14 * detInv;
            te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
            te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
            te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

            return out;
        }

        public static inverse2(src: Matrix, out: Matrix): Matrix {
            let l1 = src.rawData[0];
            let l2 = src.rawData[1];
            let l3 = src.rawData[2];
            let l4 = src.rawData[3];
            let l5 = src.rawData[4];
            let l6 = src.rawData[5];
            let l7 = src.rawData[6];
            let l8 = src.rawData[7];
            let l9 = src.rawData[8];
            let l10 = src.rawData[9];
            let l11 = src.rawData[10];
            let l12 = src.rawData[11];
            let l13 = src.rawData[12];
            let l14 = src.rawData[13];
            let l15 = src.rawData[14];
            let l16 = src.rawData[15];
            let l17 = (l11 * l16) - (l12 * l15);
            let l18 = (l10 * l16) - (l12 * l14);
            let l19 = (l10 * l15) - (l11 * l14);
            let l20 = (l9 * l16) - (l12 * l13);
            let l21 = (l9 * l15) - (l11 * l13);
            let l22 = (l9 * l14) - (l10 * l13);
            let l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19);
            let l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21));
            let l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22);
            let l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22));
            let l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26));
            let l28 = (l7 * l16) - (l8 * l15);
            let l29 = (l6 * l16) - (l8 * l14);
            let l30 = (l6 * l15) - (l7 * l14);
            let l31 = (l5 * l16) - (l8 * l13);
            let l32 = (l5 * l15) - (l7 * l13);
            let l33 = (l5 * l14) - (l6 * l13);
            let l34 = (l7 * l12) - (l8 * l11);
            let l35 = (l6 * l12) - (l8 * l10);
            let l36 = (l6 * l11) - (l7 * l10);
            let l37 = (l5 * l12) - (l8 * l9);
            let l38 = (l5 * l11) - (l7 * l9);
            let l39 = (l5 * l10) - (l6 * l9);

            const rawData = out.rawData;

            rawData[0] = l23 * l27;
            rawData[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
            rawData[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
            rawData[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
            rawData[4] = l24 * l27;
            rawData[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
            rawData[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
            rawData[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
            rawData[8] = l25 * l27;
            rawData[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
            rawData[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
            rawData[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
            rawData[12] = l26 * l27;
            rawData[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
            rawData[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
            rawData[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;

            return out;
        }

        public static decompose(m: Matrix, scale: Vector3, rotation: Quaternion, translation: Vector3): boolean {
            translation.x = m.rawData[12];
            translation.y = m.rawData[13];
            translation.z = m.rawData[14];

            let xs = sign(m.rawData[0] * m.rawData[1] * m.rawData[2] * m.rawData[3]) < 0 ? -1 : 1;
            let ys = sign(m.rawData[4] * m.rawData[5] * m.rawData[6] * m.rawData[7]) < 0 ? -1 : 1;
            let zs = sign(m.rawData[8] * m.rawData[9] * m.rawData[10] * m.rawData[11]) < 0 ? -1 : 1;

            scale.x = xs * Math.sqrt(m.rawData[0] * m.rawData[0] + m.rawData[1] * m.rawData[1] + m.rawData[2] * m.rawData[2]);
            scale.y = ys * Math.sqrt(m.rawData[4] * m.rawData[4] + m.rawData[5] * m.rawData[5] + m.rawData[6] * m.rawData[6]);
            scale.z = zs * Math.sqrt(m.rawData[8] * m.rawData[8] + m.rawData[9] * m.rawData[9] + m.rawData[10] * m.rawData[10]);

            if (scale.x === 0 || scale.y === 0 || scale.z === 0) {
                rotation.x = 0;
                rotation.y = 0;
                rotation.z = 0;
                rotation.w = 1;
                return false;
            }

            let mat = helpMat_1;
            mat.rawData[0] = m.rawData[0] / scale.x;
            mat.rawData[1] = m.rawData[1] / scale.x;
            mat.rawData[2] = m.rawData[2] / scale.x;
            mat.rawData[3] = 0;

            mat.rawData[4] = m.rawData[4] / scale.y;
            mat.rawData[5] = m.rawData[5] / scale.y;
            mat.rawData[6] = m.rawData[6] / scale.y;
            mat.rawData[7] = 0;

            mat.rawData[8] = m.rawData[8] / scale.z;
            mat.rawData[9] = m.rawData[9] / scale.z;
            mat.rawData[10] = m.rawData[10] / scale.z;
            mat.rawData[11] = 0;

            this.getQuaternion(mat, rotation);

            return true;
        }

        public static copy(m: Matrix, out: Matrix): Matrix {
            for (let i = 0; i < 16; i++) {
                out.rawData[i] = m.rawData[i];
            }
            return out;
        }

        public static identify(m: Matrix): Matrix {
            m.rawData[0] = 1;
            m.rawData[1] = 0;
            m.rawData[2] = 0;
            m.rawData[3] = 0;

            m.rawData[4] = 0;
            m.rawData[5] = 1;
            m.rawData[6] = 0;
            m.rawData[7] = 0;

            m.rawData[8] = 0;
            m.rawData[9] = 0;
            m.rawData[10] = 1;
            m.rawData[11] = 0;

            m.rawData[12] = 0;
            m.rawData[13] = 0;
            m.rawData[14] = 0;
            m.rawData[15] = 1;

            return m;
        }

        public static zero(m: Matrix): Matrix {
            m.rawData[0] = 0;
            m.rawData[1] = 0;
            m.rawData[2] = 0;
            m.rawData[3] = 0;

            m.rawData[4] = 0;
            m.rawData[5] = 0;
            m.rawData[6] = 0;
            m.rawData[7] = 0;

            m.rawData[8] = 0;
            m.rawData[9] = 0;
            m.rawData[10] = 0;
            m.rawData[11] = 0;

            m.rawData[12] = 0;
            m.rawData[13] = 0;
            m.rawData[14] = 0;
            m.rawData[15] = 1;

            return m;
        }

        public static formScale(xScale: number, yScale: number, zScale: number, out: Matrix): Matrix {
            out.rawData[0] = xScale; out.rawData[1] = 0.0; out.rawData[2] = 0.0; out.rawData[3] = 0.0;
            out.rawData[4] = 0.0; out.rawData[5] = yScale; out.rawData[6] = 0.0; out.rawData[7] = 0.0;
            out.rawData[8] = 0.0; out.rawData[9] = 0.0; out.rawData[10] = zScale; out.rawData[11] = 0.0;
            out.rawData[12] = 0.0; out.rawData[13] = 0.0; out.rawData[14] = 0.0; out.rawData[15] = 1.0;
            return out;
        }

        public static fromTranslate(x: number, y: number, z: number, out: Matrix): Matrix {
            out.rawData[0] = 1.0; out.rawData[1] = 0.0; out.rawData[2] = 0.0; out.rawData[3] = 0;
            out.rawData[4] = 0.0; out.rawData[5] = 1.0; out.rawData[6] = 0.0; out.rawData[7] = 0.0;
            out.rawData[8] = 0.0; out.rawData[9] = 0.0; out.rawData[10] = 1.0; out.rawData[11] = 0.0;
            out.rawData[12] = x; out.rawData[13] = y; out.rawData[14] = z; out.rawData[15] = 1.0;
            return out;
        }

        public static fromRTS(p: Vector3, s: Vector3, q: Quaternion, out: Matrix): Matrix {
            // let matR = helpMat_2;
            // Quaternion.toMatrix(q, matR);
            // let matS = helpMat_1;
            // this.formScale(s.x, s.y, s.z, matS);
            // this.multiply(matR, matS, out);
            var x = q.x, y = q.y, z = q.z, w = q.w;
            var x2 = x + x, y2 = y + y, z2 = z + z;
            var xx = x * x2, xy = x * y2, xz = x * z2;
            var yy = y * y2, yz = y * z2, zz = z * z2;
            var wx = w * x2, wy = w * y2, wz = w * z2;

            let te = out.rawData;

            te[0] = 1 - (yy + zz);
            te[4] = xy - wz;
            te[8] = xz + wy;

            te[1] = xy + wz;
            te[5] = 1 - (xx + zz);
            te[9] = yz - wx;

            te[2] = xz - wy;
            te[6] = yz + wx;
            te[10] = 1 - (xx + yy);

            // last column
            te[3] = 0;
            te[7] = 0;
            te[11] = 0;

            te[0] *= s.x; te[4] *= s.y; te[8] *= s.z;
            te[1] *= s.x; te[5] *= s.y; te[9] *= s.z;
            te[2] *= s.x; te[6] *= s.y; te[10] *= s.z;
            te[3] *= s.x; te[7] *= s.y; te[11] *= s.z;

            te[12] = p.x;
            te[13] = p.y;
            te[14] = p.z;
            te[15] = 1;

            return out;
        }

        public static getVector3ByOffset(src: Matrix, offset: number, result: Vector3): Vector3 {
            result.x = src.rawData[offset];
            result.y = src.rawData[offset + 1];
            result.z = src.rawData[offset + 2];
            return result;
        }

        public static transformVector3(vector: Vector3, transformMatrix: Matrix, result: Vector3): Vector3 {
            const transformMatrixRawdata = transformMatrix.rawData;
            const x = (vector.x * transformMatrixRawdata[0]) + (vector.y * transformMatrixRawdata[4]) + (vector.z * transformMatrixRawdata[8]) + transformMatrixRawdata[12];
            const y = (vector.x * transformMatrixRawdata[1]) + (vector.y * transformMatrixRawdata[5]) + (vector.z * transformMatrixRawdata[9]) + transformMatrixRawdata[13];
            const z = (vector.x * transformMatrixRawdata[2]) + (vector.y * transformMatrixRawdata[6]) + (vector.z * transformMatrixRawdata[10]) + transformMatrixRawdata[14];
            const w = (vector.x * transformMatrixRawdata[3]) + (vector.y * transformMatrixRawdata[7]) + (vector.z * transformMatrixRawdata[11]) + transformMatrixRawdata[15];

            result.x = x / w;
            result.y = y / w;
            result.z = z / w;

            return result;
        }

        public static transformNormal(vector: Vector3, transformMatrix: Matrix, result: Vector3): Vector3 {
            const transformMatrixRawdata = transformMatrix.rawData;
            const x = (vector.x * transformMatrixRawdata[0]) + (vector.y * transformMatrixRawdata[4]) + (vector.z * transformMatrixRawdata[8]);
            const y = (vector.x * transformMatrixRawdata[1]) + (vector.y * transformMatrixRawdata[5]) + (vector.z * transformMatrixRawdata[9]);
            const z = (vector.x * transformMatrixRawdata[2]) + (vector.y * transformMatrixRawdata[6]) + (vector.z * transformMatrixRawdata[10]);

            result.x = x;
            result.y = y;
            result.z = z;

            return result;
        }

        public static lerp(left: Matrix, right: Matrix, v: number, out: Matrix): Matrix {
            for (let i = 0; i < 16; i++) {
                out.rawData[i] = left.rawData[i] * (1 - v) + right.rawData[i] * v;
            }
            return out;
        }

        public static perspectiveProjectLH(fov: number, aspect: number, znear: number, zfar: number, out: Matrix): Matrix {
            let tan = 1.0 / (Math.tan(fov * 0.5));
            out.rawData[0] = tan / aspect;
            out.rawData[1] = out.rawData[2] = out.rawData[3] = 0.0;

            out.rawData[4] = out.rawData[6] = out.rawData[7] = 0.0;
            out.rawData[5] = tan;

            out.rawData[8] = out.rawData[9] = 0.0;
            out.rawData[10] = (zfar + znear) / (zfar - znear);
            out.rawData[11] = 1.0;

            out.rawData[12] = out.rawData[13] = out.rawData[15] = 0.0;
            out.rawData[14] = -2 * (znear * zfar) / (zfar - znear);

            return out;
        }

        public static orthoProjectLH(width: number, height: number, znear: number, zfar: number, out: Matrix): Matrix {
            let hw = 2.0 / width;
            let hh = 2.0 / height;
            let id = 2.0 / (zfar - znear);
            let nid = (znear + zfar) / (znear - zfar);

            out.rawData[0] = hw;
            out.rawData[1] = 0;
            out.rawData[2] = 0;
            out.rawData[3] = 0;

            out.rawData[4] = 0;
            out.rawData[5] = hh;
            out.rawData[6] = 0;
            out.rawData[7] = 0;

            out.rawData[8] = 0;
            out.rawData[9] = 0;
            out.rawData[10] = id;
            out.rawData[11] = 0;

            out.rawData[12] = 0;
            out.rawData[13] = 0;
            out.rawData[14] = nid;
            out.rawData[15] = 1;

            return out;
        }

        public static toEulerAngles(matrix: Matrix, out: Vector3): Vector3 {
            var x, y, z, sx, sy, sz, m, halfPi;
            var scale = _helpVectorA;

            Matrix.getScale(matrix, scale);

            sx = scale.x;
            sy = scale.y;
            sz = scale.z;

            m = matrix.rawData;

            y = Math.asin(-m[2] / sx);
            halfPi = Math.PI * 0.5;

            if (y < halfPi) {
                if (y > -halfPi) {
                    x = Math.atan2(m[6] / sy, m[10] / sz);
                    z = Math.atan2(m[1] / sx, m[0] / sx);
                } else {
                    // Not a unique solution
                    z = 0;
                    x = -Math.atan2(m[4] / sy, m[5] / sy);
                }
            } else {
                // Not a unique solution
                z = 0;
                x = Math.atan2(m[4] / sy, m[5] / sy);
            }

            out.x = x * 180 / Math.PI;
            out.y = y * 180 / Math.PI;
            out.z = z * 180 / Math.PI;

            return out;
        }

        public static determinant(matrix: Matrix): number {
            var te = matrix.rawData;

            var n11 = te[0],
                n12 = te[4],
                n13 = te[8],
                n14 = te[12];
            var n21 = te[1],
                n22 = te[5],
                n23 = te[9],
                n24 = te[13];
            var n31 = te[2],
                n32 = te[6],
                n33 = te[10],
                n34 = te[14];
            var n41 = te[3],
                n42 = te[7],
                n43 = te[11],
                n44 = te[15];

            //TODO: make this more efficient
            //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

            return (
                n41 * (+n14 * n23 * n32 -
                    n13 * n24 * n32 -
                    n14 * n22 * n33 +
                    n12 * n24 * n33 +
                    n13 * n22 * n34 -
                    n12 * n23 * n34
                ) +
                n42 * (+n11 * n23 * n34 -
                    n11 * n24 * n33 +
                    n14 * n21 * n33 -
                    n13 * n21 * n34 +
                    n13 * n24 * n31 -
                    n14 * n23 * n31
                ) +
                n43 * (+n11 * n24 * n32 -
                    n11 * n22 * n34 -
                    n14 * n21 * n32 +
                    n12 * n21 * n34 +
                    n14 * n22 * n31 -
                    n12 * n24 * n31
                ) +
                n44 * (-n13 * n22 * n31 -
                    n11 * n23 * n32 +
                    n11 * n22 * n33 +
                    n13 * n21 * n32 -
                    n12 * n21 * n33 +
                    n12 * n23 * n31
                )

            );
        }
    }

    let helpMat_1: Matrix = new Matrix();
    let helpMat_2: Matrix = new Matrix();

    export const helpMatrixA = new Matrix();

    export const helpMatrixB = new Matrix();

    export const helpMatrixC = new Matrix();

    export const helpMatrixD = new Matrix();
}