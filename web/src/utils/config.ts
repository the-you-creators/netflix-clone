interface Config {
  database: {
    type: 'sqlite' | 'supabase';
    url?: string;
    key?: string;
  };
  storage: {
    type: 'local' | 'supabase';
    basePath: string;
  };
}

export const config: Config = {
  database: {
    type: import.meta.env.PROD ? 'supabase' : 'sqlite',
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  storage: {
    type: import.meta.env.PROD ? 'supabase' : 'local',
    basePath: import.meta.env.PROD ? 'videos' : '/videos',
  },
};