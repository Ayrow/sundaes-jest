import { render, screen } from '../../../test-utils/testing-library-utils';

import Options from '../Options';
import userEvent from '@testing-library/user-event';

test('displays image for each scoop option from server', async () => {
  render(<Options optionType='scoops' />);

  const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  const altText = scoopImages.map((item) => item.alt);
  expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop']);
});

test('displays image for each topping option from server', async () => {
  render(<Options optionType='toppings' />);

  const toppingImages = await screen.findAllByRole('img', {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  const altText = toppingImages.map((item) => item.alt);
  expect(altText).toEqual([
    'Cherries topping',
    'M&Ms topping',
    'Hot fudge topping',
  ]);
});

test('scoops total does not update if wrong input for scoops', async () => {
  const user = userEvent.setup();
  render(<Options optionType='scoops' />);

  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '-3');

  const scoopsTotal = screen.getByText('Scoops total:', { exact: false });
  expect(scoopsTotal).toHaveTextContent('$0.00');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '100');
  expect(scoopsTotal).toHaveTextContent('$0.00');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2.5');
  expect(scoopsTotal).toHaveTextContent('$0.00');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '3');
  expect(scoopsTotal).toHaveTextContent('$6.00');
});
