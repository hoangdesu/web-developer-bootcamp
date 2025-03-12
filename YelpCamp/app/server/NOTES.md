# Server deployment notes

1️⃣ Update Your Cloudflare DNS
Go to Cloudflare Dashboard, select hoangdesu.com, and:

- Create an A record:
- Name: yelpcamp-server
- Type: A
- Value: <Your VPS IP>
- Proxy Status: DNS only (⚪️ gray cloud)

2️⃣ Update Nginx Configuration
Since you already have an existing server block for Atehea, you need to add a separate server block for yelpcamp-server.hoangdesu.com.

Edit or create the config file:

```
sudo nano /etc/nginx/sites-available/yelpcamp-server
```

Add this:
```
server {
    listen 80;
    server_name yelpcamp-server.hoangdesu.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    access_log /var/log/nginx/yelpcamp_access.log;
    error_log /var/log/nginx/yelpcamp_error.log;
}
```


3️⃣ Enable the New Site in Nginx
Run these commands:
```
sudo ln -s /etc/nginx/sites-available/yelpcamp-server /etc/nginx/sites-enabled/
sudo nginx -t  # Check if config is correct
sudo systemctl restart nginx
```

4️⃣ Start YelpCamp Server
Ensure your Node.js app is running on port 3001:

```
pm2 start "yarn run start:prod" --name yelpcamp-server
```

5️⃣ (Optional) Enable HTTPS for Security
To secure yelpcamp-server.hoangdesu.com with an SSL certificate:

```
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yelpcamp-server.hoangdesu.com
```

✅ Final Result
- atehea.com → Proxies Atehea app (port 5711).
- yelpcamp-server.hoangdesu.com → Proxies YelpCamp Server (port 3001).
Now both apps run on the same VPS but separate subdomains! 🎉 Let me know if you need any changes! 🚀
