const modalTitle = document.querySelector('.modal__title');
const modalForm = document.querySelector('.modal__form');
const modalCheckbox = document.querySelector('.modal__checkbox');
const modalInputDiscount = document.querySelector('.modal__input_discount');
const overlay = document.querySelector('.overlay');
const tableBody = document.querySelector('.table__body');
const btnAddGoods = document.querySelector('.panel__add-goods');
const id = document.querySelector('.vendor-code__id');
const totalPrice = document.querySelector('.modal__total-price');
const cmsTotalPrice = document.querySelector('.cms__total-price');

let goods = 
[
  {
    "id": 1,
    "title": "Смартфон Xiaomi 11T 8/128GB",
    "price": 27000,
    "description": "Смартфон Xiaomi 11T – это представитель флагманской линейки, выпущенной во второй половине 2021 года. И он полностью соответствует такому позиционированию, предоставляя своим обладателям возможность пользоваться отличными камерами, ни в чем себя не ограничивать при запуске игр и других требовательных приложений.",
    "category": "mobile-phone",
    "discount_count": false,
    "count": 3,
    "units": "шт",
    "images": {
      "small": "img/smrtxiaomi11t-m.jpg",
      "big": "img/smrtxiaomi11t-b.jpg"
    }
  },
  {
    "id": 2,
    "title": "Радиоуправляемый автомобиль Cheetan",
    "price": 4000,
    "description": "Внедорожник на дистанционном управлении. Скорость 25км/ч. Возраст 7 - 14 лет",
    "category": "toys",
    "discount_count": 5,
    "count": 1,
    "units": "шт",
    "images": {
      "small": "img/cheetancar-m.jpg",
      "big": "img/cheetancar-b.jpg"
    }
  },
  {
    "id": 3,
    "title": "ТВ приставка MECOOL KI",
    "price": 12400,
    "description": "Всего лишь один шаг сделает ваш телевизор умным, Быстрый и умный MECOOL KI PRO, прекрасно спроектированный, сочетает в себе прочный процессор Cortex-A53 с чипом Amlogic S905D",
    "category": "tv-box",
    "discount_count": 15,
    "count": 4,
    "units": "шт",
    "images": {
      "small": "img/tvboxmecool-m.jpg",
      "big": "img/tvboxmecool-b.jpg"
    }
  },
  {
    "id": 4,
    "title": "Витая пара PROConnect 01-0043-3-25",
    "price": 22,
    "description": "Витая пара Proconnect 01-0043-3-25 является сетевым кабелем с 4 парами проводов типа UTP, в качестве проводника в которых используется алюминий, плакированный медью CCA. Такая неэкранированная витая пара с одножильными проводами диаметром 0.50 мм широко применяется в процессе сетевых монтажных работ. С ее помощью вы сможете обеспечить развертывание локальной сети в домашних условиях или на предприятии, объединить все необходимое вам оборудование в единую сеть.",
    "category": "cables",
    "discount_count": false,
    "count": 420,
    "units": "v",
    "images": {
      "small": "img/lan_proconnect43-3-25.jpg",
      "big": "img/lan_proconnect43-3-25-b.jpg"
    }
  },
  {
    "id": 5,
    "title": "Навигационная система Soundmax",
    "price": 6000,
    "description": "Навигационная система Soundmax",
    "category": "Техника для дома",
    "discount_count": false,
    "count": 5,
    "units": "шт",
    "images": {
      "small": "img/lan_proconnect43-3-25.jpg",
      "big": "img/lan_proconnect43-3-25-b.jpg"
    }
  },
  {
    "id": 6,
    "title": "Телевизор DEXP",
    "price": 60000,
    "description": "Телевизор DEXP",
    "category": "Техника для дома",
    "discount_count": 20,
    "count": 15,
    "units": "шт",
    "images": {
      "small": "img/lan_proconnect43-3-25.jpg",
      "big": "img/lan_proconnect43-3-25-b.jpg"
    }
  },
]

const createRow = (item, index) => {
  const elem = document.createElement('tr');
  const {id, title, category, units, count, price, discount_count} = item;
  elem.innerHTML = `
    <td class="table__cell ">${index + 1}</td>
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
  `
  return elem;
};

const renderGoods = (objects) => {
  tableBody.innerHTML = '';
  objects.forEach((item , index) => tableBody.append(createRow(item, index)))
}

const createId = () => {
  return Math.floor(Math.random() * 10000000000);
}

const addGood = good => {
  tableBody.append(good);
}

const findTotalSum = goods => {
  return goods.reduce((accum, cur) => {
    return accum += cur.price * cur.count * (cur.discount_count ? (1 - cur.discount_count / 100) : 1);
  }, 0);
}

btnAddGoods.addEventListener('click', () => {
  overlay.classList.add('active');
  id.textContent = createId();
});

overlay.addEventListener('click', ({target}) => {
  if (!target.closest('.overlay__modal') || target.closest('.modal__close')) {
    overlay.classList.remove('active');
  };
});

tableBody.addEventListener('click', ({target}) => {
  if (target.closest('.table__btn_del')) {
    const index = target.closest('tr').querySelector('.table__cell-id').textContent.slice(4)
    goods = goods.filter(item => item['id'] != index);
    renderGoods(goods);
    cmsTotalPrice.textContent = `$ ${findTotalSum(goods)}`;
    console.log(goods);
  }
});

modalForm.addEventListener('change', ({target}) => {
  if (target === modalForm.count || target === modalForm.price || target === modalForm.discount_count || target === modalForm.discount) {
    if (modalForm.count.value && modalForm.price.value) {
      totalPrice.textContent = `$ ${modalForm.count.value * modalForm.price.value * (1 - (modalForm.discount_count?.value / 100))}`;
    }
  }
})

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

modalForm.discount.addEventListener('change', () => {
  if (modalForm.discount.checked) {
    modalForm.discount_count.disabled = 0;
  } else {
    modalForm.discount_count.disabled = 1;
    modalForm.discount_count.value = '';
  }
});


overlay.classList.remove('active');
cmsTotalPrice.textContent = `$ ${findTotalSum(goods)}`;
renderGoods(goods);
