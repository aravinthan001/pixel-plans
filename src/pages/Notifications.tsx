import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, CheckCheck, Info, AlertCircle, CheckCircle, X } from 'lucide-react';
import { mockNotifications } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'error':
        return <X className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'text-blue-600 bg-blue-100';
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-orange-600 bg-orange-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated with your project activities</p>
        </div>
        <Button variant="outline">
          <CheckCheck className="h-4 w-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>All your notifications in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                  !notification.read && "bg-muted/30 border-primary/20"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-full flex items-center justify-center",
                  getIconColor(notification.type)
                )}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 hover:opacity-100 transition-opacity"
                >
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}