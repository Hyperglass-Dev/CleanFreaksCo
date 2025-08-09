'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  DollarSign, 
  Star,
  Target,
  Lightbulb,
  Award
} from 'lucide-react';
import { getJobs, getInvoices, getClients } from '@/lib/data';
import { getAssistantResponse } from '@/lib/actions';

interface BusinessInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'tip';
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'stable';
  action?: {
    label: string;
    href: string;
  };
}

export function BusinessInsightsCard() {
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState<string>('');

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    try {
      const [jobs, invoices, clients] = await Promise.all([
        getJobs(),
        getInvoices(),
        getClients()
      ]);

      const newInsights: BusinessInsight[] = [];

      // Client retention rate
      const totalClients = clients.length;
      const activeClients = clients.filter(client => client.upcomingJobs > 0).length;
      const retentionRate = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;

      newInsights.push({
        id: 'retention-rate',
        type: retentionRate >= 70 ? 'success' : retentionRate >= 50 ? 'warning' : 'warning',
        title: 'Client Retention',
        value: `${retentionRate}%`,
        description: `${activeClients} of ${totalClients} clients have upcoming bookings`,
        trend: retentionRate >= 70 ? 'up' : retentionRate >= 50 ? 'stable' : 'down'
      });

      // Average job value
      const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
      const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
      const avgJobValue = paidInvoices.length > 0 ? Math.round(totalRevenue / paidInvoices.length) : 0;

      newInsights.push({
        id: 'avg-job-value',
        type: 'info',
        title: 'Avg. Job Value',
        value: `$${avgJobValue}`,
        description: `Based on ${paidInvoices.length} completed jobs`,
        trend: avgJobValue >= 150 ? 'up' : avgJobValue >= 100 ? 'stable' : 'down'
      });

      // This week's performance
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - 7);
      const thisWeeksJobs = jobs.filter(job => 
        new Date(job.date) >= thisWeek && job.status === 'Completed'
      );

      newInsights.push({
        id: 'weekly-performance',
        type: thisWeeksJobs.length >= 5 ? 'success' : 'info',
        title: 'This Week',
        value: `${thisWeeksJobs.length} jobs`,
        description: 'Jobs completed in the last 7 days',
        trend: thisWeeksJobs.length >= 5 ? 'up' : 'stable'
      });

      // Monthly growth target
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const monthlyJobs = jobs.filter(job => 
        new Date(job.date) >= thisMonth && job.status === 'Completed'
      );
      const monthlyTarget = 20; // Dijana's monthly target
      const progressToTarget = Math.round((monthlyJobs.length / monthlyTarget) * 100);

      newInsights.push({
        id: 'monthly-target',
        type: progressToTarget >= 80 ? 'success' : progressToTarget >= 50 ? 'info' : 'warning',
        title: 'Monthly Target',
        value: `${progressToTarget}%`,
        description: `${monthlyJobs.length}/${monthlyTarget} jobs completed this month`,
        trend: progressToTarget >= 80 ? 'up' : 'stable'
      });

      setInsights(newInsights);

      // Get AI-powered business tip
      const businessContext = {
        totalClients,
        activeClients,
        retentionRate,
        avgJobValue,
        weeklyJobs: thisWeeksJobs.length,
        monthlyProgress: progressToTarget
      };

      const tipResponse = await getAssistantResponse(
        `Based on this business data: ${JSON.stringify(businessContext)}, provide ONE specific, actionable tip for Dijana to improve her cleaning business. Keep it under 100 words and focus on practical advice she can implement today.`
      );

      if (tipResponse.success && tipResponse.data?.response) {
        setAiTip(tipResponse.data.response);
      }

    } catch (error) {
      console.error('Error generating business insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <Target className="w-3 h-3 text-blue-500" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <Award className="w-4 h-4 text-green-500" />;
      case 'warning': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Business Insights
        </CardTitle>
        <CardDescription>
          Key metrics and AI-powered recommendations for your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {insights.map((insight) => (
                <div 
                  key={insight.id}
                  className="p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {getInsightIcon(insight.type)}
                      <span className="text-xs font-medium">{insight.title}</span>
                    </div>
                    {getTrendIcon(insight.trend)}
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {insight.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {insight.description}
                  </div>
                </div>
              ))}
            </div>

            {/* AI-Powered Tip */}
            {aiTip && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-2">
                      Astra's Business Tip 💡
                    </h4>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      {aiTip}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="/clients">
                  <Users className="w-4 h-4 mr-1" />
                  Clients
                </a>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href="/bookkeeping">
                  <DollarSign className="w-4 h-4 mr-1" />
                  Revenue
                </a>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
