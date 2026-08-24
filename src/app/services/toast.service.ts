import { Injectable, inject } from '@angular/core';
import { HotToastService } from '@ngxpert/hot-toast';

/**
 * Application-wide notification facade.
 *
 * Inject this service instead of coupling components directly to the toast
 * library, keeping notification calls consistent and easy to change later.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly hotToast = inject(HotToastService);

  success(message: string) {
    return this.hotToast.success(message);
  }

  error(message: string) {
    return this.hotToast.error(message);
  }

  info(message: string) {
    return this.hotToast.info(message);
  }

  warning(message: string) {
    return this.hotToast.warning(message);
  }

  loading(message: string) {
    return this.hotToast.loading(message);
  }

  dismiss(toastId?: string) {
    return this.hotToast.close(toastId);
  }
}
