// project import
import customers from './customers';
import defaults from './defaults';
import employees from './employees';
import foreignCurrencies from './foreign-currencies';
import orders from './orders';
import products from './products';
import settings from './settings';
import stats from './stats';
import stock from './stock';

const menuItems = {
  items: [defaults, orders, products, stock, stats, foreignCurrencies, customers, settings]
};

export default menuItems;
