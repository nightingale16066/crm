export const createId = () => Math.floor(Math.random() * 10000000000);

export const findTotalSum = (goods, place) => {
  const price = goods.reduce((accum, cur) =>
    accum += cur.price * cur.count *
    (cur.discount ? (1 - cur.discount / 100) : 1), 0);
  place.textContent = `$ ${price.toFixed(2)}`;
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.addEventListener('loadend', () => {
    resolve(reader.result);
  });

  reader.addEventListener('error', (err) => {
    reject(err);
  });

  reader.readAsDataURL(file);
});
