import consts from './const.js';
import {getData, patchData} from './fetchRequest.js';
import {findTotalSum, toBase64} from './logic.js';
import {rerenderRow} from './render.js';

export const overlayEdit = document.querySelector('.overlay__change');
const container = document.querySelector('.image-container-change');
const vendorCodeId = document.querySelector('.change__vendor-code__id');
//  gives access to all fields in form
const modalFormChange = document.querySelector('.modal__form-change');
const modalCheckboxChange = document.querySelector('.modal__checkbox-change');
const modalFieldsetChange = document.querySelector('.modal__fieldset-change');
const changeWrapper = document.createElement('div');
const modalFileChange = document.querySelector('.modal__file-change');
const categoryList = document.querySelector('#category-list');
const modalTotalPriceChange = document
    .querySelector('.modal__total-price-change');

const {tableBody, cmsTotalPrice} = consts;

//  styles for image preview
container.style.cssText = `
  display: flex;
  justify-content: center;
  grid-area: file-add;
`;
changeWrapper.style.cssText = `
  color: red;
  text-transform: uppercase;
  font-weight: 700;
  text-align: center;
`;
modalFieldsetChange.append(changeWrapper);

// render categories from server
export const renderCategories = (categories) => categories.map(category => {
  const option = document.createElement('option');
  option.value = category;
  return option;
});

//  load img
const loadImage = (url) => new Promise((resolve) => {
  const img = new Image();
  img.width = 200;
  img.src = url;
  img.addEventListener('load', () => {
    resolve(img);
  });
});

//  set form fields with initial data
const setFields = async item => {
  modalFormChange.reset();
  container.innerHTML = '';
  const {id, title, category, description, units,
    discount, count, price, image} = item;
  // console.log('item: ', item);

  vendorCodeId.textContent = id;
  modalFormChange.name.value = title;
  modalFormChange.category.value = category;
  modalFormChange.description.value = description;
  modalFormChange.units.value = units;
  modalFormChange.count.value = count;
  modalFormChange.price.value = price;

  categoryList.innerHTML = '';
  categoryList.append(...await getData('category', renderCategories));

  if (discount) {
    modalFormChange.discount_count.checked = true;
    modalFormChange.discount.disabled = false;
    modalFormChange.discount.required = true;
    modalFormChange.discount.value = discount;
  }

  if (image !== 'image/notimage.jpg') {
    // const img = document.createElement('img');
    // img.src = `http://localhost:3000/${image}`;
    const img = await loadImage(`http://localhost:3000/${image}`);
    // console.log('img was set with: ', img);
    container.style.display = 'flex';
    container.append(img);
  }
  if (image === 'image/notimage.jpg') {
    container.style.display = 'none';
  }
  // eslint-disable-next-line max-len
  modalTotalPriceChange.textContent = `$ ${(count * price * (discount ? (1 - discount / 100) : 1)).toFixed(2)}`;
};

//  delete image preview
container.addEventListener('click', () => {
  modalFileChange.value = '';
  container.style.display = '';
  container.innerHTML = '';
});

// opening edit modal
tableBody.addEventListener('click', async ({target}) => {
  const goodId = target.closest('tr')
      .querySelector('.table__cell_name').dataset.id;

  if (target.closest('.table__btn_edit')) {
    await getData(`goods/${goodId}`, setFields);
    overlayEdit.classList.add('active');
  }
});

//  edit item
modalFormChange.addEventListener('submit', async e => {
  // const pictureLabel = modalFormChange.image;
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  data.title = data.name;
  // console.log('data before: ', data);
  // console.log('modal file: ', modalFileChange);

  if (!data.discount) {
    data.discount = 0;
  }

  if (modalFileChange.files[0] && modalFileChange.files[0].size < 1000000) {
    // console.log('in base64');
    data.image = await toBase64(data.changeImage);
  }
  if (modalFileChange.files[0] && modalFileChange.files[0].size > 1000000) {
    // console.log('picture is too big');
    data.image = 'image/notimage.jpg';
  }
  if (!modalFileChange.files[0] && !container.childNodes.length) {
    // console.log('no provided image');
    data.image = 'image/notimage.jpg';
  }


  // console.log('data before patch: ', data);

  await patchData(vendorCodeId.textContent, data, rerenderRow);
  await getData('goods', findTotalSum, cmsTotalPrice);

  modalFormChange.reset();
  modalFileChange.src = '';
  changeWrapper.textContent = '';
  container.style.display = 'none';
  overlayEdit.classList.remove('active');
});

// closing modal window
overlayEdit.addEventListener('click', ({target}) => {
  if (target.closest('.overlay__change') &&
    !target.closest('.modal-change') || target.closest('.modal__close')) {
    overlayEdit.classList.remove('active');
    container.innerHTML = '';
  }
});

//  update total price
modalFormChange.addEventListener('change', ({target}) => {
  // eslint-disable-next-line max-len
  if (target === modalFormChange.count || target === modalFormChange.price || target === modalFormChange.discount || target === modalFormChange.discount_count) {
    if (modalFormChange.count.value && modalFormChange.price.value) {
      // eslint-disable-next-line max-len
      modalTotalPriceChange.textContent = `$ ${(modalFormChange.count.value * modalFormChange.price.value * (1 - (modalFormChange.discount?.value / 100))).toFixed(2)}`;
    }
  }
});

// update discount
modalCheckboxChange.addEventListener('change', () => {
  if (modalCheckboxChange.checked) {
    modalFormChange.discount.disabled = 0;
    modalFormChange.discount.required = true;
  } else {
    modalFormChange.discount.disabled = 1;
    modalFormChange.discount.required = false;
    modalFormChange.discount.value = '';
  }
});

//  picture preview
modalFileChange.addEventListener('change', () => {
  if (modalFileChange.files.length <= 0) return;
  if (modalFileChange.files[0].size > 1000000) {
    changeWrapper.textContent = 'Изображение не должно превышать размер 1 Мб';
    container.style.display = 'none';
    return;
  }

  changeWrapper.textContent = '';
  container.innerHTML = '';
  const src = URL.createObjectURL(modalFileChange.files[0]);
  const preview = document.createElement('img');

  preview.src = src;
  container.append(preview);
  container.style.display = 'flex';
});

