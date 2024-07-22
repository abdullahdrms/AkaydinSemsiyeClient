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


const customers = {
  id: 'customers-group-title',
  title: <FormattedMessage id="customers-group-title" />,
  type: 'group',
  children: [
    {
      id: 'customers-list-title',
      title: <FormattedMessage id="customers-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/customers/list'
    },
    {
        id: 'customers-business-list-title',
        title: <FormattedMessage id="customers-business-list-title" />,
        type: 'item',
        icon: icons.maintenance,
        url: '/customers/business'
      }
  ]
};

export default customers;
