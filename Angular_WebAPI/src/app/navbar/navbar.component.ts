import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatToolbar} from "@angular/material/toolbar";
import {MatButton} from "@angular/material/button";

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, MatToolbar, MatButton],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

}
