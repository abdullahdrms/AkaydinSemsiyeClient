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


const stock = {
  id: 'stock-group-title',
  title: <FormattedMessage id="stock-group-title" />,
  type: 'group',
  children: [
    // {
    //   id: 'stock-list-title',
    //   title: <FormattedMessage id="stock-list-title" />,
    //   type: 'item',
    //   icon: icons.maintenance,
    //   url: '/stock/stock-list'
    // },
    {
      id: 'semi-finished-list-title',
      title: <FormattedMessage id="semi-finished-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/stock/semi-finished-list'
    },
    {
      id: 'material-list-title',
      title: <FormattedMessage id="material-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/stock/material-list'
    }
  ]
};

export default stock;
