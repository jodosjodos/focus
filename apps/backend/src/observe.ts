import { createObserveModule } from '@nestjs/observe';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

/**
 * Telemetry is dev-only for now — there is no hosted backend to observe until
 * Phase 8, and the hosted collector's free tier is capped at 300k events/month.
 *
 * Also stays off until both credentials are present, so the app boots and runs
 * normally before a service has been created at https://observe.nestjs.com.
 * Read from process.env rather than ConfigService because both call sites run
 * before the DI container exists.
 */
export const isObserveEnabled = (): boolean =>
  process.env.NODE_ENV !== 'production' &&
  !!process.env.OBSERVE_APP_KEY &&
  !!process.env.OBSERVE_APP_SECRET;
