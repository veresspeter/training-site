import { Component, OnInit } from '@angular/core';
import { IPass } from 'app/shared/model/pass.model';
import { AccountService } from 'app/core/auth/account.service';
import { PaymentStatus } from 'app/shared/model/enumerations/payment-status.model';
import { PassTypeService } from 'app/shared/services/pass-type.service';
import { IPassType } from 'app/shared/model/pass-type.model';
import { Moment } from 'moment';
import * as moment from 'moment/moment';

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

  isPassPaid(paymentStatus: PaymentStatus | undefined): boolean {
    return paymentStatus?.toString() === PaymentStatus.PAID.toString();
  }

  isPassExpired(validFrom: Moment | undefined, validTo: Moment | undefined): boolean {
    return validFrom!.isAfter(moment.now()) && validTo !== undefined && validTo.isBefore(moment.now());
  }

  isPassUnpaid(paymentStatus: PaymentStatus | undefined): boolean {
    return paymentStatus?.toString() === PaymentStatus.UNPAID.toString() || paymentStatus?.toString() === PaymentStatus.NEW.toString();
  }

  isPassInProgress(paymentStatus: PaymentStatus | undefined): boolean {
    return (
      paymentStatus?.toString() === PaymentStatus.WAITING.toString() || paymentStatus?.toString() === PaymentStatus.APPROVED.toString()
    );
  }
}
