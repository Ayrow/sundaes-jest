import { render, screen } from '../../../test-utils/testing-library-utils';
import ScoopOptions from '../ScoopOption';
import userEvent from '@testing-library/user-event';

test('when no scoop is added the input turns red', async () => {
  const user = userEvent.setup();
  render(<ScoopOptions />);

  const vanillaInput = screen.getByRole('spinbutton');
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '-3');
  expect(vanillaInput).toHaveClass('is-invalid');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2.5');
  expect(vanillaInput).toHaveClass('is-invalid');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '11');
  expect(vanillaInput).toHaveClass('is-invalid');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '3');
  expect(vanillaInput).not.toHaveClass('is-invalid');
});
