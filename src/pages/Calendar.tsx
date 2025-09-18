import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon } from 'lucide-react';

export default function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar</h1>
        <p className="text-muted-foreground mt-1">View tasks and deadlines in calendar format</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendar View
          </CardTitle>
          <CardDescription>Visualize your schedule and upcoming deadlines</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Calendar view coming soon</p>
            <p className="text-muted-foreground mt-2">
              This feature will allow you to see all your tasks and deadlines in a calendar format
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}