// Backup and disaster recovery utilities
export interface BackupData {
  id: string;
  timestamp: number;
  type: 'local' | 'cloud' | 'manual';
  data: any;
  metadata: {
    version: string;
    userAgent: string;
    sessionId: string;
    userId?: string;
  };
}

export interface RecoveryPoint {
  id: string;
  timestamp: number;
  description: string;
  data: any;
  checksum: string;
}

class BackupManager {
  private readonly STORAGE_KEY = 'forestry_app_backup';
  private readonly MAX_LOCAL_BACKUPS = 10;
  private readonly BACKUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private backupTimer?: NodeJS.Timeout;

  constructor() {
    this.initAutoBackup();
  }

  private initAutoBackup(): void {
    // Auto-backup every 5 minutes
    this.backupTimer = setInterval(() => {
      this.createAutoBackup();
    }, this.BACKUP_INTERVAL);

    // Backup on page unload
    window.addEventListener('beforeunload', () => {
      this.createAutoBackup();
    });
  }

  private createAutoBackup(): void {
    try {
      const appData = this.getApplicationData();
      const backup: BackupData = {
        id: this.generateBackupId(),
        timestamp: Date.now(),
        type: 'local',
        data: appData,
        metadata: {
          version: process.env.npm_package_version || '1.0.0',
          userAgent: navigator.userAgent,
          sessionId: this.getSessionId(),
          userId: this.getUserId()
        }
      };

      this.saveLocalBackup(backup);
    } catch (error) {
      console.warn('Auto-backup failed:', error);
    }
  }

  private getApplicationData(): any {
    // Collect all application state
    const data: any = {};

    // Form data
    data.forms = this.getFormData();
    
    // User preferences
    data.preferences = this.getUserPreferences();
    
    // Navigation state
    data.navigation = this.getNavigationState();
    
    // Forestry-specific data
    data.forestry = this.getForestryData();

    return data;
  }

  private getFormData(): any {
    const forms: any = {};
    
    // Collect data from all forms
    document.querySelectorAll('form').forEach((form, index) => {
      const formData = new FormData(form);
      const formObject: any = {};
      
      for (const [key, value] of formData.entries()) {
        formObject[key] = value;
      }
      
      forms[form.id || `form_${index}`] = formObject;
    });

    return forms;
  }

  private getUserPreferences(): any {
    return {
      theme: localStorage.getItem('theme') || 'light',
      language: localStorage.getItem('language') || 'en',
      fontSize: localStorage.getItem('fontSize') || 'medium',
      highContrast: localStorage.getItem('highContrast') === 'true',
      compactMode: localStorage.getItem('compactMode') === 'true'
    };
  }

  private getNavigationState(): any {
    return {
      currentPath: window.location.pathname,
      searchParams: window.location.search,
      hash: window.location.hash
    };
  }

  private getForestryData(): any {
    return {
      gpsCoordinates: this.getGPSData(),
      measurements: this.getMeasurementData(),
      complianceChecks: this.getComplianceData(),
      offlineData: this.getOfflineData()
    };
  }

  private getGPSData(): any {
    // Get GPS data from localStorage or sessionStorage
    const gpsData = localStorage.getItem('gps_data');
    return gpsData ? JSON.parse(gpsData) : null;
  }

  private getMeasurementData(): any {
    // Get measurement data
    const measurementData = localStorage.getItem('measurement_data');
    return measurementData ? JSON.parse(measurementData) : null;
  }

  private getComplianceData(): any {
    // Get compliance check data
    const complianceData = localStorage.getItem('compliance_data');
    return complianceData ? JSON.parse(complianceData) : null;
  }

  private getOfflineData(): any {
    // Get offline data queue
    const offlineData = localStorage.getItem('offline_data');
    return offlineData ? JSON.parse(offlineData) : [];
  }

  private generateBackupId(): string {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSessionId(): string {
    return sessionStorage.getItem('session_id') || 'unknown';
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('user_id') || undefined;
  }

  private saveLocalBackup(backup: BackupData): void {
    try {
      const existingBackups = this.getLocalBackups();
      
      // Add new backup
      existingBackups.push(backup);
      
      // Keep only the most recent backups
      if (existingBackups.length > this.MAX_LOCAL_BACKUPS) {
        existingBackups.splice(0, existingBackups.length - this.MAX_LOCAL_BACKUPS);
      }
      
      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingBackups));
      
      // Log backup creation
      console.log(`Backup created: ${backup.id}`);
    } catch (error) {
      console.error('Failed to save backup:', error);
    }
  }

  getLocalBackups(): BackupData[] {
    try {
      const backups = localStorage.getItem(this.STORAGE_KEY);
      return backups ? JSON.parse(backups) : [];
    } catch (error) {
      console.error('Failed to load backups:', error);
      return [];
    }
  }

  // Manual backup creation
  createManualBackup(description?: string): BackupData {
    const backup: BackupData = {
      id: this.generateBackupId(),
      timestamp: Date.now(),
      type: 'manual',
      data: this.getApplicationData(),
      metadata: {
        version: process.env.npm_package_version || '1.0.0',
        userAgent: navigator.userAgent,
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      }
    };

    this.saveLocalBackup(backup);
    
    // Also save to cloud if available
    this.saveCloudBackup(backup);
    
    return backup;
  }

  // Cloud backup
  private async saveCloudBackup(backup: BackupData): Promise<void> {
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backup),
      });

      if (response.ok) {
        console.log('Cloud backup saved successfully');
      } else {
        console.warn('Cloud backup failed, keeping local only');
      }
    } catch (error) {
      console.warn('Cloud backup unavailable:', error);
    }
  }

  // Restore from backup
  async restoreFromBackup(backupId: string): Promise<boolean> {
    try {
      const backups = this.getLocalBackups();
      const backup = backups.find(b => b.id === backupId);
      
      if (!backup) {
        throw new Error('Backup not found');
      }

      // Restore application data
      await this.restoreApplicationData(backup.data);
      
      console.log(`Restored from backup: ${backupId}`);
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      return false;
    }
  }

  private async restoreApplicationData(data: any): Promise<void> {
    // Restore forms
    if (data.forms) {
      this.restoreFormData(data.forms);
    }
    
    // Restore preferences
    if (data.preferences) {
      this.restoreUserPreferences(data.preferences);
    }
    
    // Restore forestry data
    if (data.forestry) {
      this.restoreForestryData(data.forestry);
    }
  }

  private restoreFormData(forms: any): void {
    Object.entries(forms).forEach(([formId, formData]: [string, any]) => {
      const form = document.getElementById(formId) as HTMLFormElement;
      if (form) {
        Object.entries(formData).forEach(([field, value]: [string, any]) => {
          const input = form.querySelector(`[name="${field}"]`) as HTMLInputElement;
          if (input) {
            input.value = value;
          }
        });
      }
    });
  }

  private restoreUserPreferences(preferences: any): void {
    Object.entries(preferences).forEach(([key, value]) => {
      localStorage.setItem(key, String(value));
    });
  }

  private restoreForestryData(forestryData: any): void {
    if (forestryData.gpsCoordinates) {
      localStorage.setItem('gps_data', JSON.stringify(forestryData.gpsCoordinates));
    }
    
    if (forestryData.measurements) {
      localStorage.setItem('measurement_data', JSON.stringify(forestryData.measurements));
    }
    
    if (forestryData.complianceChecks) {
      localStorage.setItem('compliance_data', JSON.stringify(forestryData.complianceChecks));
    }
    
    if (forestryData.offlineData) {
      localStorage.setItem('offline_data', JSON.stringify(forestryData.offlineData));
    }
  }

  // Export backup data
  exportBackup(backupId: string): string {
    const backups = this.getLocalBackups();
    const backup = backups.find(b => b.id === backupId);
    
    if (!backup) {
      throw new Error('Backup not found');
    }

    return JSON.stringify(backup, null, 2);
  }

  // Import backup data
  importBackup(backupData: string): BackupData {
    try {
      const backup: BackupData = JSON.parse(backupData);
      
      // Validate backup structure
      if (!backup.id || !backup.timestamp || !backup.data) {
        throw new Error('Invalid backup format');
      }

      // Save imported backup
      this.saveLocalBackup(backup);
      
      return backup;
    } catch (error) {
      throw new Error(`Failed to import backup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cleanup old backups
  cleanupOldBackups(maxAge: number = 7 * 24 * 60 * 60 * 1000): number { // 7 days default
    const backups = this.getLocalBackups();
    const cutoffTime = Date.now() - maxAge;
    const oldBackups = backups.filter(backup => backup.timestamp < cutoffTime);
    
    if (oldBackups.length > 0) {
      const remainingBackups = backups.filter(backup => backup.timestamp >= cutoffTime);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remainingBackups));
      console.log(`Cleaned up ${oldBackups.length} old backups`);
    }
    
    return oldBackups.length;
  }

  // Get backup statistics
  getBackupStats(): {
    total: number;
    local: number;
    cloud: number;
    manual: number;
    oldest: number;
    newest: number;
    totalSize: number;
  } {
    const backups = this.getLocalBackups();
    const local = backups.filter(b => b.type === 'local').length;
    const cloud = backups.filter(b => b.type === 'cloud').length;
    const manual = backups.filter(b => b.type === 'manual').length;
    
    const timestamps = backups.map(b => b.timestamp);
    const oldest = timestamps.length > 0 ? Math.min(...timestamps) : 0;
    const newest = timestamps.length > 0 ? Math.max(...timestamps) : 0;
    
    const totalSize = new Blob([JSON.stringify(backups)]).size;
    
    return {
      total: backups.length,
      local,
      cloud,
      manual,
      oldest,
      newest,
      totalSize
    };
  }

  // Dispose cleanup
  dispose(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
    }
  }
}

// Export singleton instance
export const backupManager = new BackupManager();

// Auto-cleanup on page unload
window.addEventListener('beforeunload', () => {
  backupManager.cleanupOldBackups();
});
