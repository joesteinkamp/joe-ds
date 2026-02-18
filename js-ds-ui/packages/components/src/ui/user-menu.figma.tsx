import figma from '@figma/code-connect';
import { UserMenu } from './user-menu';

figma.connect(UserMenu, 'FIGMA_URL_PLACEHOLDER', {
  props: {
    name: figma.string('Name'),
    email: figma.string('Email'),
  },
  example: ({ name, email }) => (
    <UserMenu
      name={name}
      email={email}
      avatarFallback="JD"
      groups={[{ items: [{ label: 'Profile' }, { label: 'Settings' }] }, { items: [{ label: 'Sign out', destructive: true }] }]}
    />
  ),
});
