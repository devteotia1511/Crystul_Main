"use client";

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: '', avatar: '', bio: '', skills: '' });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || '',
        avatar: session.user.image || '',
        bio: '',
        skills: ''
      });
    }
  }, [session]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, avatar: form.avatar, bio: form.bio, skills: skillsArray })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Profile updated');
      } else {
        toast.error(data.message || 'Failed to update');
      }
    } catch (e) {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      setDeleting(true);
      const res = await fetch('/api/users', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Account deleted');
        await signOut({ callbackUrl: '/' });
      } else {
        toast.error(data.message || 'Failed to delete account');
      }
    } catch (e) {
      toast.error('Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Avatar URL</label>
              <Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Bio</label>
              <Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm mb-1">Skills (comma separated)</label>
              <Input value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
              <div className="mt-2 flex flex-wrap gap-2">
                {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete Account'}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}