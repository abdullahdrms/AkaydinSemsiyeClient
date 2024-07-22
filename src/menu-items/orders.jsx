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


const orders = {
  id: 'orders-group-title',
  title: <FormattedMessage id="orders-group-title" />,
  type: 'group',
  children: [
    {
      id: 'orders-list-title',
      title: <FormattedMessage id="orders-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/orders/list'
    }
  ]
};

export default orders;
