import { Component, inject, OnInit } from "@angular/core";
import Keycloak from "keycloak-js";
import { MatButton } from "@angular/material/button";

@Component({
  selector: "app-home",
  imports: [
    MatButton
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.scss"
})
export class HomeComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);
  protected isLoggedIn = this.keycloak.authenticated ?? false;

  public ngOnInit(): void {
    if (this.keycloak.token) {
      console.log(this.keycloak.token);
    }
  }

  public async login(): Promise<void> {
    if (this.isLoggedIn) {
      return;
    }
    await this.keycloak.login();

  }

  public async logout(): Promise<void> {
    if (!this.isLoggedIn) {
      return;
    }
    await this.keycloak.logout();
  }
}
