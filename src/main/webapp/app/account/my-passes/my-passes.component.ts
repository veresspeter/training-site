import { Component, OnInit } from '@angular/core';
import { IPass } from 'app/shared/model/pass.model';

@Component({
  selector: 'jhi-my-passes',
  templateUrl: './my-passes.component.html',
  styleUrls: ['./my-passes.component.scss'],
})
export class MyPassesComponent implements OnInit {
  loading = true;
  passes?: IPass[];

  constructor() {}

  ngOnInit(): void {}
}
