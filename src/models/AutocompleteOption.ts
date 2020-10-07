import { AutocompleteOptionType } from "./AutocompleteOptionType";

export class AutocompleteOption {

  value: string;
  optionType: AutocompleteOptionType;

  constructor(value: string, optionType: AutocompleteOptionType) {
    this.value = value;
    this.optionType = optionType;
  } 

}