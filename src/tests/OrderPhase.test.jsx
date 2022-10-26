import { queryByText, render, screen } from '@testing-library/react';
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
  const orderBtn = screen.getByRole('button', {
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

  //accept terms and conditions and click button to confirm order
  const terms = await screen.findByRole('checkbox', {
    name: /terms and conditions/i,
  });
  await user.click(terms);

  const confirmBtn = screen.getByRole('button', {
    name: /confirm order/i,
  });
  await user.click(confirmBtn);

  //test that loading is in the document then disappear
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  const thankYouHeading = await screen.findByRole('heading', {
    name: /Thank You/i,
  });
  expect(thankYouHeading).toBeInTheDocument();

  const notLoading = screen.queryByText(/loading/i);
  expect(notLoading).not.toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/Your order number is /i);
  expect(orderNumber).toHaveTextContent('123455676');

  // click new order button on confirmation page
  const createOrderBtn = screen.getByRole('button', {
    name: /create new order/i,
  });
  await user.click(createOrderBtn);

  // check that scoops and toppings subtotals have been reset$
  const scoopsSubtotal = screen.getByText('Scoops total', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  const toppingsSubtotal = screen.getByText('Toppings total', { exact: false });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // do we need to await anything to avoid test errors?
  await screen.findByRole('spinbutton', { name: 'Vanilla' });
  await screen.findByRole('checkbox', { name: 'Cherries' });
});

test('toppings not on summary page if no toppings ordered', async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: /Vanilla/i,
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2');

  const toppings = screen.queryByRole('heading', {
    name: /Toppings: \$/i,
  });
  expect(toppings).not.toBeInTheDocument();
});

test('toppings not on summary page if toppings ordered then removed', async () => {
  const user = userEvent.setup();
  render(<App />);

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: /Vanilla/i,
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2');

  const cherryCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  await user.click(cherryCheckbox);
  expect(cherryCheckbox).toBeChecked();
  const toppingTotals = screen.getByText('Toppings total: $', { exact: false });
  expect(toppingTotals).toHaveTextContent('1.50');

  await user.click(cherryCheckbox);
  expect(cherryCheckbox).not.toBeChecked();
  expect(toppingTotals).toHaveTextContent('0.00');

  const toppings = screen.queryByRole('heading', {
    name: /Toppings: \$/i,
  });
  expect(toppings).not.toBeInTheDocument();
});
