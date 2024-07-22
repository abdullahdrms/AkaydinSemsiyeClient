// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { I24Support, MessageProgramming } from 'iconsax-react';

// type

// icons
// icons
const icons = {
  maintenance: MessageProgramming,
  contactus: I24Support
};


const products = {
  id: 'products-group-title',
  title: <FormattedMessage id="products-group-title" />,
  type: 'group',
  children: [
    {
      id: 'products-list-title',
      title: <FormattedMessage id="products-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/products/list'
    }
  ]
};

export default products;
