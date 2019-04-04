import cats from "../../data/cats";
import { Cat } from "../../interfaces";

export default (): Promise<Cat[]> => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(cats);
            }, Math.random() * 1000);
        } catch (e) {
            reject(e);
        }
    })
}