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
  const orderBtn = await screen.findByRole('button', {
    name: 'Order Sundae!',
  });
  await user.click(orderBtn);

  // check summary information based on order
  const scoopsSummary = await screen.findByRole('heading', {
    name: /Scoops: \$/i,
  });
  expect(scoopsSummary).toHaveTextContent('4.00');

  const toppingsSummary = await screen.findByRole('heading', {
    name: /Toppings: \$/i,
  });
  expect(toppingsSummary).toHaveTextContent('1.50');

  // accept terms and conditions and click button to confirm order
  const terms = await screen.findByRole('checkbox', {
    name: /terms and conditions/i,
  });
  await user.click(terms);

  const confirmBtn = screen.getByRole('button', {
    name: /confirm order/i,
  });
  await user.click(confirmBtn);

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText('123455676');
  expect(orderNumber).toBeInTheDocument();

  // click new order button on confirmation page

  // check that scoops and toppings subtotals have been reset

  // do we need to await anything to avoid test errors?
});
