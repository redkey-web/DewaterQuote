# DeWater Products - Admin Guide

**For**: DeWater Products Team
**Version**: 2.0 (Inventory Management Update)
**Last Updated**: December 2025

---

## What's New

Your new website admin panel now includes powerful inventory and pricing management tools. Here's what you can do:

| Feature | What It Does | How Often You'll Use It |
|---------|--------------|------------------------|
| **Inventory Dashboard** | See stock levels, set products to quote-only or suspended | Daily |
| **Pricing Management** | View margins, run promotions, check profitability | Weekly |
| **Product Management** | Add/edit product details, images, specifications | Monthly |
| **Logistics Setup** | Manage shipping dimensions, supplier info | Quarterly/Setup |

### Designed for Simplicity

The admin panel shows you **what you need, when you need it**:
- **Essential data visible** - Important columns shown by default
- **"Show More" option** - Click to reveal additional columns when needed
- **Hover for help** - Tooltips explain what each column means
- **Unused features hidden** - Empty data columns stay out of your way

---

## Quick Start: Daily Tasks

### Checking Stock Levels

1. Go to **Admin > Inventory**
2. View at-a-glance stock status:
   - 🟢 **In Stock** - Good to go
   - 🟡 **Low Stock** - Consider reordering
   - 🔴 **Out of Stock** - No stock available
   - ⏸️ **Suspended** - Temporarily unavailable
   - 💬 **Quote Only** - Customers must request quote

### Setting a Product to "Quote Only"

Use this when you want customers to contact you for pricing instead of seeing a price:

1. Go to **Admin > Inventory**
2. Find the product(s) using search or filters
3. Tick the checkbox(es) next to the products
4. Click **"Set Quote Only"**
5. Customers will now see "Request Quote" instead of "Add to Cart"

**When to use Quote Only:**
- High-value items needing custom quotes
- Products with variable pricing
- Items you want to discuss with customer first
- Bulk order products

### Suspending a Product

Use this to temporarily hide a product from purchase (but keep it visible):

1. Go to **Admin > Inventory**
2. Select the product(s)
3. Click **"Suspend"**
4. Optionally add a reason (e.g., "Awaiting stock delivery")
5. Product shows "Temporarily Unavailable" to customers

**When to use Suspend:**
- Waiting for stock shipment
- Quality issues being resolved
- Supplier problems
- Seasonal items

### Re-activating Products

1. Go to **Admin > Inventory**
2. Filter by "Suspended" status
3. Select products to reactivate
4. Click **"Activate"**

---

## Weekly Tasks: Pricing & Margins

### Viewing Your Margins

1. Go to **Admin > Pricing**
2. See all products with:
   - **Cost** (what you pay)
   - **RRP** (recommended retail)
   - **Sell Price** (what customers pay)
   - **Margin %** (your profit percentage)

Margin colours tell you at a glance:
- 🔴 **Red** - Below 20% (needs attention)
- 🟡 **Yellow** - 20-30% (acceptable)
- 🟢 **Green** - Above 30% (healthy)

### Running a Promotion

1. Go to **Admin > Pricing**
2. Select the product(s)
3. Click **"Set Promotion"**
4. Enter:
   - **Promotion Price** (sale price)
   - **Start Date**
   - **End Date**
5. Save - customers will see the sale price during those dates

### Updating Prices

1. Go to **Admin > Pricing**
2. Click on a product row to expand
3. Edit the **Sell Price**
4. Save changes

**Note:** Cost and RRP can be edited directly in the admin panel.

---

## Monthly Tasks: Product Content

### Editing Product Details

1. Go to **Admin > Products**
2. Find and click on a product
3. Use the tabs:
   - **Details** - Name, description, category
   - **Features** - Bullet point features
   - **Media** - Images and datasheets
   - **Variations** - Size options and prices

### Adding Product Images

1. In the product editor, go to **Media** tab
2. Click **"Upload Image"**
3. Select your image file
4. Set as primary image if it should be the main photo
5. Save

**Image tips:**
- Use high-quality photos (minimum 800x800 pixels)
- Product on white background works best
- Show multiple angles if possible

### Adding PDF Datasheets

1. In the product editor, go to **Media** tab
2. Scroll to **Downloads** section
3. Click **"Upload Document"**
4. Select your PDF file
5. Give it a label (e.g., "Product Datasheet", "Installation Guide")
6. Save

---

## Quarterly Tasks: Logistics Setup

### Updating Shipping Information

1. Go to **Admin > Logistics**
2. Select the **Shipping** tab
3. Find and edit product shipping details:
   - Weight (kg)
   - Dimensions (Height, Width, Length in cm)
   - Shipping Category

**Why this matters:** Accurate shipping data helps with freight quotes and carrier calculations.

### Updating Supplier Information

1. Go to **Admin > Logistics**
2. Select the **Suppliers** tab
3. Edit supplier details:
   - Primary Supplier name
   - Supplier Item Code (their SKU)
   - Purchase Price

This is for your reference - customers don't see this information.

---

## Understanding Product States

Your products can be in different states:

| State | Visible to Customers? | Can Purchase? | How to Set |
|-------|----------------------|---------------|------------|
| **Active** | Yes | Yes (Add to Cart) | Default state |
| **Quote Only** | Yes | No (Request Quote) | Inventory page toggle |
| **Suspended** | Yes (with message) | No | Inventory page toggle |
| **Inactive** | No | No | Products page toggle |

### Customer Experience by State

**Active (normal)**
- Customer sees product with price
- Can add to cart
- Normal checkout flow

**Quote Only**
- Customer sees product
- Price shows "POA" or "Request Quote"
- "Get Quote" button instead of "Add to Cart"
- Submits quote request form

**Suspended**
- Customer sees product
- Shows "Temporarily Unavailable" badge
- Cannot add to cart
- Optionally shows reason if you set one

**Inactive**
- Product doesn't appear on website at all
- Use for discontinued items

---

## Your Product Data

All product information is managed through the admin panel and stored securely in the cloud.

### What You Can Manage

| Category | What's Included |
|----------|-----------------|
| **Inventory** | Stock quantities, incoming stock, expected arrivals |
| **Pricing** | Cost, RRP, sell price, promotions, customer tiers |
| **Products** | Names, descriptions, categories, variations, specs |
| **Logistics** | Shipping dimensions, weights, supplier info |
| **SEO** | Meta descriptions, page titles |

### Future Features

Let us know if you need:
- **Upsell Products** - "Customers also bought" suggestions
- **Kit Components** - Bundle products together
- **Date Tracking** - Show "New" badge on recent products

**Contact**: [Your developer contact]

---

## Data Protection & Backups

Your data is protected by multiple layers of backup and recovery options.

### Automatic Protection (Built-in)

| Protection | What It Does | You Need To Do |
|------------|--------------|----------------|
| **Point-in-Time Recovery** | Database can be restored to any point in the last 7-30 days | Nothing - automatic |
| **Nightly Backups** | Complete database backup every night to secure cloud storage | Nothing - automatic |

### What This Means For You

**If something goes wrong:**
- Accidental deletion? We can restore to before it happened
- Bad data update? We can roll back to a previous state

**Recovery time:**
- Minor issues: Minutes (instant database restore)
- Major issues: Hours (restore from backup)

### Export Your Own Backups

You can download your data anytime for your own records:

| Page | What You Get |
|------|--------------|
| **Inventory** > Export | Stock levels, status, all products |
| **Pricing** > Export | Costs, prices, margins |
| **Products** > Export | Full product details |
| **Settings** > Full Backup | Complete database export |

**Recommended**: Download a full backup monthly and store it safely.

### In Case of Emergency

If you ever need to restore data:

1. **Don't panic** - we have backups going back 30 days
2. **Stop making changes** - to preserve current state
3. **Contact us** with:
   - What happened
   - When it happened (approximate time)
   - What data was affected
4. **We'll restore** from the appropriate backup point

### What's NOT Backed Up

| Item | Why | What To Do |
|------|-----|------------|
| Uploaded images | Stored separately in cloud CDN | Keep original files |
| PDF datasheets | Stored separately | Keep original files |
| Email history | Not in database | Use your email client |

### Security

Your data is protected by:
- **Encrypted connections** (HTTPS/SSL)
- **Secure cloud hosting** (Vercel + Neon)
- **Access controls** (Admin login required)
- **Audit logging** (tracks who changed what)

---

## Frequently Asked Questions

### "How do I make a product quote-only?"
Go to Admin > Inventory, select the product, click "Set Quote Only". Customer will see "Request Quote" instead of a price.

### "How do I temporarily remove a product?"
Use "Suspend" - the product stays visible but shows "Temporarily Unavailable". Use "Inactive" to completely hide it.

### "How do I update stock levels?"
Go to Admin > Inventory, find the product, and update the stock quantity directly.

### "Can I change prices on the website?"
Yes! Go to Admin > Pricing, find the product, and edit the price directly.

### "What's the difference between Cost and RRP?"
- **Cost** = What you pay your supplier
- **RRP** = Recommended retail price (what supplier suggests you sell at)
- **Sell Price** = What you actually charge customers

### "How do I run a sale?"
Admin > Pricing > Select products > "Set Promotion" > Enter sale price and dates.

### "How do I edit Cost Price?"
Go to Admin > Pricing, find the product, click to expand, and edit the Cost field.

### "What's a healthy margin?"
Generally:
- Below 20% = Low (🔴 review pricing)
- 20-30% = Acceptable (🟡)
- Above 30% = Good (🟢)

Your industry may vary - discuss targets with your accountant.

### "There are too many columns - can I hide some?"
Yes! Click "Show More" to toggle optional columns on/off. The system remembers your preference. Columns with no data are hidden automatically.

### "What do the column headers mean?"
Hover over any column header to see a tooltip explaining what that data means and how to use it.

---

## Getting Help

### For Technical Issues
Contact: [Developer contact details]

### For Training
We offer training sessions on:
- Daily inventory management
- Pricing strategies
- Product content updates
- Bulk operations

Contact us to schedule.

---

## Quick Reference

| Task | Where | How Often |
|------|-------|-----------|
| Check stock | Inventory | Daily |
| Set quote-only | Inventory | As needed |
| Suspend product | Inventory | As needed |
| View margins | Pricing | Weekly |
| Run promotion | Pricing | As needed |
| Edit product | Products | Monthly |
| Update shipping | Logistics | Quarterly |
| Export data | Any page (Export button) | As needed |

---

*Guide Version 2.0 - December 2025*
*DeWater Products Website Admin System*
