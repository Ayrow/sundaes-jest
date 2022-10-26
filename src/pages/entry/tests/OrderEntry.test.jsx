import {
  render,
  screen,
  waitFor,
} from '../../../test-utils/testing-library-utils';
import OrderEntry from '../OrderEntry';
import { rest } from 'msw';
import { server } from '../../../mocks/server';
import userEvent from '@testing-library/user-event';

test('handles error for scoops and toppings routes', async () => {
  server.resetHandlers(
    rest.get('http://localhost:3030/scoops', (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get('http://localhost:3030/toppings', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toHaveLength(2);
  });
});

test('order button disabled if no scoops added', async () => {
  const user = userEvent.setup();
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  const totalScoops = screen.getByText('Grand total: $', { exact: false });
  expect(totalScoops).toHaveTextContent('0.00');

  const orderBtn = screen.getByRole('button', { name: 'Order Sundae!' });
  expect(orderBtn).toBeDisabled();

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '3');
  expect(orderBtn).toBeEnabled();
  expect(totalScoops).toHaveTextContent('6.00');

  await user.clear(vanillaInput);
  expect(totalScoops).toHaveTextContent('0.00');
  expect(orderBtn).toBeDisabled();
});
