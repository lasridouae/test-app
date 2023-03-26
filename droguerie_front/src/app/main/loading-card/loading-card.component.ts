import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-card',
  templateUrl: './loading-card.component.html',
  styleUrls: ['./loading-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingCardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
