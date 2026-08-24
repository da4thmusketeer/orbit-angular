import {Component, OnInit} from "@angular/core";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../../services/google-auth.service";




@Component({
  selector: "app-google-callback",
  template: "<p>Processing Google authentication...</p>",
})
export class GoogleCallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private googleAuthService: GoogleAuthService,
  ){}


    ngOnInit() {}




}