import { element, by, ElementFinder } from 'protractor';

export class PassComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-pass div table .btn-danger'));
  title = element.all(by.css('jhi-pass div h2#page-heading span')).first();
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

export class PassUpdatePage {
  pageTitle = element(by.id('jhi-pass-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  purchasedInput = element(by.id('field_purchased'));
  usageNoInput = element(by.id('field_usageNo'));
  validFromInput = element(by.id('field_validFrom'));
  validToInput = element(by.id('field_validTo'));

  passTypeSelect = element(by.id('field_passType'));
  userSelect = element(by.id('field_user'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setPurchasedInput(purchased: string): Promise<void> {
    await this.purchasedInput.sendKeys(purchased);
  }

  async getPurchasedInput(): Promise<string> {
    return await this.purchasedInput.getAttribute('value');
  }

  async setUsageNoInput(usageNo: string): Promise<void> {
    await this.usageNoInput.sendKeys(usageNo);
  }

  async getUsageNoInput(): Promise<string> {
    return await this.usageNoInput.getAttribute('value');
  }

  async setValidFromInput(validFrom: string): Promise<void> {
    await this.validFromInput.sendKeys(validFrom);
  }

  async getValidFromInput(): Promise<string> {
    return await this.validFromInput.getAttribute('value');
  }

  async setValidToInput(validTo: string): Promise<void> {
    await this.validToInput.sendKeys(validTo);
  }

  async getValidToInput(): Promise<string> {
    return await this.validToInput.getAttribute('value');
  }

  async passTypeSelectLastOption(): Promise<void> {
    await this.passTypeSelect.all(by.tagName('option')).last().click();
  }

  async passTypeSelectOption(option: string): Promise<void> {
    await this.passTypeSelect.sendKeys(option);
  }

  getPassTypeSelect(): ElementFinder {
    return this.passTypeSelect;
  }

  async getPassTypeSelectedOption(): Promise<string> {
    return await this.passTypeSelect.element(by.css('option:checked')).getText();
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
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

export class PassDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-pass-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-pass'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
