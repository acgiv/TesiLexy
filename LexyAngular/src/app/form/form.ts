import {ValidatorFn} from "@angular/forms";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

export interface FormInput {
  label: Label;
  input: Input;
  insertEmoji: boolean;
  positionEmoji?: string;
  emoji?: IconProp;
  isPassword?: boolean;
}

export interface Label {
  name: string;
  isRequired: boolean;
  emojiInfo?: Emoji
}

export interface Emoji {
  emoji?: IconProp;
  style?: string;
  message: string;
  class: string;
  is_position?: 'start' | 'end'  // end of start
}

export interface Input {
  id: string;  // id associato alla label
  name: string;
  typeText: string; // text, data, password
  style?: string;
  class: string;
  placeholder?: string; // testo di spiegazione nel caso in cui l'input e vuoto
  validator: ValidatorFn[]; // contiene tutte le regex da validare e il required nel caso lo si inserisce
  errorMessages: { [key: string]: string };  // conterra i messaggi che si vuole far visualizzare
  passwordBar?:boolean;
  maxLength?:number;
  dependency?: Dependency;
  disabled?:boolean;
}

export interface Dependency {
  nomeInput: string,
  typeControl: "condition" | "equals",
  keyError: string
}

