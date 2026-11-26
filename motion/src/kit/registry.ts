import React from 'react';
import {BalanceScene} from './BalanceScene';
import {BreakevenScene} from './BreakevenScene';
import {CalendarScene} from './CalendarScene';
import {ChartScene} from './ChartScene';
import {ClosingScene} from './ClosingScene';
import {LedgerScene} from './LedgerScene';
import {NotifScene} from './NotifScene';
import {ReconcileScene} from './ReconcileScene';
import {ReportScene} from './ReportScene';
import {SheetScene} from './SheetScene';
import {SplitScene} from './SplitScene';
import {StepsScene} from './StepsScene';
import {StreamScene} from './StreamScene';
import {TitleScene} from './TitleScene';
import {WaterfallScene} from './WaterfallScene';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KIT: Record<string, React.FC<any>> = {
  title: TitleScene,
  notif: NotifScene,
  stream: StreamScene,
  ledger: LedgerScene,
  chart: ChartScene,
  waterfall: WaterfallScene,
  steps: StepsScene,
  balance: BalanceScene,
  calendar: CalendarScene,
  report: ReportScene,
  split: SplitScene,
  reconcile: ReconcileScene,
  sheet: SheetScene,
  breakeven: BreakevenScene,
  closing: ClosingScene,
};
