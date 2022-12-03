# Printboy

A simple service to print labels.

This is built for personal use case of easily printing return
labels from a Raspberry Pi but there is no reason it couldn't
be altered and improved for your use-cases.

It works by "generating" a label on a HTML canvas which is saved
as a png and then printed via an `lp` command.

## Setup

### Print install

The first thing to do is ensure the printer works via CUPs.

A lot of this is from these articles:
- https://www.baitando.com/it/2017/12/12/install-dymo-labelwriter-on-headless-linux
- https://www.taklischris.info/other/use-your-dymo-printer-on-ubuntu

1. Install CUPs `sudo apt-get install cups cups-client printer-driver-dymo` or `sudo dnf install cups-deve;`
1. Get printer definition
    1. `git clone https://github.com/matthiasbock/dymo-cups-drivers.git`
    1. `sudo mkdir -p /usr/share/cups/model`
    1. `sudo cp dymo-cups-drivers/ppd/lw450.ppd /usr/share/cups/model/`
1. Add yourself as a cups admin `sudo usermod -a -G lpadmin your-username`
1. Go to CUPs admin page [http://localhost:631](http://localhost:631)
    1. Use your computer login credentials for the username and password for the site
1. Install the printer
    1. **IMPORTANT**: Use `DYMO_LabelWriter_450_Turbo` for the printer
       name, otherwise `printboy` will no work.
    1. Label sizes are use are:
      - **30252 Address:** `1-1/8" x 3"`
      - **30364 Name Badge:** `2-1/4" x 4"` "Name Badge Labels"
1. Run a test print

### Install printboy

1. [Install node](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
1. Run `npx @gauntface/printboy setup`

#### Optional: Install Reverse Proxy

1. Run `sudo apt update && sudo apt install nginx`
1. Run `sudo nano /etc/nginx/sites-available/default`
    1. Change the `location / {` block to use:

        ```conf
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                # try_files $uri $uri/ =404;
                proxy_pass http://localhost:1314;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
                proxy_cache_valid 5m;
        }
        ```

1. Check for errors with `sudo nginx -t`
1. Restart with `sudo systemctl restart nginx`
