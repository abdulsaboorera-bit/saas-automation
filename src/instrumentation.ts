export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { AutomationEngine } = await import('@/lib/automation/engine');
    const engine = AutomationEngine.getInstance();
    engine.start(60000);
    console.log('[Startup] AutomationEngine started');
  }
}
