import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, timer } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import { ImportJob } from '../../../models';
import { ImportService } from './import.service';

@Injectable({ providedIn: 'root' })
export class ImportBannerService implements OnDestroy {
  private readonly jobSubject = new BehaviorSubject<ImportJob | null>(null);
  private pollSubscription: Subscription | null = null;

  readonly job$ = this.jobSubject.asObservable();
  readonly visible$ = this.job$.pipe(map(j => j !== null));

  constructor(private importService: ImportService) {}

  startPolling(jobId: string): void {
    this.stopPolling();

    // Emit immediately (t=0) then every 3 seconds; stop once terminal status reached
    this.pollSubscription = timer(0, 3000)
      .pipe(
        switchMap(() => this.importService.getStatus(jobId)),
        takeWhile(
          job => job.status !== 'completed' && job.status !== 'failed',
          true, // inclusive — emit the terminal status before completing
        ),
      )
      .subscribe({
        next: job => this.jobSubject.next(job),
        error: () => this.dismiss(),
      });
  }

  dismiss(): void {
    this.stopPolling();
    this.jobSubject.next(null);
  }

  private stopPolling(): void {
    this.pollSubscription?.unsubscribe();
    this.pollSubscription = null;
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
