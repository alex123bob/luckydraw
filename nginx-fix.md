# Nginx Proxy Fix Without Code Changes

The issue is that your nginx config only proxies `/luckydraw` to the app, but the app's static files (CSS, JS, data) are at different paths.

## Current Problem
- App runs at `http://localhost:6006/` (root)
- Nginx serves it at `http://yourdomain.com/luckydraw`
- App requests `../css/style.css` → resolves to `http://yourdomain.com/css/style.css` (404)
- Nginx doesn't proxy `/css/`, `/js/`, `/data/` paths

## Solution: Update Nginx Config

Add these location blocks to proxy static files:

```nginx
server {
    # ... your existing server config
    
    location /luckydraw {
        proxy_pass http://localhost:6006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Add these location blocks for static files
    location /css/ {
        proxy_pass http://localhost:6006/css/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /js/ {
        proxy_pass http://localhost:6006/js/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /data/ {
        proxy_pass http://localhost:6006/data/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Alternative: Rewrite Paths in Nginx

If you can't add multiple location blocks, use rewrite rules:

```nginx
location /luckydraw {
    proxy_pass http://localhost:6006;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Rewrite static file requests
    location ~ ^/luckydraw/(css|js|data)/ {
        rewrite ^/luckydraw/(.*)$ /$1 break;
        proxy_pass http://localhost:6006;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Why This Works

1. **App unchanged**: Uses relative paths (`../css/style.css`)
2. **Browser**: Requests `http://yourdomain.com/css/style.css` 
3. **Nginx**: Proxies `/css/` to `localhost:6006/css/`
4. **Express**: Serves files from `css/` directory

## Test After Changes

1. Reload nginx: `sudo nginx -s reload`
2. Clear browser cache
3. Visit `http://yourdomain.com/luckydraw`
4. Check browser DevTools → Network tab for 404 errors

## Minimal Code Alternative

If you must change code, only modify the HTML base path:

```html
<!-- Add this to <head> section -->
<base href="/luckydraw/">
```

This makes all relative URLs resolve from `/luckydraw/` instead of current directory.