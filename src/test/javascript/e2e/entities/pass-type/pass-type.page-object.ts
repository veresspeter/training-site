import { element, by, ElementFinder } from 'protractor';

export class PassTypeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pass-type div table .btn-danger'));
  title = element.all(by.css('jhi-pass-type div h2#page-heading span')).first();
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

export class PassTypeUpdatePage {
  pageTitle = element(by.id('jhi-pass-type-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nameInput = element(by.id('field_name'));
  descriptionInput = element(by.id('field_description'));
  durationDaysInput = element(by.id('field_durationDays'));
  priceInput = element(by.id('field_price'));
  occasionsInput = element(by.id('field_occasions'));

  availableForTypeSelect = element(by.id('field_availableForType'));
  availableForActivitySelect = element(by.id('field_availableForActivity'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setDurationDaysInput(durationDays: string): Promise<void> {
    await this.durationDaysInput.sendKeys(durationDays);
  }

  async getDurationDaysInput(): Promise<string> {
    return await this.durationDaysInput.getAttribute('value');
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
  }

  async setOccasionsInput(occasions: string): Promise<void> {
    await this.occasionsInput.sendKeys(occasions);
  }

  async getOccasionsInput(): Promise<string> {
    return await this.occasionsInput.getAttribute('value');
  }

  async availableForTypeSelectLastOption(): Promise<void> {
    await this.availableForTypeSelect.all(by.tagName('option')).last().click();
  }

  async availableForTypeSelectOption(option: string): Promise<void> {
    await this.availableForTypeSelect.sendKeys(option);
  }

  getAvailableForTypeSelect(): ElementFinder {
    return this.availableForTypeSelect;
  }

  async getAvailableForTypeSelectedOption(): Promise<string> {
    return await this.availableForTypeSelect.element(by.css('option:checked')).getText();
  }

  async availableForActivitySelectLastOption(): Promise<void> {
    await this.availableForActivitySelect.all(by.tagName('option')).last().click();
  }

  async availableForActivitySelectOption(option: string): Promise<void> {
    await this.availableForActivitySelect.sendKeys(option);
  }

  getAvailableForActivitySelect(): ElementFinder {
    return this.availableForActivitySelect;
  }

  async getAvailableForActivitySelectedOption(): Promise<string> {
    return await this.availableForActivitySelect.element(by.css('option:checked')).getText();
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

export class PassTypeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-passType-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-passType'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
