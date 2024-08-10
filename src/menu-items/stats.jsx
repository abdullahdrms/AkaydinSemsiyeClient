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


const stats = {
  id: 'stats-group-title',
  title: <FormattedMessage id="stats-group-title" />,
  type: 'group',
  children: [
    {
      id: 'monthly-stats-list-title',
      title: <FormattedMessage id="monthly-stats-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/stats/monthly'
    },
    {
      id: 'yearly-stats-list-title',
      title: <FormattedMessage id="yearly-stats-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/stats/yearly'
    },
    {
      id: 'general-stats-list-title',
      title: <FormattedMessage id="general-stats-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/stats/general'
    }
  ]
};

export default stats;
