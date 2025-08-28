"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ScrollArea } from '~/components/ui/scroll-area';
import { SemanticDefinition } from '~/types/arq-track';
import { 
  BookOpen, 
  Leaf, 
  Zap, 
  Network, 
  Target,
  TreePine,
  Waves,
  Sun
} from 'lucide-react';

const SEMANTIC_DEFINITIONS: SemanticDefinition[] = [
  {
    term: "Contribution",
    definition: "A discrete unit of research work or progress logged by a researcher, representing a nutrient input into the Cookie Jar Raid OS ecosystem.",
    context: "contribution",
    examples: [
      "Research findings documentation",
      "Methodology development",
      "Data analysis completion",
      "Literature review submission",
      "Experimental results reporting"
    ]
  },
  {
    term: "Payout",
    definition: "An automated 0.08 ETH weekly transfer to researchers based on verified contributions, representing capital flow through the ecosystem's circulatory system.",
    context: "payout",
    examples: [
      "Weekly ETH transfer for verified work",
      "Multi-chain distribution (Base, Celo, Arbitrum)",
      "Contribution-triggered compensation",
      "Automated value recognition"
    ]
  },
  {
    term: "Attestation",
    definition: "An immutable EAS (Ethereum Attestation Service) record that serves as a growth signal, verifying the authenticity and impact of a contribution.",
    context: "attestation",
    examples: [
      "On-chain verification of research work",
      "Transparency mechanism for funders",
      "Immutable contribution record",
      "Trust-building infrastructure"
    ]
  },
  {
    term: "Nutrient Flow",
    definition: "The movement of value, information, and resources through the research ecosystem, analogous to nutrients flowing through a biological system.",
    context: "system",
    examples: [
      "Contributions entering the system",
      "Knowledge sharing between researchers",
      "Capital allocation to productive work",
      "Feedback loops creating system health"
    ]
  },
  {
    term: "Growth Signal",
    definition: "Measurable indicators of ecosystem vitality and expansion, similar to growth hormones in biological systems.",
    context: "system",
    examples: [
      "New researcher onboarding rate",
      "Contribution quality improvements",
      "Engagement rate increases",
      "Cross-pollination of ideas"
    ]
  },
  {
    term: "Total Value Flow (TVF)",
    definition: "The aggregate economic value unlocked through the system, targeting $100-$150/week to achieve 10× researcher throughput.",
    context: "system",
    examples: [
      "Weekly payout volume in USD",
      "Economic impact measurement",
      "Capital efficiency indicator",
      "Ecosystem productivity metric"
    ]
  },
  {
    term: "Coordination Friction",
    definition: "Inefficiencies in research coordination that reduce throughput by 25-30%, addressed through automation and clear semantic mapping.",
    context: "system",
    examples: [
      "Manual feedback loops",
      "Unclear contribution standards",
      "Payment processing delays",
      "Communication bottlenecks"
    ]
  },
  {
    term: "Ecological Health",
    definition: "The overall vitality of the research ecosystem, measured through nutrient flows, growth signals, and system resilience.",
    context: "system",
    examples: [
      "Thriving: High growth and engagement",
      "Growing: Positive trajectory indicators",
      "Stable: Consistent operation",
      "Declining: Needs intervention"
    ]
  }
];

const ECOLOGICAL_ANALOGIES = [
  {
    biological: "Photosynthesis",
    system: "Contribution Creation",
    description: "Researchers convert raw ideas and effort into structured contributions, like plants converting sunlight into energy.",
    icon: Sun
  },
  {
    biological: "Root System",
    system: "EAS Attestations",
    description: "Attestations create deep, immutable roots that anchor contributions and provide stability to the ecosystem.",
    icon: TreePine
  },
  {
    biological: "Circulatory System",
    system: "Payout Network",
    description: "Automated payments flow like blood through the system, delivering resources where they're needed most.",
    icon: Waves
  },
  {
    biological: "Nervous System",
    system: "Farcaster Integration",
    description: "Communication channels carry signals rapidly throughout the network, enabling coordinated responses.",
    icon: Network
  },
  {
    biological: "Growth Hormones",
    system: "Engagement Metrics",
    description: "Key performance indicators guide system development and optimization, like hormones regulating growth.",
    icon: Zap
  },
  {
    biological: "Symbiosis",
    system: "Multi-chain Collaboration",
    description: "Different chains work together synergistically, each contributing unique strengths to the ecosystem.",
    icon: Leaf
  }
];

export default function SemanticFramework() {
  const getContextIcon = (context: string) => {
    switch (context) {
      case 'contribution':
        return <BookOpen className="h-4 w-4" />;
      case 'payout':
        return <Target className="h-4 w-4" />;
      case 'attestation':
        return <Zap className="h-4 w-4" />;
      case 'system':
        return <Network className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'contribution':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payout':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'attestation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'system':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Semantic Framework</h2>
        <p className="text-muted-foreground">
          Clear, shared definitions based on Regen Network's semantic mapping and Gitcoin's ecological analogies
        </p>
      </div>

      <Tabs defaultValue="definitions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="definitions">Term Definitions</TabsTrigger>
          <TabsTrigger value="analogies">Ecological Analogies</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Standardized Definitions
              </CardTitle>
              <CardDescription>
                Consistent mental models for all system participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-6">
                  {SEMANTIC_DEFINITIONS.map((definition) => (
                    <div key={definition.term} className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getContextIcon(definition.context)}
                        <h3 className="text-lg font-semibold">{definition.term}</h3>
                        <Badge 
                          variant="outline"
                          className={getContextColor(definition.context)}
                        >
                          {definition.context}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {definition.definition}
                      </p>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Examples:</h4>
                        <ul className="space-y-1">
                          {definition.examples.map((example, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-xs mt-1">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analogies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Ecological System Analogies
              </CardTitle>
              <CardDescription>
                Understanding the Cookie Jar Raid OS as a living system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4">
                  {ECOLOGICAL_ANALOGIES.map((analogy, index) => {
                    const IconComponent = analogy.icon;
                    return (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="h-5 w-5 text-green-600" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{analogy.biological}</h3>
                            <span className="text-muted-foreground">→</span>
                            <h3 className="font-semibold text-blue-600">{analogy.system}</h3>
                          </div>
                          <p className="text-muted-foreground">{analogy.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-2">System Philosophy</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The Cookie Jar Raid OS operates as a living ecosystem where contributions flow like nutrients, 
                    attestations provide structural integrity like root systems, and payouts circulate value like 
                    a biological circulatory system. This ecological approach helps identify bottlenecks, optimize 
                    resource allocation, and maintain system health through natural feedback mechanisms.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-green-600">Health Indicators</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Regular nutrient flow (contributions)</li>
                      <li>• Strong root system (attestations)</li>
                      <li>• Efficient circulation (payouts)</li>
                      <li>• Adaptive growth (new researchers)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 text-red-600">Stress Indicators</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Reduced contribution flow</li>
                      <li>• Attestation bottlenecks</li>
                      <li>• Payment delays or failures</li>
                      <li>• Researcher churn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}