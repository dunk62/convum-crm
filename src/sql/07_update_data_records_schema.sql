-- Add ㅐㅜew columns to data_records table for AI analysis
alter table public.data_records
add column if not exists company_name text,
add column if not exists contact_name text,
add column if not exists summary text,
add column if not exists sentiment_score integer,
add column if not exists keywords text[],
add column if not exists next_action text[],
add column if not exists recording_link text,
add column if not exists analysis_metadata jsonb;

-- Add comments for clarity
comment on column public.data_records.company_name is 'Company name extracted from analysis';
comment on column public.data_records.contact_name is 'Contact person name extracted from analysis';
comment on column public.data_records.summary is '3-line summary of the conversation';
comment on column public.data_records.sentiment_score is 'Sentiment score (0-100)';
comment on column public.data_records.keywords is 'Key topics or keywords';
comment on column public.data_records.next_action is 'List of action items';
comment on column public.data_records.recording_link is 'Link to the source file (e.g., Google Drive)';
comment on column public.data_records.analysis_metadata is 'Additional metadata from AI analysis';
