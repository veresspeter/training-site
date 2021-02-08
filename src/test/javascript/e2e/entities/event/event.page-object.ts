import { element, by, ElementFinder } from 'protractor';

export class EventComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-event div table .btn-danger'));
  title = element.all(by.css('jhi-event div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }
}

export class EventUpdatePage {
  pageTitle = element(by.id('jhi-event-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nameInput = element(by.id('field_name'));
  startInput = element(by.id('field_start'));
  endInput = element(by.id('field_end'));
  limitInput = element(by.id('field_limit'));
  streamLinkInput = element(by.id('field_streamLink'));
  streamLinkTypeSelect = element(by.id('field_streamLinkType'));
  commentInput = element(by.id('field_comment'));

  organizerSelect = element(by.id('field_organizer'));
  activitySelect = element(by.id('field_activity'));
  participantsSelect = element(by.id('field_participants'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setStartInput(start: string): Promise<void> {
    await this.startInput.sendKeys(start);
  }

  async getStartInput(): Promise<string> {
    return await this.startInput.getAttribute('value');
  }

  async setEndInput(end: string): Promise<void> {
    await this.endInput.sendKeys(end);
  }

  async getEndInput(): Promise<string> {
    return await this.endInput.getAttribute('value');
  }

  async setLimitInput(limit: string): Promise<void> {
    await this.limitInput.sendKeys(limit);
  }

  async getLimitInput(): Promise<string> {
    return await this.limitInput.getAttribute('value');
  }

  async setStreamLinkInput(streamLink: string): Promise<void> {
    await this.streamLinkInput.sendKeys(streamLink);
  }

  async getStreamLinkInput(): Promise<string> {
    return await this.streamLinkInput.getAttribute('value');
  }

  async setStreamLinkTypeSelect(streamLinkType: string): Promise<void> {
    await this.streamLinkTypeSelect.sendKeys(streamLinkType);
  }

  async getStreamLinkTypeSelect(): Promise<string> {
    return await this.streamLinkTypeSelect.element(by.css('option:checked')).getText();
  }

  async streamLinkTypeSelectLastOption(): Promise<void> {
    await this.streamLinkTypeSelect.all(by.tagName('option')).last().click();
  }

  async setCommentInput(comment: string): Promise<void> {
    await this.commentInput.sendKeys(comment);
  }

  async getCommentInput(): Promise<string> {
    return await this.commentInput.getAttribute('value');
  }

  async organizerSelectLastOption(): Promise<void> {
    await this.organizerSelect.all(by.tagName('option')).last().click();
  }

  async organizerSelectOption(option: string): Promise<void> {
    await this.organizerSelect.sendKeys(option);
  }

  getOrganizerSelect(): ElementFinder {
    return this.organizerSelect;
  }

  async getOrganizerSelectedOption(): Promise<string> {
    return await this.organizerSelect.element(by.css('option:checked')).getText();
  }

  async activitySelectLastOption(): Promise<void> {
    await this.activitySelect.all(by.tagName('option')).last().click();
  }

  async activitySelectOption(option: string): Promise<void> {
    await this.activitySelect.sendKeys(option);
  }

  getActivitySelect(): ElementFinder {
    return this.activitySelect;
  }

  async getActivitySelectedOption(): Promise<string> {
    return await this.activitySelect.element(by.css('option:checked')).getText();
  }

  async participantsSelectLastOption(): Promise<void> {
    await this.participantsSelect.all(by.tagName('option')).last().click();
  }

  async participantsSelectOption(option: string): Promise<void> {
    await this.participantsSelect.sendKeys(option);
  }

  getParticipantsSelect(): ElementFinder {
    return this.participantsSelect;
  }

  async getParticipantsSelectedOption(): Promise<string> {
    return await this.participantsSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class EventDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-event-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-event'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
