"use client";

import { useState } from 'react';
import { PROJECT_TITLE } from "~/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import Dashboard from '~/components/Dashboard';
import ContributionForm from '~/components/ContributionForm';
import ProgressTracker from '~/components/ProgressTracker';
import SemanticFramework from '~/components/SemanticFramework';
import { LayoutDashboard, FileText, BarChart3, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 min-h-screen">
      {/* TEMPLATE_CONTENT_START - Replace content below */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {PROJECT_TITLE}
          </h1>
          <p className="text-lg text-muted-foreground">
            Cookie Jar Raid OS - Automating research coordination and unlocking 10× researcher throughput
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="contribute" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contribute
            </TabsTrigger>
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="framework" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Framework
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard />
          </TabsContent>

          <TabsContent value="contribute" className="mt-6">
            <ContributionForm />
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <ProgressTracker />
          </TabsContent>

          <TabsContent value="framework" className="mt-6">
            <SemanticFramework />
          </TabsContent>
        </Tabs>
      </div>
      {/* TEMPLATE_CONTENT_END */}
    </div>
  );
}
