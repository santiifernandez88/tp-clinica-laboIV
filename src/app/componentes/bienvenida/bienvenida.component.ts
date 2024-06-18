import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent {

  constructor(private router: Router, private modalService: NgbModal) {}

  goTo(path: string) {
    this.router.navigate([path]);
  }
}
