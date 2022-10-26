import { server } from '../../mocks/server';
import {
  render,
  screen,
  waitFor,
} from '../../test-utils/testing-library-utils';
import { rest } from 'msw';
import OrderConfirmation from './OrderConfirmation';

test('display alert when server error on confirmation page', async () => {
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation setOrderPhase={jest.fn()} />);
  await waitFor(async () => {
    const alerts = await screen.findAllByRole('alert');
    expect(alerts).toBeInTheDocument();
  });
});
