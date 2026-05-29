

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { decryptDataforResponse } from '@/app/api/services/auth/Encrptdecrpt';
import { gethRoleAction } from '@/app/actions/StaffActions/hostalActivityAction/getRoleAction';
import { useSession } from 'next-auth/react';

export default function RoleRedirector() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
const { data: session } = useSession();
type UserRole = 'admin' | 'warden' | 'dsr' | null;
  useEffect(() => {
    async function fetchRole() {
      try {
  


        const response = await gethRoleAction();
        const token = String(session?.user?.token).split("NEXT2121ANG")[1];

      
        const decrypted = decryptDataforResponse(response.ApiData, token);

        
        const parsed = JSON.parse(decrypted);
        console.log('Decrypted data role:', parsed);

        const userRole: UserRole = parsed[0]?.type ?? null;
        
          //  const userRole="admin";
        console.log('User role:', userRole);
        setRole(userRole);
        setLoading(false);
        console.log('Fetched role:', userRole);

        // Redirect based on user role
        if (userRole === 'warden') {
          router.push('/dashboard/staff/hostelactivity/warden');
        } else if (userRole === 'admin') {
          router.push('/dashboard/staff/hostelactivity/admin');
        } else if (userRole === 'dsr') {
          router.push('/dashboard/staff/hostelactivity/dsr');
        } else {
          router.push('/unauthorized');
        }
      } catch (err) {
        console.error('Failed to fetch role:', err);
        setLoading(false);
        router.push('/error');
      }
    }

    fetchRole();
  }, [router]);
  return null;
}




