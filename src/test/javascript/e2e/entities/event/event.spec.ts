import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  EventComponentsPage,
  /* EventDeleteDialog, */
  EventUpdatePage,
} from './event.page-object';

const expect = chai.expect;

describe('Event e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let eventComponentsPage: EventComponentsPage;
  let eventUpdatePage: EventUpdatePage;
  /* let eventDeleteDialog: EventDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Events', async () => {
    await navBarPage.goToEntity('event');
    eventComponentsPage = new EventComponentsPage();
    await browser.wait(ec.visibilityOf(eventComponentsPage.title), 5000);
    expect(await eventComponentsPage.getTitle()).to.eq('Events');
    await browser.wait(ec.or(ec.visibilityOf(eventComponentsPage.entities), ec.visibilityOf(eventComponentsPage.noResult)), 1000);
  });

  it('should load create Event page', async () => {
    await eventComponentsPage.clickOnCreateButton();
    eventUpdatePage = new EventUpdatePage();
    expect(await eventUpdatePage.getPageTitle()).to.eq('Create or edit a Event');
    await eventUpdatePage.cancel();
  });

  /* it('should create and save Events', async () => {
        const nbButtonsBeforeCreate = await eventComponentsPage.countDeleteButtons();

        await eventComponentsPage.clickOnCreateButton();

        await promise.all([
            eventUpdatePage.setNameInput('name'),
            eventUpdatePage.setStartInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            eventUpdatePage.setEndInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            eventUpdatePage.setLimitInput('5'),
            eventUpdatePage.setStreamLinkInput('streamLink'),
            eventUpdatePage.streamLinkTypeSelectLastOption(),
            eventUpdatePage.setCommentInput('comment'),
            eventUpdatePage.organizerSelectLastOption(),
            eventUpdatePage.activitySelectLastOption(),
            // eventUpdatePage.participantsSelectLastOption(),
        ]);

        expect(await eventUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');
        expect(await eventUpdatePage.getStartInput()).to.contain('2001-01-01T02:30', 'Expected start value to be equals to 2000-12-31');
        expect(await eventUpdatePage.getEndInput()).to.contain('2001-01-01T02:30', 'Expected end value to be equals to 2000-12-31');
        expect(await eventUpdatePage.getLimitInput()).to.eq('5', 'Expected limit value to be equals to 5');
        expect(await eventUpdatePage.getStreamLinkInput()).to.eq('streamLink', 'Expected StreamLink value to be equals to streamLink');
        expect(await eventUpdatePage.getCommentInput()).to.eq('comment', 'Expected Comment value to be equals to comment');

        await eventUpdatePage.save();
        expect(await eventUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await eventComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Event', async () => {
        const nbButtonsBeforeDelete = await eventComponentsPage.countDeleteButtons();
        await eventComponentsPage.clickOnLastDeleteButton();

        eventDeleteDialog = new EventDeleteDialog();
        expect(await eventDeleteDialog.getDialogTitle())
            .to.eq('Are you sure you want to delete this Event?');
        await eventDeleteDialog.clickOnConfirmButton();

        expect(await eventComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
