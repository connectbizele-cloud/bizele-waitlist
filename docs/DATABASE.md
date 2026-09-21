# Database

## Database provider

Supabase PostgreSQL.

## Table

waitlist

### Columns

id
uuid
primary key

email
text
not null
unique

full_name
text
not null

user_type
text
not null
-- creator | brand

social_handle
text
nullable

social_platform
text
nullable

brand_name
text
nullable

website
text
nullable

created_at
timestamptz
default now()

## Rules

- Email must be unique.
- Validate user_type.
- Creator-specific fields are nullable for brands.
- Brand-specific fields are nullable for creators.
- created_at is server-generated.

## Security

- Never expose service-role credentials.
- Enable Row Level Security.
- Public users may submit valid waitlist records.
- Public users may read only the aggregate waitlist count if required.
- Do not expose the complete waitlist dataset to the frontend.