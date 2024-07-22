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


const employees = {
  id: 'employees-group-title',
  title: <FormattedMessage id="employees-group-title" />,
  type: 'group',
  children: [
    {
      id: 'employees-departments-list-title',
      title: <FormattedMessage id="employees-departments-list-title" />,
      type: 'item',
      icon: icons.maintenance,
      url: '/employees/departments'
    },
    {
        id: 'employees-list-title',
        title: <FormattedMessage id="employees-list-title" />,
        type: 'item',
        icon: icons.maintenance,
        url: '/employees/list'
      }
  ]
};

export default employees;
