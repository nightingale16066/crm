export const createId = () => Math.floor(Math.random() * 10000000000);

export const findTotalSum = goods =>
  goods.reduce((accum, cur) =>
    accum += cur.price * cur.count *
    (cur.discount_count ? (1 - cur.discount_count / 100) : 1), 0);
