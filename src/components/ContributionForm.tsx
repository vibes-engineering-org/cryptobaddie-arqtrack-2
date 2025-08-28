"use client";

import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Textarea } from '~/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Slider } from '~/components/ui/slider';
import { X } from 'lucide-react';
import { useContributionTracker, ContributionFormData } from '~/hooks/use-contribution-tracker';

interface ContributionFormProps {
  onSuccess?: () => void;
}

export default function ContributionForm({ onSuccess }: ContributionFormProps) {
  const { submitContribution, isSubmitting, currentResearcher, isSDKLoaded } = useContributionTracker();
  
  const [formData, setFormData] = useState<ContributionFormData>({
    title: '',
    description: '',
    tags: [],
    impactScore: 5,
    farcasterPostUrl: ''
  });
  
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }

    const result = await submitContribution(formData);
    
    if (result) {
      setFormData({
        title: '',
        description: '',
        tags: [],
        impactScore: 5,
        farcasterPostUrl: ''
      });
      onSuccess?.();
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!isSDKLoaded) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Loading Farcaster integration...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentResearcher) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-muted-foreground">
              Please connect your Farcaster account to submit contributions
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Research Contribution</CardTitle>
        <CardDescription>
          Log your research progress and trigger automatic EAS attestation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Contribution Title</Label>
            <Input
              id="title"
              placeholder="Brief description of your research work"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your research findings, methodology, or progress made..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farcasterPost">Farcaster Post URL (Optional)</Label>
            <Input
              id="farcasterPost"
              placeholder="https://warpcast.com/username/0x..."
              value={formData.farcasterPostUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, farcasterPostUrl: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Link to your Farcaster post about this contribution
            </p>
          </div>

          <div className="space-y-2">
            <Label>Impact Score: {formData.impactScore}/10</Label>
            <Slider
              value={[formData.impactScore]}
              onValueChange={([value]) => setFormData(prev => ({ ...prev, impactScore: value }))}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Rate the potential impact of this contribution (1-10)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addTag}
                disabled={!tagInput.trim() || formData.tags.length >= 5}
              >
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Add up to 5 tags to categorize your contribution
            </p>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Contribution'}
            </Button>
          </div>
        </form>

        {currentResearcher && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Submitting as: <span className="font-medium">@{currentResearcher.username}</span>
              <br />
              This will create an EAS attestation for transparency and unlock weekly payouts.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}