import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { clickNext, renderCreateMode } from './wizardTestUtils';

const getSourceDropdown = async () => {
  const sourceDropdown = await screen.findByRole('textbox', {
    name: /select source/i,
  });
  await waitFor(() => expect(sourceDropdown).toBeEnabled());

  return sourceDropdown;
};

const selectAllEnvironments = async () => {
  const user = userEvent.setup();

  await waitFor(() => user.click(screen.getByTestId('upload-aws')));
  await waitFor(() => user.click(screen.getByTestId('upload-google')));
  await waitFor(() => user.click(screen.getByTestId('upload-azure')));
  await waitFor(() => user.click(screen.getByTestId('checkbox-guest-image')));
};

const testTile = async (tile: HTMLElement) => {
  const user = userEvent.setup();

  tile.focus();
  await waitFor(() => user.keyboard(' '));
  expect(tile).toHaveClass('pf-m-selected');
  await waitFor(() => user.keyboard(' '));
  expect(tile).not.toHaveClass('pf-m-selected');
};

describe('Create Image Wizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders component', async () => {
    await renderCreateMode();

    // check heading
    await screen.findByRole('heading', { name: /Images/ });

    // check navigation
    await screen.findByRole('button', { name: 'Image output' });
    await screen.findByRole('button', { name: 'Optional steps' });
    await screen.findByRole('button', { name: 'Register' });
    await screen.findByRole('button', { name: 'OpenSCAP' });
    await screen.findByRole('button', { name: 'File system configuration' });
    await screen.findByRole('button', { name: 'Repository snapshot' });
    await screen.findByRole('button', { name: 'Custom repositories' });
    await screen.findByRole('button', { name: 'Additional packages' });
    await screen.findByRole('button', {
      name: 'First boot script configuration',
    });
    await screen.findByRole('button', { name: 'Details' });
    await screen.findByRole('button', { name: 'Review' });
  });
});

//describe('Step Details', () => {
//  beforeEach(() => {
//    vi.clearAllMocks();
//    router = undefined;
//  });
//
//  const user = userEvent.setup();
//  const setUp = async () => {
//    ({ router } = await renderCustomRoutesWithReduxRouter(
//      'imagewizard',
//      {},
//      routes
//    ));
//
//    // select aws as upload destination
//    const uploadAws = await screen.findByTestId('upload-aws');
//    user.click(uploadAws);
//    await clickNext();
//
//    // aws step
//    await switchToAWSManual();
//    const awsAccountId = await screen.findByRole('textbox', {
//      name: 'aws account id',
//    });
//
//    await waitFor(() => user.type(awsAccountId, '012345678901'));
//
//    await clickNext();
//    // skip registration
//    await screen.findByRole('textbox', {
//      name: 'Select activation key',
//    });
//
//    const registerLaterRadio = screen.getByTestId('registration-radio-later');
//    user.click(registerLaterRadio);
//    await clickNext();
//    // skip oscap
//    await clickNext();
//    // skip repositories
//    await clickNext();
//    // skip packages
//    await clickNext();
//    // skip fsc
//    await clickNext();
//    // skip snapshot
//    await clickNext();
//    //skip firstBoot
//    await clickNext();
//  };
//
//  test('image name invalid for more than 100 chars and description for 250', async () => {
//    await setUp();
//
//    // Enter image name
//    const invalidName = 'a'.repeat(101);
//    await enterBlueprintName(invalidName);
//    expect(await getNextButton()).toHaveClass('pf-m-disabled');
//    expect(await getNextButton()).toBeDisabled();
//    const nameInput = await screen.findByRole('textbox', {
//      name: /blueprint name/i,
//    });
//    await waitFor(() => user.clear(nameInput));
//
//    await enterBlueprintName();
//
//    expect(await getNextButton()).not.toHaveClass('pf-m-disabled');
//    expect(await getNextButton()).toBeEnabled();
//
//    // Enter description image
//    const descriptionInput = await screen.findByRole('textbox', {
//      name: /description/i,
//    });
//
//    const invalidDescription = 'a'.repeat(251);
//    await waitFor(() => user.type(descriptionInput, invalidDescription));
//
//    expect(await getNextButton()).toHaveClass('pf-m-disabled');
//    expect(await getNextButton()).toBeDisabled();
//    await waitFor(() => user.clear(descriptionInput));
//    await waitFor(() => user.type(descriptionInput, 'valid-description'));
//
//    expect(await getNextButton()).not.toHaveClass('pf-m-disabled');
//    expect(await getNextButton()).toBeEnabled();
//  }, 20000);
//});

describe('Keyboard accessibility', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const user = userEvent.setup();

  test('autofocus on each step first input element', async () => {
    await renderCreateMode();

    // Image output
    await selectAllEnvironments();
    await clickNext();

    // Target environment aws
    expect(
      await screen.findByRole('radio', {
        name: /use an account configured from sources\./i,
      })
    ).toHaveFocus();
    const awsSourceDropdown = await getSourceDropdown();
    await waitFor(() => user.click(awsSourceDropdown));
    const awsSource = await screen.findByRole('option', {
      name: /my_source/i,
    });
    await waitFor(() => user.click(awsSource));

    await clickNext();

    // Target environment google
    expect(
      await screen.findByRole('radio', {
        name: /share image with a google account/i,
      })
    ).toHaveFocus();
    await waitFor(async () =>
      user.type(
        await screen.findByRole('textbox', { name: /google principal/i }),
        'test@test.com'
      )
    );
    await clickNext();

    // Target environment azure
    expect(
      await screen.findByRole('radio', {
        name: /use an account configured from sources\./i,
      })
    ).toHaveFocus();
    const azureSourceDropdown = await getSourceDropdown();
    await waitFor(() => user.click(azureSourceDropdown));
    const azureSource = await screen.findByRole('option', {
      name: /azureSource1/i,
    });
    await waitFor(() => user.click(azureSource));

    const resourceGroupDropdown = await screen.findByRole('textbox', {
      name: /select resource group/i,
    });
    await waitFor(() => user.click(resourceGroupDropdown));
    await waitFor(async () =>
      user.click(
        await screen.findByLabelText('Resource group myResourceGroup1')
      )
    );
    await clickNext();

    // Registration
    await screen.findByText(
      'Automatically register and enable advanced capabilities'
    );
    const registrationCheckbox = await screen.findByTestId(
      'automatically-register-checkbox'
    );
    expect(registrationCheckbox).toHaveFocus();
    await screen.findByRole('textbox', {
      name: 'Select activation key',
    });
    await clickNext();

    // TODO: Focus on textbox on OpenSCAP step
    await clickNext();

    //File system configuration
    await clickNext();

    // TODO: Focus on textbox on Custom Repos step
    await clickNext();

    // TODO: Focus on textbox on Packages step
    await clickNext();
    await clickNext();
    // TODO: Focus on textbox on Details step
    await clickNext();
  });

  test('pressing Enter does not advance the wizard', async () => {
    await renderCreateMode();
    user.click(await screen.findByTestId('upload-aws'));
    user.keyboard('{enter}');
    await screen.findByRole('heading', {
      name: /image output/i,
    });
  });

  test('target environment tiles are keyboard selectable', async () => {
    await renderCreateMode();

    await testTile(await screen.findByTestId('upload-aws'));
    await testTile(await screen.findByTestId('upload-google'));
    await testTile(await screen.findByTestId('upload-azure'));
  });
});
