import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ActivityTypeComponentsPage, ActivityTypeDeleteDialog, ActivityTypeUpdatePage } from './activity-type.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('ActivityType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let activityTypeComponentsPage: ActivityTypeComponentsPage;
  let activityTypeUpdatePage: ActivityTypeUpdatePage;
  let activityTypeDeleteDialog: ActivityTypeDeleteDialog;
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

  it('should load ActivityTypes', async () => {
    await navBarPage.goToEntity('activity-type');
    activityTypeComponentsPage = new ActivityTypeComponentsPage();
    await browser.wait(ec.visibilityOf(activityTypeComponentsPage.title), 5000);
    expect(await activityTypeComponentsPage.getTitle()).to.eq('Activity Types');
    await browser.wait(
      ec.or(ec.visibilityOf(activityTypeComponentsPage.entities), ec.visibilityOf(activityTypeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ActivityType page', async () => {
    await activityTypeComponentsPage.clickOnCreateButton();
    activityTypeUpdatePage = new ActivityTypeUpdatePage();
    expect(await activityTypeUpdatePage.getPageTitle()).to.eq('Create or edit a Activity Type');
    await activityTypeUpdatePage.cancel();
  });

  it('should create and save ActivityTypes', async () => {
    const nbButtonsBeforeCreate = await activityTypeComponentsPage.countDeleteButtons();

    await activityTypeComponentsPage.clickOnCreateButton();

    await promise.all([activityTypeUpdatePage.setNameInput('name'), activityTypeUpdatePage.setImageInput(absolutePath)]);

    expect(await activityTypeUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
    expect(await activityTypeUpdatePage.getImageInput()).to.endsWith(
      fileNameToUpload,
      'Expected Image value to be end with ' + fileNameToUpload
    );

    await activityTypeUpdatePage.save();
    expect(await activityTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await activityTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ActivityType', async () => {
    const nbButtonsBeforeDelete = await activityTypeComponentsPage.countDeleteButtons();
    await activityTypeComponentsPage.clickOnLastDeleteButton();

    activityTypeDeleteDialog = new ActivityTypeDeleteDialog();
    expect(await activityTypeDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Activity Type?');
    await activityTypeDeleteDialog.clickOnConfirmButton();

    expect(await activityTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
