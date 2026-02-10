# Production Deployment Checklist

## Before Deploying

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-backend-domain.com

# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Razorpay Configuration (Use LIVE keys for production)
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

#### Frontend (.env)
```env
# Backend API URL
VITE_API_URL=https://your-backend-domain.com
```

### Database Setup

- [ ] Run all SQL migrations
- [ ] Create admin user
- [ ] Set up categories and initial products
- [ ] Run `add-razorpay-fields.sql` migration
- [ ] Verify all indexes are created
- [ ] Test database connection from backend

### Razorpay Setup

- [ ] Complete KYC verification
- [ ] Activate live mode
- [ ] Replace test keys with live keys
- [ ] Configure webhooks with production URL
- [ ] Test payment in live mode (small amount)
- [ ] Set up payment notifications

### Security

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] `.env` files are in `.gitignore`
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Webhook signatures are verified
- [ ] SQL injection prevention is in place
- [ ] XSS protection is enabled

### Testing

- [ ] All API endpoints work
- [ ] Authentication flow works
- [ ] Cart operations work
- [ ] Checkout with COD works
- [ ] Checkout with Razorpay works
- [ ] Order creation works
- [ ] Admin panel is accessible
- [ ] Image upload works
- [ ] Email notifications work (if implemented)
- [ ] Mobile responsiveness tested

### Performance

- [ ] Database queries are optimized
- [ ] Images are compressed
- [ ] CDN is configured (if applicable)
- [ ] Caching headers are set
- [ ] Bundle size is optimized
- [ ] Lazy loading is implemented

### Monitoring

- [ ] Error logging is set up
- [ ] Payment logs are monitored
- [ ] Server health checks are configured
- [ ] Database backups are scheduled
- [ ] Uptime monitoring is active

## Deployment Steps

### Backend Deployment (Render/Vercel/Railway)

1. Connect your repository
2. Set build command: `cd backend && npm install && npm run build`
3. Set start command: `cd backend && npm start`
4. Add all environment variables
5. Deploy and verify

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy and verify

### Post-Deployment

- [ ] Test production URLs
- [ ] Verify CORS settings
- [ ] Test payment flow end-to-end
- [ ] Check all images load
- [ ] Test admin login
- [ ] Create a test order
- [ ] Verify webhook is receiving events
- [ ] Monitor error logs

## Common Issues

### CORS Errors
- Ensure `FRONTEND_URL` in backend includes your production domain
- Check CORS configuration in `app.ts`

### Payment Not Working
- Verify Razorpay keys are live keys (not test)
- Check webhook URL is correct
- Ensure HTTPS is enabled

### Database Connection Failed
- Verify Supabase credentials
- Check if Supabase project is active
- Ensure RLS policies are correct

### Images Not Loading
- Check Supabase storage bucket is public
- Verify CORS settings in Supabase
- Ensure image URLs are correct

## Rollback Plan

If something goes wrong:

1. Revert to previous deployment
2. Check error logs
3. Fix issues in development
4. Test thoroughly
5. Redeploy

## Support Contacts

- Razorpay Support: https://razorpay.com/support/
- Supabase Support: https://supabase.com/support
- Vercel Support: https://vercel.com/support

## Maintenance

### Regular Tasks

- [ ] Monitor payment success rate
- [ ] Check error logs weekly
- [ ] Review database performance
- [ ] Update dependencies monthly
- [ ] Backup database regularly
- [ ] Test payment flow monthly
- [ ] Review security logs

### Monthly Review

- [ ] Payment reconciliation
- [ ] Performance metrics
- [ ] User feedback analysis
- [ ] Security audit
- [ ] Dependency updates
- [ ] Database optimization

## Emergency Contacts

Keep these handy:
- Razorpay Support: support@razorpay.com
- Your hosting provider support
- Database administrator
- DevOps team

## Version Control

- [ ] Tag the release version
- [ ] Document changes in CHANGELOG
- [ ] Update README with new features
- [ ] Create release notes

## Documentation

- [ ] API documentation is up to date
- [ ] README is complete
- [ ] Setup guides are accurate
- [ ] Admin guides are available
- [ ] User guides are ready

## Legal & Compliance

- [ ] Privacy policy is updated
- [ ] Terms of service are clear
- [ ] Payment gateway T&C are linked
- [ ] Refund policy is documented
- [ ] GDPR compliance (if applicable)

---

**Last Updated:** [Date]
**Deployment Version:** [Version Number]
**Deployed By:** [Name]
