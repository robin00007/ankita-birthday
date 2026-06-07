import { defaultConfig } from '@/lib/config';
import BirthdayApp from '@/components/BirthdayApp';

// Page renders with defaults; BirthdayApp decodes the ?data= param client-side
export default function Page() {
  return <BirthdayApp config={defaultConfig} />;
}
