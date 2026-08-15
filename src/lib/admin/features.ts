import { connectDB } from '@/lib/db/mongodb';
import { FeatureFlag, IFeatureFlag } from '@/models/FeatureFlag';
import { SystemSetting, ISystemSetting } from '@/models/SystemSetting';
import mongoose from 'mongoose';

export async function isFeatureEnabled(featureName: string, organizationId?: string): Promise<boolean> {
  await connectDB();

  // Check org-specific override first
  if (organizationId) {
    const orgFlag = await FeatureFlag.findOne({
      name: featureName,
      organizationId: new mongoose.Types.ObjectId(organizationId),
    });
    if (orgFlag) return orgFlag.enabled;
  }

  // Check global flag
  const globalFlag = await FeatureFlag.findOne({
    name: featureName,
    organizationId: null,
  });

  return globalFlag ? globalFlag.enabled : getDefaultFeatureState(featureName);
}

function getDefaultFeatureState(featureName: string): boolean {
  const defaults: Record<string, boolean> = {
    INSTAGRAM_PUBLISHING: true,
    FACEBOOK_PUBLISHING: true,
    LINKEDIN_PUBLISHING: true,
    AI_IMAGES: true,
    AUTOMATIC_MODE: true,
    ANALYTICS: true,
    CSV_IMPORT: true,
    AI_CONTENT: true,
    SCHEDULING: true,
    BULK_POSTING: true,
  };
  return defaults[featureName] ?? false;
}

export async function setFeatureFlag(featureName: string, enabled: boolean, organizationId?: string): Promise<IFeatureFlag> {
  await connectDB();
  const flag = await FeatureFlag.findOneAndUpdate(
    {
      name: featureName,
      organizationId: organizationId ? new mongoose.Types.ObjectId(organizationId) : null,
    },
    { enabled, organizationId: organizationId ? new mongoose.Types.ObjectId(organizationId) : null },
    { upsert: true, new: true }
  );
  return flag;
}

export async function getSystemSetting(key: string): Promise<string | null> {
  await connectDB();
  const setting = await SystemSetting.findOne({ key });
  return setting ? setting.value : null;
}

export async function setSystemSetting(key: string, value: string, description?: string): Promise<ISystemSetting> {
  await connectDB();
  return SystemSetting.findOneAndUpdate(
    { key },
    { value, description: description || null },
    { upsert: true, new: true }
  );
}

export async function isMaintenanceMode(): Promise<boolean> {
  const value = await getSystemSetting('maintenance_mode');
  return value === 'true';
}

export async function isGlobalAutomationPaused(): Promise<boolean> {
  const value = await getSystemSetting('global_automation_paused');
  return value === 'true';
}

export async function isGlobalPublishingStopped(): Promise<boolean> {
  const value = await getSystemSetting('global_publishing_stopped');
  return value === 'true';
}
