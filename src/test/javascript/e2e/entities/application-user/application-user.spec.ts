import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ApplicationUserComponentsPage,
  /* ApplicationUserDeleteDialog, */
  ApplicationUserUpdatePage,
} from './application-user.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('ApplicationUser e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let applicationUserComponentsPage: ApplicationUserComponentsPage;
  let applicationUserUpdatePage: ApplicationUserUpdatePage;
  /* let applicationUserDeleteDialog: ApplicationUserDeleteDialog; */
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ApplicationUsers', async () => {
    await navBarPage.goToEntity('application-user');
    applicationUserComponentsPage = new ApplicationUserComponentsPage();
    await browser.wait(ec.visibilityOf(applicationUserComponentsPage.title), 5000);
    expect(await applicationUserComponentsPage.getTitle()).to.eq('Application Users');
    await browser.wait(
      ec.or(ec.visibilityOf(applicationUserComponentsPage.entities), ec.visibilityOf(applicationUserComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ApplicationUser page', async () => {
    await applicationUserComponentsPage.clickOnCreateButton();
    applicationUserUpdatePage = new ApplicationUserUpdatePage();
    expect(await applicationUserUpdatePage.getPageTitle()).to.eq('Create or edit a Application User');
    await applicationUserUpdatePage.cancel();
  });

  /* it('should create and save ApplicationUsers', async () => {
        const nbButtonsBeforeCreate = await applicationUserComponentsPage.countDeleteButtons();

        await applicationUserComponentsPage.clickOnCreateButton();

        await promise.all([
            applicationUserUpdatePage.setCreditInput('5'),
            applicationUserUpdatePage.sexSelectLastOption(),
            applicationUserUpdatePage.setBirthDayInput('2000-12-31'),
            applicationUserUpdatePage.setGoogleTokenInput('googleToken'),
            applicationUserUpdatePage.setFacebookTokenInput('facebookToken'),
            applicationUserUpdatePage.setImageInput(absolutePath),
            applicationUserUpdatePage.setIntroductionInput('introduction'),
            applicationUserUpdatePage.internalUserSelectLastOption(),
        ]);

        expect(await applicationUserUpdatePage.getCreditInput()).to.eq('5', 'Expected credit value to be equals to 5');
        expect(await applicationUserUpdatePage.getBirthDayInput()).to.eq('2000-12-31', 'Expected birthDay value to be equals to 2000-12-31');
        expect(await applicationUserUpdatePage.getGoogleTokenInput()).to.eq('googleToken', 'Expected GoogleToken value to be equals to googleToken');
        expect(await applicationUserUpdatePage.getFacebookTokenInput()).to.eq('facebookToken', 'Expected FacebookToken value to be equals to facebookToken');
        expect(await applicationUserUpdatePage.getImageInput()).to.endsWith(fileNameToUpload, 'Expected Image value to be end with ' + fileNameToUpload);
        expect(await applicationUserUpdatePage.getIntroductionInput()).to.eq('introduction', 'Expected Introduction value to be equals to introduction');

        await applicationUserUpdatePage.save();
        expect(await applicationUserUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await applicationUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last ApplicationUser', async () => {
        const nbButtonsBeforeDelete = await applicationUserComponentsPage.countDeleteButtons();
        await applicationUserComponentsPage.clickOnLastDeleteButton();

        applicationUserDeleteDialog = new ApplicationUserDeleteDialog();
        expect(await applicationUserDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Application User?');
        await applicationUserDeleteDialog.clickOnConfirmButton();

        expect(await applicationUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
