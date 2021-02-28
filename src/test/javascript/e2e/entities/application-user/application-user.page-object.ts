import { element, by, ElementFinder } from 'protractor';

export class ApplicationUserComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-application-user div table .btn-danger'));
  title = element.all(by.css('jhi-application-user div h2#page-heading span')).first();
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

export class ApplicationUserUpdatePage {
  pageTitle = element(by.id('jhi-application-user-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  creditInput = element(by.id('field_credit'));
  sexSelect = element(by.id('field_sex'));
  birthDayInput = element(by.id('field_birthDay'));
  googleTokenInput = element(by.id('field_googleToken'));
  facebookTokenInput = element(by.id('field_facebookToken'));
  imageInput = element(by.id('file_image'));
  introductionInput = element(by.id('field_introduction'));
  isTrainerInput = element(by.id('field_isTrainer'));

  internalUserSelect = element(by.id('field_internalUser'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setCreditInput(credit: string): Promise<void> {
    await this.creditInput.sendKeys(credit);
  }

  async getCreditInput(): Promise<string> {
    return await this.creditInput.getAttribute('value');
  }

  async setSexSelect(sex: string): Promise<void> {
    await this.sexSelect.sendKeys(sex);
  }

  async getSexSelect(): Promise<string> {
    return await this.sexSelect.element(by.css('option:checked')).getText();
  }

  async sexSelectLastOption(): Promise<void> {
    await this.sexSelect.all(by.tagName('option')).last().click();
  }

  async setBirthDayInput(birthDay: string): Promise<void> {
    await this.birthDayInput.sendKeys(birthDay);
  }

  async getBirthDayInput(): Promise<string> {
    return await this.birthDayInput.getAttribute('value');
  }

  async setGoogleTokenInput(googleToken: string): Promise<void> {
    await this.googleTokenInput.sendKeys(googleToken);
  }

  async getGoogleTokenInput(): Promise<string> {
    return await this.googleTokenInput.getAttribute('value');
  }

  async setFacebookTokenInput(facebookToken: string): Promise<void> {
    await this.facebookTokenInput.sendKeys(facebookToken);
  }

  async getFacebookTokenInput(): Promise<string> {
    return await this.facebookTokenInput.getAttribute('value');
  }

  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getAttribute('value');
  }

  async setIntroductionInput(introduction: string): Promise<void> {
    await this.introductionInput.sendKeys(introduction);
  }

  async getIntroductionInput(): Promise<string> {
    return await this.introductionInput.getAttribute('value');
  }

  getIsTrainerInput(): ElementFinder {
    return this.isTrainerInput;
  }

  async internalUserSelectLastOption(): Promise<void> {
    await this.internalUserSelect.all(by.tagName('option')).last().click();
  }

  async internalUserSelectOption(option: string): Promise<void> {
    await this.internalUserSelect.sendKeys(option);
  }

  getInternalUserSelect(): ElementFinder {
    return this.internalUserSelect;
  }

  async getInternalUserSelectedOption(): Promise<string> {
    return await this.internalUserSelect.element(by.css('option:checked')).getText();
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

export class ApplicationUserDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-applicationUser-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-applicationUser'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getText();
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
