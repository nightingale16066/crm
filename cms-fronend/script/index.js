import './module/editGood.js';
import './module/searchPanel.js';
import consts from './module/const.js';
import {renderGoods} from './module/render.js';
import {findTotalSum} from './module/logic.js';
import {modalControl} from './module/modalControl.js';
import {getData} from './module/fetchRequest.js';

const {overlay, cmsTotalPrice} = consts;


const init = () => {
  overlay.classList.remove('active');
  getData('goods', findTotalSum, cmsTotalPrice);
  getData('goods', renderGoods);
  getData('goods', modalControl);
};

init();
