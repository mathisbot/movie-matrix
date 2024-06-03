import { useEffect } from 'react';
import { useRouter } from 'next/router';

const UserPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/user/signup');
  }, [router]);

  return null;
};

export default UserPage;
