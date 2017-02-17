import { Component, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'node_modules/ng2-toastr/bundles/ng2-toastr.min.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: '<button class="btn btn-default" (click)="showSuccess()">Toastr Tester</button>'
})
export class AppComponent {
  title = 'app works!';

      constructor(public toastr: ToastsManager, vcr: ViewContainerRef) {
        // Use with angular v2.2 or above
        this.toastr.setRootViewContainerRef(vcr);
      }
        
      showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
      }
    
      showError() {
        this.toastr.error('This is not good!', 'Oops!');
      }
    
      showWarning() {
        this.toastr.warning('You are being warned.', 'Alert!');
      }
    
      showInfo() {
        this.toastr.info('Just some information for you.');
      }
      
      showCustom() {
        this.toastr.custom('<span style="color: red">Message in red.</span>', null, {enableHTML: true});
      }
}
