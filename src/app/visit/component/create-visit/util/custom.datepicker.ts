import {Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS_SHORT = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];
const MONTHS_SHORT = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'];

@Injectable()
export class CustomDatepicker extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number): string {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getWeekdayLabel(weekday: number): string {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return MONTHS_SHORT[month - 1];
  }

  getMonthFullName(month: number): string {
    return MONTHS_SHORT[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`;
  }
}
