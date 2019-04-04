import cats from "../../data/cats";
import { Cat } from "../../interfaces";
// retrieves a cat by a property

export default (catName: string): Promise<Cat> => {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                const cat = cats.filter(cat => cat.name === catName)[0]
                resolve(cat);
            }, Math.random() * 1000);
        } catch (e) {
            reject(e);
        }
    })
}