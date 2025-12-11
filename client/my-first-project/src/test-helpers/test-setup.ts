import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Provider } from '@angular/core';

export const COMMON_TEST_IMPORTS = [HttpClientTestingModule];
export const COMMON_TEST_PROVIDERS: Provider[] = [
  { provide: MatDialogRef, useValue: {} },
  { provide: MAT_DIALOG_DATA, useValue: {} }
];