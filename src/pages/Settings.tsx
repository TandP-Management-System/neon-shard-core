import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Upload, Save, Key, User, Mail, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.role === 'student' ? 'Computer Science' : '',
  });

  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string>(
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`
  );

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock profile update
    toast.success('Profile updated successfully!');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }

    // Mock password reset
    toast.success('Password reset successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image upload - use a placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
        toast.success('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout userRole={user?.role || 'student'}>
      <div className="container mx-auto p-6 max-w-4xl space-y-6">
        {/* Page Header */}
        <div>
          <h1 className={`text-3xl font-bold mb-2 ${theme === 'neon' ? 'neon-glow' : ''}`}>
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Picture */}
        <Card className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profilePicture} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              <Label htmlFor="picture">
                <Button
                  type="button"
                  variant="outline"
                  className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}
                  onClick={() => document.getElementById('picture')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Picture
                </Button>
              </Label>
              <p className="text-sm text-muted-foreground mt-2">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="inline mr-2 h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={theme === 'neon' ? 'neon-border' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="inline mr-2 h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="Enter your email"
                  className={theme === 'neon' ? 'neon-border' : ''}
                />
              </div>

              {user?.role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="department">
                    <Building2 className="inline mr-2 h-4 w-4" />
                    Department
                  </Label>
                  <Select
                    value={profileData.department}
                    onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                  >
                    <SelectTrigger className={theme === 'neon' ? 'neon-border' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                type="submit"
                className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Reset */}
        <Card className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  <Key className="inline mr-2 h-4 w-4" />
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className={theme === 'neon' ? 'neon-border' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className={theme === 'neon' ? 'neon-border' : ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className={theme === 'neon' ? 'neon-border' : ''}
                />
              </div>

              <Button
                type="submit"
                className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}
              >
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Theme Preferences */}
        <Card className={theme === 'neon' ? 'glass neon-border' : 'glass-luxe'}>
          <CardHeader>
            <CardTitle>Theme Preferences</CardTitle>
            <CardDescription>Customize your visual experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Current Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'neon' ? 'Futuristic Neon' : 'Dark Luxe'}
                  </p>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  className={theme === 'neon' ? 'neon-border' : 'luxe-glow'}
                >
                  Switch to {theme === 'neon' ? 'Dark Luxe' : 'Futuristic Neon'}
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    theme === 'neon'
                      ? 'neon-border bg-primary/10'
                      : 'border-muted-foreground/20'
                  }`}
                  onClick={() => theme !== 'neon' && toggleTheme()}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 animate-glow" />
                    <p className="font-medium">Futuristic Neon</p>
                    <p className="text-xs text-muted-foreground">Vibrant & Dynamic</p>
                  </div>
                </div>
                <div
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    theme === 'luxe'
                      ? 'luxe-glow bg-primary/10'
                      : 'border-muted-foreground/20'
                  }`}
                  onClick={() => theme !== 'luxe' && toggleTheme()}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br from-amber-400 to-rose-400" />
                    <p className="font-medium">Dark Luxe</p>
                    <p className="text-xs text-muted-foreground">Elegant & Refined</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
