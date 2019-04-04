import cats from "../../data/cats";

export default () => {
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