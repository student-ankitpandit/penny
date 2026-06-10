export const CODING_TOOLS = [
  { id: 'claude_pro', name: 'Claude Pro', provider: 'Anthropic', icon: 'chatbubble-ellipses', color: '#D97757', defaultPrice: 20, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'claude_max_5x', name: 'Claude Max 5x', provider: 'Anthropic', icon: 'chatbubble-ellipses', color: '#D97757', defaultPrice: 100, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'claude_max_20x', name: 'Claude Max 20x', provider: 'Anthropic', icon: 'chatbubble-ellipses', color: '#D97757', defaultPrice: 200, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'cursor_pro', name: 'Cursor Pro', provider: 'Cursor', icon: 'code-slash', color: '#00A0FF', defaultPrice: 20, cycle: 'monthly', category: 'Code Editor' },
  { id: 'cursor_business', name: 'Cursor Business', provider: 'Cursor', icon: 'code-slash', color: '#00A0FF', defaultPrice: 40, cycle: 'monthly', category: 'Code Editor' },
  { id: 'chatgpt_plus', name: 'ChatGPT Plus', provider: 'OpenAI', icon: 'bulb', color: '#10A37F', defaultPrice: 20, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'chatgpt_pro', name: 'ChatGPT Pro', provider: 'OpenAI', icon: 'bulb', color: '#10A37F', defaultPrice: 200, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'codex_openai', name: 'Codex (OpenAI)', provider: 'OpenAI', icon: 'terminal', color: '#10A37F', defaultPrice: 0, cycle: 'monthly', category: 'Coding Agent' },
  { id: 'gemini_advanced', name: 'Gemini Advanced', provider: 'Google', icon: 'sparkles', color: '#4285F4', defaultPrice: 20, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'google_one_ai', name: 'Google One AI Premium', provider: 'Google', icon: 'sparkles', color: '#4285F4', defaultPrice: 250, cycle: 'monthly', category: 'AI Assistant' },
  { id: 'perplexity_pro', name: 'Perplexity Pro', provider: 'Perplexity', icon: 'search', color: '#20B2AA', defaultPrice: 20, cycle: 'monthly', category: 'AI Search' },
  { id: 'github_copilot', name: 'GitHub Copilot', provider: 'GitHub', icon: 'logo-github', color: '#AAAAAA', defaultPrice: 10, cycle: 'monthly', category: 'Code Assistant' },
  { id: 'github_copilot_pro_plus', name: 'GitHub Copilot Pro+', provider: 'GitHub', icon: 'logo-github', color: '#AAAAAA', defaultPrice: 39, cycle: 'monthly', category: 'Code Assistant' },
  { id: 'windsurf_pro', name: 'Windsurf Pro', provider: 'Codeium', icon: 'code-working', color: '#09B6A2', defaultPrice: 15, cycle: 'monthly', category: 'Code Editor' },
  { id: 'replit_core', name: 'Replit Core', provider: 'Replit', icon: 'layers', color: '#F26522', defaultPrice: 25, cycle: 'monthly', category: 'Cloud IDE' },
  { id: 'v0_pro', name: 'v0 Pro', provider: 'Vercel', icon: 'triangle', color: '#AAAAAA', defaultPrice: 20, cycle: 'monthly', category: 'AI Builder' },
  { id: 'bolt_pro', name: 'Bolt.new Pro', provider: 'StackBlitz', icon: 'flash', color: '#FFD700', defaultPrice: 20, cycle: 'monthly', category: 'AI Builder' },
  { id: 'tabnine_pro', name: 'Tabnine Pro', provider: 'Tabnine', icon: 'analytics', color: '#6C63FF', defaultPrice: 12, cycle: 'monthly', category: 'Code Assistant' },
  { id: 'lovable_pro', name: 'Lovable Pro', provider: 'Lovable', icon: 'heart', color: '#FF6B9D', defaultPrice: 25, cycle: 'monthly', category: 'AI Builder' },
  { id: 'custom', name: 'Custom Tool', provider: 'Other', icon: 'construct', color: '#9CA3AF', defaultPrice: 0, cycle: 'monthly', category: 'Other' },
];

export const getToolById = (id) => CODING_TOOLS.find((t) => t.id === id);

export const SUBSCRIPTION_CATEGORIES = [
  'AI Assistant',
  'Code Editor',
  'Code Assistant',
  'Coding Agent',
  'AI Search',
  'AI Builder',
  'Cloud IDE',
  'Other',
];
