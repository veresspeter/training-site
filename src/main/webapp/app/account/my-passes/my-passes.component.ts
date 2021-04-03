import { Component, OnInit } from '@angular/core';
import { IPass } from 'app/shared/model/pass.model';
import { AccountService } from 'app/core/auth/account.service';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { IPassType } from 'app/shared/model/pass-type.model';

@Component({
  selector: 'jhi-my-passes',
  templateUrl: './my-passes.component.html',
  styleUrls: ['./my-passes.component.scss'],
})
export class MyPassesComponent implements OnInit {
  loading = true;
  passes?: IPass[];
  passTypes?: IPassType[] | null;

  constructor(protected accountService: AccountService, protected passTypeService: PassTypeService) {}

  ngOnInit(): void {
    this.accountService.getMyPasses().subscribe(res => {
      this.passes = res;
      this.loading = false;
    });
    this.passTypeService.query().subscribe(res => {
      this.passTypes = res.body;
    });
  }

  findPassTypeById(id: number | undefined): IPassType | undefined {
    return this.passTypes?.find(type => type.id === id);
  }

  getPaymentName(paymentStatus: PaymentStatus | undefined): String {
    if (paymentStatus) {
      return PaymentStatus.parse(paymentStatus.toString()).Name;
    } else {
      return '';
    }
  }
}
