import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  PassComponentsPage,
  /* PassDeleteDialog, */
  PassUpdatePage,
} from './pass.page-object';

const expect = chai.expect;

describe('Pass e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let passComponentsPage: PassComponentsPage;
  let passUpdatePage: PassUpdatePage;
  /* let passDeleteDialog: PassDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Passes', async () => {
    await navBarPage.goToEntity('pass');
    passComponentsPage = new PassComponentsPage();
    await browser.wait(ec.visibilityOf(passComponentsPage.title), 5000);
    expect(await passComponentsPage.getTitle()).to.eq('Passes');
    await browser.wait(ec.or(ec.visibilityOf(passComponentsPage.entities), ec.visibilityOf(passComponentsPage.noResult)), 1000);
  });

  it('should load create Pass page', async () => {
    await passComponentsPage.clickOnCreateButton();
    passUpdatePage = new PassUpdatePage();
    expect(await passUpdatePage.getPageTitle()).to.eq('Create or edit a Pass');
    await passUpdatePage.cancel();
  });

  /* it('should create and save Passes', async () => {
        const nbButtonsBeforeCreate = await passComponentsPage.countDeleteButtons();

        await passComponentsPage.clickOnCreateButton();

        await promise.all([
            passUpdatePage.setPurchasedInput('2000-12-31'),
            passUpdatePage.setUsageNoInput('5'),
            passUpdatePage.setValidFromInput('2000-12-31'),
            passUpdatePage.setValidToInput('2000-12-31'),
            passUpdatePage.passTypeSelectLastOption(),
            passUpdatePage.userSelectLastOption(),
        ]);

        expect(await passUpdatePage.getPurchasedInput()).to.eq('2000-12-31', 'Expected purchased value to be equals to 2000-12-31');
        expect(await passUpdatePage.getUsageNoInput()).to.eq('5', 'Expected usageNo value to be equals to 5');
        expect(await passUpdatePage.getValidFromInput()).to.eq('2000-12-31', 'Expected validFrom value to be equals to 2000-12-31');
        expect(await passUpdatePage.getValidToInput()).to.eq('2000-12-31', 'Expected validTo value to be equals to 2000-12-31');

        await passUpdatePage.save();
        expect(await passUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await passComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Pass', async () => {
        const nbButtonsBeforeDelete = await passComponentsPage.countDeleteButtons();
        await passComponentsPage.clickOnLastDeleteButton();

        passDeleteDialog = new PassDeleteDialog();
        expect(await passDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Pass?');
        await passDeleteDialog.clickOnConfirmButton();

        expect(await passComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
