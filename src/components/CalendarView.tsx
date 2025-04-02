
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { leads, clinics } from '@/data/mockData';
import { format, addDays, startOfWeek, getDay, addMonths, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = () => {
  const [selectedClinic, setSelectedClinic] = useState<string>("all");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  
  // Filter appointments by the selected clinic
  const appointments = leads
    .filter(lead => lead.appointmentInfo)
    .filter(lead => selectedClinic === 'all' || (lead.appointmentInfo && lead.appointmentInfo.clinic === selectedClinic));
  
  // Move to the previous or next period (week or month)
  const handlePrevious = () => {
    if (view === 'week') {
      setCurrentDate(prev => addDays(prev, -7));
    } else {
      setCurrentDate(prev => addMonths(prev, -1));
    }
  };
  
  const handleNext = () => {
    if (view === 'week') {
      setCurrentDate(prev => addDays(prev, 7));
    } else {
      setCurrentDate(prev => addMonths(prev, 1));
    }
  };
  
  // Get days to display
  const getDays = () => {
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
  };
  
  const days = getDays();
  
  // Check if an appointment is on a specific day
  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(lead => {
      if (!lead.appointmentInfo) return false;
      const appointmentDate = lead.appointmentInfo.date;
      return format(appointmentDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-4">
          <Select value={selectedClinic} onValueChange={setSelectedClinic}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Filter by clinic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clinics</SelectItem>
              {clinics.map(clinic => (
                <SelectItem key={clinic} value={clinic}>{clinic}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button 
              variant={view === 'month' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle>
              {view === 'week' 
                ? `Week of ${format(days[0], 'MMMM d, yyyy')}`
                : format(currentDate, 'MMMM yyyy')
              }
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {view === 'week' ? (
            <div className="grid grid-cols-7 divide-x divide-y">
              {/* Day headers */}
              {days.map((day, i) => (
                <div key={i} className="p-3 text-center font-medium">
                  <div className="text-sm text-gray-500">{format(day, 'EEE')}</div>
                  <div className={`text-lg ${format(day, 'MM/dd/yyyy') === format(new Date(), 'MM/dd/yyyy') ? 'bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
              
              {/* Appointment slots */}
              {days.map((day, dayIndex) => {
                const dayAppointments = getAppointmentsForDay(day);
                return (
                  <div key={`slot-${dayIndex}`} className="p-2 h-64 overflow-y-auto">
                    {dayAppointments.length > 0 ? (
                      dayAppointments.map((lead, i) => (
                        <div 
                          key={`appointment-${i}`} 
                          className="bg-blue-50 p-2 mb-2 rounded border-l-4 border-blue-400 text-sm"
                        >
                          <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                          <div className="text-xs text-gray-600">
                            {lead.appointmentInfo ? format(lead.appointmentInfo.date, 'h:mm a') : ''}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {lead.appointmentInfo?.clinic}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-400">
                        No appointments
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-7 divide-x divide-y">
              {/* Day of week headers */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={`header-${i}`} className="p-2 text-center font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {/* Calendar grid */}
              {Array.from({ length: Math.ceil(days.length / 7) }).map((_, weekIndex) => (
                <React.Fragment key={`week-${weekIndex}`}>
                  {Array.from({ length: 7 }).map((_, dayOfWeekIndex) => {
                    const dayIndex = weekIndex * 7 + dayOfWeekIndex;
                    const day = dayIndex < days.length ? days[dayIndex] : null;
                    
                    if (!day) return <div key={`empty-${dayOfWeekIndex}`} className="p-2 h-24 bg-gray-50" />;
                    
                    const dayAppointments = getAppointmentsForDay(day);
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    
                    return (
                      <div 
                        key={`day-${dayIndex}`} 
                        className={`p-1 h-24 overflow-hidden ${isCurrentMonth ? '' : 'bg-gray-50 text-gray-400'}`}
                      >
                        <div className={`text-right mb-1 ${isToday ? 'font-bold' : ''}`}>
                          <span className={`inline-block w-6 h-6 text-center ${isToday ? 'bg-primary text-white rounded-full' : ''}`}>
                            {format(day, 'd')}
                          </span>
                        </div>
                        {dayAppointments.slice(0, 2).map((lead, i) => (
                          <div 
                            key={`apt-${i}`} 
                            className="bg-blue-50 p-1 mb-1 rounded text-xs truncate border-l-2 border-blue-400"
                          >
                            {lead.firstName} {lead.lastName}
                          </div>
                        ))}
                        {dayAppointments.length > 2 && (
                          <div className="text-xs text-gray-500">
                            + {dayAppointments.length - 2} more
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
