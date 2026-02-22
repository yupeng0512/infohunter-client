export type Source = 'twitter' | 'youtube' | 'blog';

export type SubscriptionType = 'keyword' | 'author' | 'topic' | 'feed';

export type SubscriptionStatus = 'active' | 'paused' | 'deleted';

export type FetchLogStatus = 'success' | 'failed' | 'partial';

export type CreditOperation =
  | 'trends'
  | 'advanced_search'
  | 'keyword_search'
  | 'author_search'
  | 'subscription';

export type CreditContext = 'explore' | 'subscription' | 'manual';

export type NotifyMode = 'incremental' | 'top_list' | 'full_report';
