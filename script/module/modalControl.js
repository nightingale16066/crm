import consts from './const.js';
import {addGood, createRow, renderGoods} from './render.js';
import {createId, findTotalSum} from './logic.js';

const {
  modalForm,
  overlay,
  tableBody,
  btnAddGoods,
  modalCheckbox,
  id,
  totalPrice,
  cmsTotalPrice,
} = consts;

export const modalControl = (goods) => {
  overlay.addEventListener('click', ({target}) => {
    if (!target.closest('.overlay__modal') || target.closest('.modal__close')) {
      overlay.classList.remove('active');
    }
  });


  modalForm.addEventListener('change', ({target}) => {
    // eslint-disable-next-line max-len
    if (target === modalForm.count || target === modalForm.price || target === modalForm.discount || target === modalForm.discount_count) {
      if (modalForm.count.value && modalForm.price.value) {
        // eslint-disable-next-line max-len
        totalPrice.textContent = `$ ${modalForm.count.value * modalForm.price.value * (1 - (modalForm.discount_count?.value / 100))}`;
      }
    }
  });

  modalForm.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data['id'] = id.textContent;
    data.title = data.name;

    addGood(createRow(data, goods.length));
    goods.push(data);
    cmsTotalPrice.textContent = `$ ${findTotalSum(goods)}`;
    totalPrice.textContent = '$ 0.00';
    modalForm.reset();
    overlay.classList.remove('active');
  });

  modalCheckbox.addEventListener('change', () => {
    if (modalCheckbox.checked) {
      modalForm.discount_count.disabled = 0;
    } else {
      modalForm.discount_count.disabled = 1;
      modalForm.discount_count.value = '';
    }
  });

  btnAddGoods.addEventListener('click', () => {
    overlay.classList.add('active');
    id.textContent = createId();
  });

  tableBody.addEventListener('click', ({target}) => {
    if (target.closest('.table__btn_del')) {
      // eslint-disable-next-line max-len
      const index = target.closest('tr').querySelector('.table__cell_index').textContent;
      goods = goods.filter(item => item.index !== +index);
      renderGoods(goods);
      cmsTotalPrice.textContent = `$ ${findTotalSum(goods)}`;
      console.log(goods);
    }
    if (target.closest('.table__btn_pic')) {
      const pictureUrl = target.dataset.pic;
      open(pictureUrl, '', `width=800, height=600, top=${(screen.height - 600) / 2}, left=${(screen.width - 800) / 2}`);
    }
  });
};
