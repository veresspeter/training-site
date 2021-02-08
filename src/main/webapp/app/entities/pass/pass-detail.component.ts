import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPass } from 'app/shared/model/pass.model';

@Component({
  selector: 'jhi-pass-detail',
  templateUrl: './pass-detail.component.html',
})
export class PassDetailComponent implements OnInit {
  pass: IPass | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pass }) => (this.pass = pass));
  }

  previousState(): void {
    window.history.back();
  }
}
