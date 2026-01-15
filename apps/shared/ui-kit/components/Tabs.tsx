import React, { createContext, useContext, useState, ReactNode, HTMLAttributes } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  variant: 'underline' | 'pills';
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultTab: string;
  variant?: 'underline' | 'pills';
  onChange?: (tabId: string) => void;
}

export interface TabListProps extends HTMLAttributes<HTMLDivElement> {}

export interface TabProps extends HTMLAttributes<HTMLButtonElement> {
  id: string;
  disabled?: boolean;
}

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

const Tabs: React.FC<TabsProps> = ({
  defaultTab,
  variant = 'underline',
  onChange,
  className = '',
  children,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange, variant }}>
      <div className={`athena-tabs ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabList: React.FC<TabListProps> = ({ className = '', children, ...props }) => {
  const { variant } = useTabsContext();

  const classes = [
    'athena-tabs-list',
    variant === 'pills' && 'athena-tabs-list-pills',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="tablist" {...props}>
      {children}
    </div>
  );
};

const Tab: React.FC<TabProps> = ({
  id,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === id;

  const classes = [
    'athena-tab',
    isActive && 'athena-tab-active',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${id}`}
      id={`tab-${id}`}
      disabled={disabled}
      onClick={() => setActiveTab(id)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabPanel: React.FC<TabPanelProps> = ({
  id,
  className = '',
  children,
  ...props
}) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      className={`athena-tab-panel ${className}`}
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      {...props}
    >
      {children}
    </div>
  );
};

Tabs.displayName = 'Tabs';
TabList.displayName = 'TabList';
Tab.displayName = 'Tab';
TabPanel.displayName = 'TabPanel';

export { Tabs, TabList, Tab, TabPanel };
export default Tabs;
