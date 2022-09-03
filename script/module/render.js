import consts from './const.js';

const {tableBody} = consts;

export const createRow = (item, index) => {
  const elem = document.createElement('tr');
  const {id, title, category, units, count, price, discount_count} = item;
  item.index = index + 1;
  elem.innerHTML = `
    <td class="table__cell table__cell_index">${index + 1}</td>
    <td class="table__cell table__cell_left table__cell_name" data-id="${id}">
      <span class="table__cell-id">id: ${id}</span>${title}</td>
    <td class="table__cell table__cell_left">${category}</td>
    <td class="table__cell">${units}</td>
    <td class="table__cell">${count}</td>
    <td class="table__cell">${price} ₽</td>
    <td class="table__cell">${price * count * (discount_count ? (1 - discount_count / 100) : 1)} ₽</td>
    <td class="table__cell table__cell_btn-wrapper">
      <button class="table__btn table__btn_pic"></button>
      <button class="table__btn table__btn_edit"></button>
      <button class="table__btn table__btn_del"></button>
    </td>
  `;
  return elem;
};

export const renderGoods = (objects) => {
  tableBody.innerHTML = '';
  objects.forEach((item, index) => tableBody.append(createRow(item, index)));
};

export const addGood = good => {
  tableBody.append(good);
};
