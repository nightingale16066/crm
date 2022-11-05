import consts from './const.js';
import {addGood, createRow, renderGoods} from './render.js';
import {createId, findTotalSum, toBase64} from './logic.js';
import {getData, postData} from './fetchRequest.js';
import {renderCategories} from './editGood.js';

const categoryList = document.querySelector('#category-list-modal');
const container = document.querySelector('.image-container-modal');

const {
  modalForm,
  overlay,
  tableBody,
  btnAddGoods,
  modalCheckbox,
  id,
  totalPrice,
  cmsTotalPrice,
  pictureLabel,
  modalConfirmDelete,
} = consts;


export const modalControl = (goods) => {
  let itemIndex;

  //  close modal window
  overlay.addEventListener('click', ({target}) => {
    if (target.closest('.overlay__add') &&
      !target.closest('.overlay__modal') || target.closest('.modal__close')) {
      overlay.classList.remove('active');
      container.innerHTML = '';
    }
  });

  //  update price in modal total cost
  modalForm.addEventListener('change', ({target}) => {
    // eslint-disable-next-line max-len
    if (target === modalForm.count || target === modalForm.price || target === modalForm.discount || target === modalForm.discount_count) {
      if (modalForm.count.value && modalForm.price.value) {
        // eslint-disable-next-line max-len
        totalPrice.textContent = `$ ${(modalForm.count.value * modalForm.price.value * (1 - (modalForm.discount?.value / 100))).toFixed(2)}`;
      }
    }
  });

  const fieldSet = document.querySelector('.modal__fieldset');
  const wrapper = document.createElement('div');
  const preview = document.createElement('img');

  wrapper.style.cssText = `
    color: red;
    text-transform: uppercase;
    font-weight: 700;
    text-align: center;
  `;
  container.style.cssText = `
    grid-area: file-add;

    justify-content: center;
  `;
  preview.style.width = '300px';
  container.append(preview);
  fieldSet.append(wrapper);

  // todo
  //  send new item to server
  modalForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    data['id'] = id.textContent;
    data.title = data.name;

    // console.log(pictureLabel.files[0]);
    if (pictureLabel.files[0] && pictureLabel.files[0].size < 1000000) {
      data.image = await toBase64(data.image);
    }
    if (pictureLabel.files[0] && pictureLabel.files[0].size > 1000000) {
      data.image = 'image/notimage.jpg';
    }
    // console.log('data before post: ', data);
    // work with api
    await postData(data, addGood, createRow);
    await getData('goods', findTotalSum, cmsTotalPrice);

    totalPrice.textContent = '$ 0.00';
    modalForm.reset();
    preview.src = '';
    wrapper.textContent = '';
    container.style.display = 'none';
    overlay.classList.remove('active');
  });

  container.addEventListener('click', () => {
    pictureLabel.value = '';
    container.style.display = 'none';
    container.innerHTML = '';
  });

  //  set discount
  modalCheckbox.addEventListener('change', () => {
    if (modalCheckbox.checked) {
      modalForm.discount.disabled = 0;
    } else {
      modalForm.discount.disabled = 1;
      modalForm.discount.value = '';
    }
  });

  //  open modal to add item
  btnAddGoods.addEventListener('click', async () => {
    overlay.classList.add('active');
    categoryList.innerHTML = '';
    categoryList.append(...await getData('category', renderCategories));
    id.textContent = createId();
  });

  //  handle delete and watch in new window actions
  tableBody.addEventListener('click', ({target}) => {
    itemIndex = target.closest('tr')
        .querySelector('.table__cell-id').textContent.slice(4);
    if (target.closest('.table__btn_del')) {
      modalConfirmDelete.classList.add('delete__active');
    }

    if (target.closest('.table__btn_pic')) {
      const pictureUrl = `http://localhost:3000/${target.dataset.pic}`;
      // eslint-disable-next-line max-len
      open(pictureUrl, '', `width=800, height=600, top=${(screen.height - 600) / 2}, left=${(screen.width - 800) / 2}`);
    }
  });

  // confirm item deletion
  modalConfirmDelete.addEventListener('click', async ({target}) => {
    if (target.closest('.confirm__delete') &&
      !target.closest('.delete__content') || target.closest('.btn-no')) {
      modalConfirmDelete.classList.remove('delete__active');
    }
    if (target.closest('.btn-yes')) {
      await fetch(`http://localhost:3000/api/goods/${itemIndex}`, {method: 'DELETE'});
      await getData('goods', renderGoods);
      getData('goods', findTotalSum, cmsTotalPrice);
      modalConfirmDelete.classList.remove('delete__active');
    }
  });

  // picture preview
  pictureLabel.addEventListener('change', () => {
    if (pictureLabel.files.length <= 0) return;
    if (pictureLabel.files[0].size > 1000000) {
      wrapper.textContent = 'Изображение не должно превышать размер 1 Мб';
      container.style.display = 'none';
      // preview.src = '';
      return;
    }

    wrapper.textContent = '';
    container.innerHTML = '';
    const src = URL.createObjectURL(pictureLabel.files[0]);
    preview.src = src;
    container.append(preview);
    container.style.display = 'flex';
  });
};
