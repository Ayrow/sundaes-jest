import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';

test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup();
  render(<Options optionType='scoops' />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');
  // expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update toppings subtotal when toppings change', async () => {
  const user = userEvent.setup();
  render(<Options optionType='toppings' />);

  // default toppings subtotal is 0
  const toppingsSubtotal = screen.getByText('Toppings total: $', {
    exact: false,
  });
  expect(toppingsSubtotal).toHaveTextContent('0.00');

  // find and tick one then check subtotal
  const cherryCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  await user.click(cherryCheckbox);
  expect(cherryCheckbox).toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent('1.50');

  // Tick another box then assert subtotal
  const mmsCheckbox = await screen.findByRole('checkbox', { name: 'M&Ms' });
  await user.click(mmsCheckbox);
  expect(mmsCheckbox).toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent('3.00');

  // tick one box off then check subtotal
  await user.click(cherryCheckbox);
  expect(cherryCheckbox).not.toBeChecked();
  expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
  test('grand total starts at $0', () => {});

  test('grand total updates properly if scoop is added first', () => {});

  test('grand total updates properly if topping is added first', () => {});

  test('grand total updates properly if item is removed', () => {});
});
