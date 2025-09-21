# TauOS Deployment Guide

## 🚀 Quick Deployment to Vercel

### 1. Environment Variables Setup

Copy all variables from `env/vercel-production.env` to your Vercel dashboard:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your TauOS project
3. Go to Settings → Environment Variables
4. Add each variable from the production env file

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### 3. Verify Deployment

- Main site: `https://tauos.vercel.app`
- Monitoring: `https://tauos.vercel.app/monitoring`
- Health check: `https://tauos.vercel.app/api/health`

## 📊 Monitoring Setup

### Local Monitoring (Development)

```bash
# Navigate to monitoring directory
cd monitoring

# Start monitoring stack
./setup-monitoring.sh

# Access URLs:
# - Grafana: http://localhost:3001 (admin/tauos2025)
# - Prometheus: http://localhost:9090
# - TauOS Monitoring: http://localhost:3000/monitoring
```

### Production Monitoring

For production monitoring, deploy Grafana and Prometheus to a separate server or use a cloud monitoring service.

## 🔧 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET_*` | App-specific JWT secrets | `tauos-app-jwt-secret-...` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxx...` |
| `EMAIL_DOMAIN` | Email domain | `tauos.org` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `ENABLE_MONITORING` | Enable monitoring | `true` |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit per window | `1000` |
| `MAX_FILE_SIZE` | Max upload size | `10485760` |

## 🛠️ Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check `DATABASE_URL` format
   - Verify SSL settings
   - Test connection manually

2. **JWT Errors**
   - Ensure all `JWT_SECRET_*` variables are set
   - Check JWT secret format

3. **Email Not Sending**
   - Verify `SENDGRID_API_KEY`
   - Check SendGrid account status

4. **Monitoring Not Working**
   - Ensure `ENABLE_MONITORING=true`
   - Check Prometheus configuration

### Health Check Endpoints

- `/api/health` - Overall system health
- `/api/monitoring/metrics` - Detailed metrics
- `/api/monitoring/metrics?format=prometheus` - Prometheus format

## 📈 Performance Optimization

### Database Optimization

- Use connection pooling
- Monitor query performance
- Set appropriate timeouts

### API Optimization

- Enable rate limiting
- Use caching where appropriate
- Monitor response times

### Monitoring

- Set up alerts for critical metrics
- Monitor error rates
- Track performance trends

## 🔒 Security Checklist

- [ ] All environment variables are set
- [ ] JWT secrets are unique per app
- [ ] Database connection uses SSL
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Sensitive files are in .gitignore

## 📞 Support

For deployment issues:
1. Check the health endpoint
2. Review Vercel logs
3. Verify environment variables
4. Test locally first

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring alerts
2. Configure backup strategy
3. Set up CI/CD pipeline
4. Implement additional security measures
