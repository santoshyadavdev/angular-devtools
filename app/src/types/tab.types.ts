export type Tab =
  'dashboard' | 'components' | 'pipes' | 'routes' | 'signals' | 'injectors' | 'store' | 'forms';

export type Tabs = {
  id: Tab;
  label: string;
};
