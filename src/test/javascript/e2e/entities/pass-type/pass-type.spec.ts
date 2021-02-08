import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  PassTypeComponentsPage,
  /* PassTypeDeleteDialog, */
  PassTypeUpdatePage,
} from './pass-type.page-object';

const expect = chai.expect;

describe('PassType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let passTypeComponentsPage: PassTypeComponentsPage;
  let passTypeUpdatePage: PassTypeUpdatePage;
  /* let passTypeDeleteDialog: PassTypeDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PassTypes', async () => {
    await navBarPage.goToEntity('pass-type');
    passTypeComponentsPage = new PassTypeComponentsPage();
    await browser.wait(ec.visibilityOf(passTypeComponentsPage.title), 5000);
    expect(await passTypeComponentsPage.getTitle()).to.eq('Pass Types');
    await browser.wait(ec.or(ec.visibilityOf(passTypeComponentsPage.entities), ec.visibilityOf(passTypeComponentsPage.noResult)), 1000);
  });

  it('should load create PassType page', async () => {
    await passTypeComponentsPage.clickOnCreateButton();
    passTypeUpdatePage = new PassTypeUpdatePage();
    expect(await passTypeUpdatePage.getPageTitle()).to.eq('Create or edit a Pass Type');
    await passTypeUpdatePage.cancel();
  });

  /* it('should create and save PassTypes', async () => {
        const nbButtonsBeforeCreate = await passTypeComponentsPage.countDeleteButtons();

        await passTypeComponentsPage.clickOnCreateButton();

        await promise.all([
            passTypeUpdatePage.setNameInput('name'),
            passTypeUpdatePage.setDescriptionInput('description'),
            passTypeUpdatePage.setDurationDaysInput('5'),
            passTypeUpdatePage.setPriceInput('price'),
            passTypeUpdatePage.setOccasionsInput('5'),
            passTypeUpdatePage.availableForTypeSelectLastOption(),
            passTypeUpdatePage.availableForActivitySelectLastOption(),
        ]);

        expect(await passTypeUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
        expect(await passTypeUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');
        expect(await passTypeUpdatePage.getDurationDaysInput()).to.eq('5', 'Expected durationDays value to be equals to 5');
        expect(await passTypeUpdatePage.getPriceInput()).to.eq('price', 'Expected Price value to be equals to price');
        expect(await passTypeUpdatePage.getOccasionsInput()).to.eq('5', 'Expected occasions value to be equals to 5');

        await passTypeUpdatePage.save();
        expect(await passTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await passTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last PassType', async () => {
        const nbButtonsBeforeDelete = await passTypeComponentsPage.countDeleteButtons();
        await passTypeComponentsPage.clickOnLastDeleteButton();

        passTypeDeleteDialog = new PassTypeDeleteDialog();
        expect(await passTypeDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Pass Type?');
        await passTypeDeleteDialog.clickOnConfirmButton();

        expect(await passTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
