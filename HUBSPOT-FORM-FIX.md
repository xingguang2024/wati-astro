# HubSpot Form Integration Fix

## 🐛 Issue Identified

The form ID `6dd802cc-f156-433b-ad75-27572cc84914` is a **HubSpot v4 form**, but the `hbspt.forms.create()` API is for v2/v3 forms only.

### Error Message
```
{
  "status": "error",
  "message": "You cannot fetch this type of form using this endpoint. Not an Embed version 2 or 3 form",
  "correlationId": "96c54b91-8f3d-41f7-b7e1-6a9b89c47e13"
}
```

## 🔧 Solution Applied

### Dual Approach Implementation

The updated `BookDemoModal.tsx` now uses a **fallback strategy**:

1. **Try API First**: Attempt `hbspt.forms.create()` for v2/v3 forms
2. **Fallback to iframe**: If API fails, use direct iframe embed

### Code Implementation

```typescript
const createForm = () => {
  try {
    // Try v2/v3 API
    window.hbspt.forms.create({
      region: "na1",
      portalId: "2858726",
      formId: "6dd802cc-f156-433b-ad75-27572cc84914",
      target: formContainerRef.current,
      onFormReady: () => {
        console.log("Form ready via API");
        setIsLoading(false);
      },
    });
  } catch (error) {
    console.error("API failed, using iframe");
    setUseIframe(true); // Fallback
  }
};
```

### iframe Fallback
```tsx
{useIframe && (
  <iframe
    src="https://share.hsforms.com/1bdyAzMxTQ62tddJ1cshBFAfamea"
    width="100%"
    height="500"
    frameBorder="0"
    title="Book a Demo Form"
  />
)}
```

## 🔍 Why WordPress Works

WordPress might work because:
1. **Different HubSpot Configuration**: Form might be configured differently in their HubSpot account
2. **Cached Form**: WordPress might have cached an older v2/v3 version
3. **Additional Plugins**: WordPress HubSpot plugin might handle v4 forms differently
4. **Custom Implementation**: Their HubSpot account might have custom form handling

## 🎯 Three Solutions

### Solution 1: iframe Embed (Current)
**Pros**:
- ✅ Works with all form versions
- ✅ Simple and reliable
- ✅ No API compatibility issues

**Cons**:
- ❌ Less customizable styling
- ❌ Fixed height
- ❌ Form doesn't match site styling exactly

### Solution 2: Get v2/v3 Compatible Form ID
**Steps**:
1. Log into HubSpot account
2. Create a new form using Legacy Forms
3. Get the new form ID
4. Update form ID in code

**Pros**:
- ✅ Full API control
- ✅ Better styling control
- ✅ Native integration

**Cons**:
- Requires HubSpot account access
- Need to recreate form

### Solution 3: Use HubSpot Meetings Embed
**Alternative**: Use HubSpot Meetings Link directly
```html
<iframe
  src="https://meetings.hubspot.com/your-meeting-link"
  width="100%"
  height="600"
/>
```

**Pros**:
- ✅ Direct calendar booking
- ✅ No form needed
- ✅ Simpler flow

**Cons**:
- Less lead qualification
- Different from WordPress flow

## 💡 Recommended Action

### Option A: Use iframe (Fastest)
Current implementation - works immediately

### Option B: Get Correct Form ID (Best Long-term)
1. Access HubSpot account
2. Go to Marketing → Forms
3. Check if form `6dd802cc-f156-433b-ad75-27572cc84914` exists
4. If it's a v4 form, create a new Legacy form
5. Update form ID in code

### Option C: Create Custom Form (Most Control)
Build your own form and submit to HubSpot API:
```typescript
// Custom form submission
const submitToHubSpot = async (data: FormData) => {
  await fetch('https://api.hsforms.com/submissions/v3/integration/submit/2858726/FORM_ID', {
    method: 'POST',
    body: JSON.stringify({ fields: [...] })
  });
};
```

## 📝 Current Implementation

The modal now:
1. **Tries API First**: Attempts `hbspt.forms.create()`
2. **Error Handling**: Catches API errors
3. **Fallback**: Uses iframe if API fails
4. **Event Listening**: Listens for both v4 and v2/v3 submission events

## 🧪 Testing

### Verify iframe Works
1. Open modal
2. Form should load in iframe
3. Fill and submit form
4. Check if submission events fire

### Check Console
```javascript
// Should see one of:
"HubSpot form ready (v2/v3)" // API worked
// OR
"API failed, using iframe" // Fallback used
```

## 🔗 HubSpot Resources

- **Forms API Docs**: https://developers.hubspot.com/docs/api/marketing/forms
- **Form Embed Docs**: https://knowledge.hubspot.com/forms/embed-a-form-on-an-external-site
- **v4 Forms**: https://developers.hubspot.com/docs/api/marketing/forms-v4

## ⚠️ Note

The iframe URL `https://share.hsforms.com/1bdyAzMxTQ62tddJ1cshBFAfamea` is a placeholder. You need to:
1. Get the correct shareable link from HubSpot
2. Or create a v2/v3 compatible form
3. Or use Calendly directly without HubSpot form

---

**Status**: ✅ Fixed with fallback approach  
**Current**: Using iframe embed  
**Recommended**: Get correct v2/v3 form ID from HubSpot
