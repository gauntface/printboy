# Printboy

A simple service to print labels.

This is built for personal use case of easily printing return
labels from a Raspberry Pi but there is no reason it couldn't
be altered and improved for your use-cases.

It works by "generating" a label on a HTML canvas which is saved
as a png and then printed via an `lp` command.

![Printboy](printboy-screenshot.png)

## Setup

### Print install

The first thing to do is ensure the printer works via CUPs.

A lot of this is from these articles:
- https://www.baitando.com/it/2017/12/12/install-dymo-labelwriter-on-headless-linux
- https://www.taklischris.info/other/use-your-dymo-printer-on-ubuntu

1. Install CUPs `sudo apt-get install -y git cups cups-client printer-driver-dymo` or `sudo dnf install cups-devel`
1. Get printer definition
    1. `git clone https://github.com/matthiasbock/dymo-cups-drivers.git`
    1. `sudo mkdir -p /usr/share/cups/model`
    1. `sudo cp dymo-cups-drivers/ppd/lw450.ppd /usr/share/cups/model/`
1. Add yourself as a cups admin `sudo usermod -a -G lpadmin $USER`
1. Allow remote access to cups:

    ```sh
    sudo cupsctl --remote-admin
    sudo service cups restart
    ```

1. Go to CUPs admin page [http://localhost:631](http://localhost:631)
    1. Use your computer login credentials for the username and password for the site
1. Install the printer
    1. **IMPORTANT**: Use `DYMO_LabelWriter_450_Turbo` for the printer
       name, otherwise `printboy` will not work.
    1. Cups should pick the correct driver for you.
    1. For general:
        - Output Resolution: 300x600 DPI
        - Print Quality: Barcodes and Graphics
        - Media Size:
            - **30252 Address:** `1-1/8" x 3"`
            - **30364 Name Badge:** `2-1/4" x 4"`
1. Run a test print

### Install printboy

1. [Install node](https://github.com/nodesource/distributions/blob/master/README.md#debinstall)
1. Run `npm install @gauntface/printboy`
1. Run `cd node_modules/@gauntface/printboy`
1. Run `npm run setup`
1. **Look at the output for the pm2 command to setup startup**

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
