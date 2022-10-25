import { findByRole, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('order phases for happy path', async () => {
  // render app
  const user = userEvent.setup();
  render(<App />);

  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2');

  const cherryTopping = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  await user.click(cherryTopping);

  // find and click order button
  const orderBtn = screen.getByRole('button', { name: 'order' });

  // check summary information based on order

  // accept terms and conditions and click button to confirm order

  // confirm order number on confirmation page

  // click new order button on confirmation page

  // check that scoops and toppings subtotals have been reset

  // do we need to await anything to avoid test errors?
});
