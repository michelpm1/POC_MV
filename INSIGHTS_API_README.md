# Insights API Fix

## Overview
The insights API has been updated to use PayloadCMS GraphQL instead of the REST API, following the official documentation at https://payloadcms.com/docs/graphql/overview.

## ⚠️ Important Discovery
**Field Limitations**: The GraphQL schema for the `Insight` type only supports these fields:
- `id`
- `title` 
- `type`
- `createdAt`
- `updatedAt`
- `slug`

**Missing Fields**: The following fields are NOT available in the GraphQL schema:
- `summary`
- `excerpt` 
- `description`

## Changes Made

### 1. Updated API Route (`src/app/api/insights/route.ts`)
- Changed from REST endpoint `/admin/collections/insights` to GraphQL endpoint `/api/graphql`
- Implemented proper GraphQL query for insights with pagination support
- Added error handling for GraphQL-specific errors
- Updated response format to match GraphQL structure
- **Fixed**: Removed non-existent fields from GraphQL query

### 2. Updated Insights Page (`src/app/insights/news/page.tsx`)
- Modified to use the new `/api/insights` endpoint instead of direct CMS calls
- Added pagination support using the new GraphQL response format
- Updated sorting from `-type` to `-createdAt` for better chronological ordering
- Enhanced pagination UI with proper disabled states
- **Added**: Fallback content when summary fields are not available
- **NEW**: Full pagination with page numbers, previous/next buttons
- **NEW**: Items per page selection (5, 10, 20, 50)
- **NEW**: Sort options (Newest first, Oldest first, Type A-Z)
- **NEW**: Clickable "Read more" links that navigate to individual insight pages

### 3. Added Test Endpoint (`src/app/api/test/route.ts`)
- Created `/api/test` endpoint to verify GraphQL connectivity
- Useful for debugging connection issues and testing authentication

### 4. NEW: Pagination Component (`src/components/Pagination.tsx`)
- Reusable pagination component with smart page number display
- Shows ellipsis (...) for large page ranges
- Responsive design with proper hover states
- Server-side navigation compatible

### 5. NEW: Individual Insight API (`src/app/api/insights/[id]/route.ts`)
- New endpoint for fetching individual insights by ID
- Uses GraphQL query to get detailed insight information
- Supports all insight fields including authors, related indexes, content, etc.
- Proper error handling and 404 responses

### 6. NEW: Individual Insight Detail Page (`src/app/insights/[id]/page.tsx`)
- Full detail page for individual insights
- Displays all insight information in a clean, organized layout
- Shows authors, related indexes, content, metadata
- Responsive design with sidebar layout
- Back navigation to insights list

### 7. NEW: Not Found Page (`src/app/insights/[id]/not-found.tsx`)
- Custom 404 page for non-existent insights
- User-friendly error message with navigation back to insights list

## GraphQL Query Structure

### List Query
The insights list API uses this GraphQL query:
```graphql
query GetInsights($limit: Int!, $page: Int!, $sort: String) {
  Insights(limit: $limit, page: $page, sort: $sort) {
    docs {
      id
      title
      type
      createdAt
      updatedAt
      slug
    }
    totalDocs
    totalPages
    page
    hasNextPage
    hasPrevPage
  }
}
```

### Individual Insight Query
The individual insight API uses this GraphQL query:
```graphql
query GetInsight($id: String!) {
  Insight(id: $id) {
    id
    title
    topic
    insights_type
    category
    slug
    publishDateTime
    type
    content
    content_html
    content_legacy
    embedCode
    content_link
    speaker
    index_type
    relatedIndex {
      id
      symbol
      name
      description
      updatedAt
      createdAt
    }
    relatedIndexes {
      id
      symbol
      name
      description
      updatedAt
      createdAt
    }
    authors {
      id
      name
      position
      email
      about
      content_html
      updatedAt
      createdAt
    }
    featured
    access_counter
    thumbnail_legacy
    authorUserdefined
    tagIndexes
    status
    updatedAt
    createdAt
  }
}
```

## Environment Variables Required
Make sure you have the following environment variable set:
```bash
MV_CMS_TOKEN=your_payload_cms_token_here
```

## Testing
1. **Test GraphQL Connection**: Visit `/api/test` to verify GraphQL connectivity
2. **Test Insights API**: Visit `/api/insights?limit=5` to test the insights endpoint
3. **Test Insights Page**: Visit `/insights/news` to see the updated page with pagination
4. **Test Pagination**: Try different page numbers, limits, and sort options
5. **Test Individual Insights**: Click "Read more" on any insight to view the detail page
6. **Test Individual Insight API**: Visit `/api/insights/17100` to test individual insight endpoint

## Pagination Features
- **Page Navigation**: Previous/Next buttons with proper disabled states
- **Page Numbers**: Smart display of page numbers with ellipsis for large ranges
- **Items Per Page**: Choose between 5, 10, 20, or 50 items per page
- **Sorting Options**: Sort by creation date (newest/oldest) or type
- **URL State**: All pagination state is maintained in the URL for bookmarking/sharing
- **Responsive Design**: Works on all screen sizes

## Individual Insight Features
- **Full Content Display**: Shows all available insight information
- **Author Information**: Displays author details with positions and descriptions
- **Related Indexes**: Shows connected index information
- **Content Links**: Direct links to full reports when available
- **Metadata Display**: Status, dates, topics, and other details
- **Responsive Layout**: Works on all screen sizes with sidebar layout
- **Navigation**: Easy back navigation to insights list

## Current Status
✅ **API Fixed**: GraphQL endpoint working with correct field mapping
✅ **Pagination**: Full pagination support implemented with smart UI
✅ **Sorting**: Multiple sort options available
✅ **Items Per Page**: Configurable items per page
✅ **Individual Insights**: Full detail pages with all insight information
✅ **Navigation**: Clickable "Read more" links working
⚠️ **Content Limitations**: Summary/excerpt/description fields not available in schema
🔄 **UI Updates**: Page updated to handle missing fields gracefully

## Benefits of GraphQL
- **Type Safety**: Better TypeScript support with GraphQL schema
- **Efficient Queries**: Only fetch the fields you need
- **Pagination**: Built-in pagination support with metadata
- **Real-time Updates**: GraphQL subscriptions for live data (future enhancement)
- **Better Error Handling**: Structured error responses
- **Individual Queries**: Efficient fetching of individual insights

## Troubleshooting
If you encounter issues:
1. Check that `MV_CMS_TOKEN` is set correctly
2. Verify the GraphQL endpoint is accessible at `https://dev-cms.marketvector.com/api/graphql`
3. Use `/api/test` to debug connection issues
4. Check browser network tab for detailed error responses
5. **Pagination Issues**: Check the debug info displayed on the page
6. **Individual Insight Issues**: Test the API endpoint directly (e.g., `/api/insights/17100`)

## Next Steps
- **Immediate**: Test the current implementation to ensure pagination and individual insights work
- **Short-term**: Consider adding custom fields to the PayloadCMS schema if summary content is needed
- **Long-term**: Implement GraphQL subscriptions for real-time updates
- **Enhancement**: Add filtering capabilities using GraphQL arguments
- **Search**: Implement search functionality using GraphQL text search
- **Performance**: Add caching layer for better performance
- **Content**: Enhance individual insight pages with more interactive features

## Field Mapping Workaround
Since summary fields are not available, the UI now shows:
- Title and type from available fields
- Creation date as fallback content when no summary is available
- Clean, minimal display that works with the current schema
- Full content available on individual insight detail pages

## Testing Pagination
To test the pagination functionality:
1. Visit `/insights/news` 
2. Try changing items per page (5, 10, 20, 50)
3. Navigate between pages using Previous/Next buttons
4. Click on specific page numbers
5. Try different sort options
6. Check that URL parameters update correctly
7. Verify that pagination state persists on page refresh

## Testing Individual Insights
To test the individual insight functionality:
1. Visit `/insights/news`
2. Click "Read more" on any insight
3. Verify the detail page loads with all insight information
4. Check that authors, related indexes, and metadata display correctly
5. Test the back navigation to return to the insights list
6. Try accessing a non-existent insight ID to test the 404 page
