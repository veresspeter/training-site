import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPassType } from 'app/shared/model/pass-type.model';

@Component({
  selector: 'jhi-pass-type-detail',
  templateUrl: './pass-type-detail.component.html',
})
export class PassTypeDetailComponent implements OnInit {
  passType: IPassType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ passType }) => (this.passType = passType));
  }

  previousState(): void {
    window.history.back();
  }
}
