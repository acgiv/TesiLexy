import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerapistaService {
  patologie : string[] = ["discalculia", "dislessia", "disgrafia", "disortografia"];
  constructor() {
  }
}
