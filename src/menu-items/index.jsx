// project import
import customers from './customers';
import defaults from './defaults';
import employees from './employees';
import orders from './orders';
import products from './products';
import settings from './settings';
import stock from './stock';

const menuItems = {
  items: [defaults, orders, products, stock, customers, settings]
};

export default menuItems;
