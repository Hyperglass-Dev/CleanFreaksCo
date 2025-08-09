'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle, TrendingUp, AlertCircle, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAssistantResponse } from '@/lib/actions';
import Link from 'next/link';

interface DailyBriefing {
  greeting: string;
  businessInsights: string[];
  emotionalCheckIn: string;
  recommendations: string[];
  todaysFocus: string;
  timestamp: string;
}

export function AstraDashboardWidget() {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<DailyBriefing | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasViewedToday, setHasViewedToday] = useState(false);

  // Check if user has viewed briefing today
  useEffect(() => {
    const lastViewed = localStorage.getItem('astra-briefing-viewed');
    const today = new Date().toDateString();
    
    if (lastViewed === today) {
      setHasViewedToday(true);
      // Try to load cached briefing
      const cachedBriefing = localStorage.getItem('astra-daily-briefing');
      if (cachedBriefing) {
        try {
          setBriefing(JSON.parse(cachedBriefing));
        } catch (error) {
          console.error('Error loading cached briefing:', error);
        }
      }
    }
  }, []);

  // Generate daily briefing
  const generateDailyBriefing = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const userName = user.name.split(' ')[0]; // Get first name
      const briefingPrompt = `Good morning ${userName}! Please provide a personalized daily briefing for Clean Freaks Co. Include:

1. A warm, encouraging greeting
2. Key business insights for today based on current data
3. A gentle emotional check-in about stress levels and workload
4. 2-3 actionable recommendations to improve the business
5. One main focus area for today

Keep it supportive, empowering, and focused on both business success and personal wellbeing. Make it feel like a caring business mentor is checking in.`;

      const response = await getAssistantResponse(briefingPrompt);
      
      if (response.success && response.data?.response) {
        // Parse the response into structured briefing (simplified for now)
        const briefingData: DailyBriefing = {
          greeting: `Good morning, ${userName}! 🌟`,
          businessInsights: [
            'Your business is showing positive growth trends',
            'Client satisfaction remains high',
            'Cash flow is stable'
          ],
          emotionalCheckIn: response.data.response.slice(0, 200) + '...',
          recommendations: [
            'Focus on nurturing your top 5 clients today',
            'Take a 10-minute break between appointments',
            'Review this week\'s schedule for optimization opportunities'
          ],
          todaysFocus: 'Client relationship building and personal wellbeing',
          timestamp: new Date().toISOString()
        };
        
        setBriefing(briefingData);
        
        // Cache the briefing and mark as viewed
        localStorage.setItem('astra-daily-briefing', JSON.stringify(briefingData));
        localStorage.setItem('astra-briefing-viewed', new Date().toDateString());
        setHasViewedToday(true);
      }
    } catch (error) {
      console.error('Error generating daily briefing:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate briefing on first visit of the day
  useEffect(() => {
    if (user && !hasViewedToday && !briefing) {
      generateDailyBriefing();
    }
  }, [user, hasViewedToday, briefing]);

  if (!briefing && !loading) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Astra - Your AI Assistant
          </CardTitle>
          <CardDescription>
            Get your personalized daily briefing and business insights
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={generateDailyBriefing}
            disabled={loading}
            className="w-full"
            variant="default"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? 'Preparing your briefing...' : 'Get Today\'s Briefing'}
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link href="/assistant">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Astra
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Good Morning, {user?.name.split(' ')[0]}! ✨
        </CardTitle>
        <CardDescription>
          Your daily briefing from Astra
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-purple-200 rounded animate-pulse" />
            <div className="h-4 bg-purple-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-purple-200 rounded animate-pulse w-1/2" />
          </div>
        ) : briefing ? (
          <>
            {/* Emotional Check-in */}
            <div className="flex items-start gap-2 p-3 bg-white/50 rounded-lg">
              <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Wellbeing Check</p>
                <p className="text-muted-foreground">{briefing.emotionalCheckIn}</p>
              </div>
            </div>

            {/* Today's Focus */}
            <div className="flex items-start gap-2 p-3 bg-white/50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium mb-1">Today's Focus</p>
                <p className="text-muted-foreground">{briefing.todaysFocus}</p>
              </div>
            </div>

            {/* Quick Recommendations */}
            <div className="space-y-2">
              <p className="text-sm font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                Quick Wins
              </p>
              <div className="space-y-1">
                {briefing.recommendations.slice(0, 2).map((rec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs w-full justify-start p-2">
                    {rec}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/assistant">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Chat
                </Link>
              </Button>
              <Button 
                onClick={generateDailyBriefing}
                disabled={loading}
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-1" />
                Refresh
              </Button>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
