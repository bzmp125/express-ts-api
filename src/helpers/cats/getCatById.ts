import cats from "../../data/cats";

export default (catId: string) => {
    return new Promise((resolve, reject) => {
        // timeout to simulate async retrieval process e.g database call
        try {
            setTimeout(() => {
                const cat = cats.filter(cat => cat.id === catId)[0];
                resolve(cat);
            }, Math.random() * 1000);
        } catch (e) {
            reject(e);
        }
    })
}