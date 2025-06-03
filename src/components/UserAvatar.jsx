import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

const UserAvatar = ({ user, className = '' }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Avatar className={className}>
      {user?.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name || 'User'} />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;