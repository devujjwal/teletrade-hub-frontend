'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api/admin';
import Card from '@/components/ui/card';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Clock, Package, Plus, Edit, Trash, CheckCircle, AlertCircle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function AdminSyncPage() {
  const [statusData, setStatusData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    loadSyncStatus();
    const interval = setInterval(loadSyncStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      const response = await adminApi.getSyncStatus();
      // Backend returns: { success: true, data: { last_sync: {...} } }
      const data = response?.success ? response.data : response;
      console.log('Sync status response:', data); // Debug log
      setStatusData(data);
    } catch (error) {
      console.error('Error loading sync status:', error);
      toast.error('Failed to load sync status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Sync all languages - don't pass lang parameter to sync all
      const response = await adminApi.syncProducts();
      toast.success('Sync started successfully. This will sync all languages and may take several minutes.');
      // Refresh status after a short delay
      setTimeout(() => {
        loadSyncStatus();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle different possible response structures
  // Backend returns: { success: true, data: { last_sync: { started_at, completed_at, status, products_added, products_updated, products_disabled, ... } } }
  // The sync log has: status (started, in_progress, completed, failed), started_at, completed_at, products_added, products_updated, products_disabled
  const lastSync = statusData?.last_sync ? {
    status: statusData.last_sync.status || (statusData.last_sync.completed_at ? 'completed' : (statusData.last_sync.started_at ? 'in_progress' : 'idle')),
    timestamp: statusData.last_sync.completed_at || statusData.last_sync.started_at,
    products_synced: statusData.last_sync.products_synced || ((statusData.last_sync.products_added || 0) + (statusData.last_sync.products_updated || 0)),
    products_added: statusData.last_sync.products_added || 0,
    products_updated: statusData.last_sync.products_updated || 0,
    products_disabled: statusData.last_sync.products_disabled || 0,
  } : null;

  // Helper function to safely format date
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Helper function to safely format full date
  const formatFullDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Unknown';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'PPpp');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product Sync</h1>
        <p className="text-muted-foreground">Synchronize products from vendor catalog</p>
      </div>

      {/* Sync Action */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Sync Products
          </CardTitle>
          <CardDescription>
            Pull latest product data from vendor API and update your catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Syncing All Languages...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync All Languages
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground flex items-center">
              This will synchronize products for all supported languages (EN, DE, etc.)
            </p>
          </div>

          {isSyncing && (
            <div className="mt-4 p-4 bg-info/10 border border-info/20 rounded-lg">
              <p className="text-sm text-info flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Synchronization in progress. This may take a few minutes...
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Last Sync Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Last Sync Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : lastSync ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {lastSync.status === 'completed' || lastSync.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : lastSync.status === 'failed' ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <Clock className="h-5 w-5 text-info" />
                )}
                <Badge 
                  variant={
                    lastSync.status === 'completed' || lastSync.status === 'success' 
                      ? 'outline' 
                      : lastSync.status === 'failed' 
                      ? 'error' 
                      : 'default'
                  }
                >
                  {lastSync.status === 'in_progress' ? 'In Progress' : 
                   lastSync.status === 'completed' ? 'Completed' :
                   lastSync.status === 'failed' ? 'Failed' :
                   lastSync.status === 'started' ? 'Started' :
                   lastSync.status || 'Unknown'}
                </Badge>
                {lastSync.timestamp && (
                  <span className="text-sm text-muted-foreground">
                    {formatDate(lastSync.timestamp)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{lastSync.products_synced || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Synced</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Plus className="h-6 w-6 mx-auto mb-2 text-success" />
                  <p className="text-2xl font-bold">{lastSync.products_added || 0}</p>
                  <p className="text-sm text-muted-foreground">Added</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Edit className="h-6 w-6 mx-auto mb-2 text-info" />
                  <p className="text-2xl font-bold">{lastSync.products_updated || 0}</p>
                  <p className="text-sm text-muted-foreground">Updated</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg text-center">
                  <Trash className="h-6 w-6 mx-auto mb-2 text-destructive" />
                  <p className="text-2xl font-bold">{lastSync.products_disabled || 0}</p>
                  <p className="text-sm text-muted-foreground">Disabled</p>
                </div>
              </div>

              {lastSync.timestamp && (
                <p className="text-sm text-muted-foreground">
                  Last sync: {formatFullDate(lastSync.timestamp)}
                </p>
              )}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No sync history available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
