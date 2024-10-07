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


const foreignCurrencies = {
  id: 'foreign-currencies-group-title',
  title: <FormattedMessage id="foreign-currencies-group-title" />,
  type: 'group',
  children: [
    {
      id: 'foreign-currencies-list-title',
      title: <FormattedMessage id="foreign-currencies-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/foreign-currencies'
    }
  ]
};

export default foreignCurrencies;
