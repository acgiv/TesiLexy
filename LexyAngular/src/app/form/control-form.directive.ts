import {Directive, OnDestroy} from '@angular/core';
import { FormInput} from "./form";
import {FormBuilder, FormGroup} from "@angular/forms";
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appControlForm]',
  standalone: true
})
export class ControlFormDirective implements OnDestroy{

   form:  FormInput[]  =[];
   subscription: Subscription = new Subscription();
   private group: any;
    constructor() {
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

   setAllValidator(formBuilder:  FormBuilder):any  {
      const formControls = this.form.reduce((acc:{ [key: string]: any[] }, curr) => {
        acc[curr.input.name] = ['', curr.input.validator];
        return acc;
        }, {});
       this.group = formBuilder.group(formControls);
        this.setEqualsEndDisable();
        return this.group ;
     }

   setRangeValidator(formBuilder:  FormBuilder, startRange: number, endRange:number){
       const formControls = this.form.reduce((acc:{ [key: string]: any[] }, curr, index) => {
         if ( index >= startRange && index < endRange) {
            acc[curr.input.name] = ['', curr.input.validator];
          }
        return acc;
        }, {});
        this.group = formBuilder.group(formControls);
        this.setEqualsEndDisable();
        return  this.group;
   }

   private setEqualsEndDisable(){
          this.form.forEach(curr => {
            if(curr.input.dependency?.typeControl === "equals"){
               this.setValidatorEquals( this.group, curr);
            }else if(curr.input.disabled){
                this.group.get(curr.input.name)?.disable();
            }
          });
   }

   private setValidatorEquals(formGroup: FormGroup, formInput: FormInput){
      const dependency = formInput.input.dependency;
      if(dependency){
        let inputCurrent = formGroup.get(formInput.input.name);
        let inputDependent = formGroup.get(dependency.nomeInput);
        if(inputCurrent && inputDependent ){
          let errors = { ...inputCurrent.errors };
          this.subscription.add(inputCurrent.valueChanges.subscribe((input: string) => {
            errors = {...inputCurrent.errors};
            errors = this.setErrorEquals(input, inputDependent, errors, dependency.keyError,true);
            inputCurrent.setErrors(Object.keys(errors).length==0?null:errors);
            }));
          this.subscription.add(inputDependent.valueChanges.subscribe((input: string) => {
            errors = this.setErrorEquals(input, inputCurrent, errors, dependency.keyError,false);
            inputCurrent.setErrors(Object.keys(errors).length==0?null:errors);
            }));
        }
      }
   }

    private setErrorEquals(input:string, inputDependent:any, errors:{[p:string]:any}, dependency:string, isCurrent:boolean) {
      if ((isCurrent && input !== inputDependent.value) || (!isCurrent && input !== inputDependent.value)) {
         errors[dependency] = true;
       }else {
         delete errors[dependency];
       }
        return errors;
   }

   setCleanValidator(formGroup:FormGroup){
      formGroup.clearValidators();
      return formGroup;
   }

}
