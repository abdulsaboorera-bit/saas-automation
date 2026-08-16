import { AutomationEngine } from '@/lib/automation/engine';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const engine = AutomationEngine.getInstance();
    engine.start(60000);
    console.log('[Startup] AutomationEngine started');
  }
}
