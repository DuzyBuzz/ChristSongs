import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function minimumSectionCountValidator(minimum: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    return control.length >= minimum
      ? null
      : { minimumSectionCount: { actual: control.length, minimum } };
  };
}

export function lineContentRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const lyrics = `${control.get('lyrics')?.value ?? ''}`.trim();
    const chordsText = `${control.get('chordsText')?.value ?? ''}`.trim();

    return lyrics || chordsText ? null : { lineContentRequired: true };
  };
}

export function optionalHttpsUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = `${control.value ?? ''}`.trim();

    if (!value) {
      return null;
    }

    if (!value.startsWith('https://')) {
      return { httpsUrl: true };
    }

    try {
      const parsedUrl = new URL(value);

      return parsedUrl.protocol === 'https:' ? null : { httpsUrl: true };
    } catch {
      return { httpsUrl: true };
    }
  };
}