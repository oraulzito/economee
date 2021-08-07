import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landpage',
  templateUrl: './landpage.component.html',
  styleUrls: ['./landpage.component.css']
})
export class LandpageComponent implements OnInit {
  index = 0;

  constructor() { }

  ngOnInit(): void {
  }

}

