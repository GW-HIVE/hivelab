# Requirements
The following must be available on your server:

* Node.js and npm
* docker
* Clone this repo into your home directory on the server and `git pull` after you've merged any new changes

## Preamble
Check that docker is running.
```
systemctl status docker
```

If docker is inactive, start it.
```
systemctl start docker
```

## Setting config parameters
After cloning this repo, you will need to set the paramters given in
conf/config.json. The "server" paramater can be "tst" or "prd" for
test or production server respectively. The "app_port" is the port
in the host that should map to docker container for the app.


## Creating and starting docker container for the APP

From the "app" subdirectory, run the python script given to build and start container:
  ```
  python3 create_app_container.py -s {DEP}
  docker ps --all
  ```
Where `{DEP}` is deployment you're starting (i.e. `tst` or `prd`). The last command should list docker all containers and you should see the container
you created "running_hivelab_app_{DEP}". To start this container, the best way is
to create a service file (/usr/lib/systemd/system/docker-hivelab-app-{DEP}.service),
and place the following content in it.

  ```
  [Unit]
  Description=Glyds APP Container
  Requires=docker.service
  After=docker.service

  [Service]
  Restart=always
  ExecStart=/usr/bin/docker start -a running_hivelab_app_{DEP}
  ExecStop=/usr/bin/docker stop -t 2 running_hivelab_app_{DEP}

  [Install]
  WantedBy=default.target
  ```
This will allow you to start/stop the container with the following commands, and ensure
that the container will start on server reboot.

  ```
  $ sudo systemctl daemon-reload 
  $ sudo systemctl enable docker-hivelab-app-{DEP}.service
  $ sudo systemctl start docker-hivelab-app-{DEP}.service
  $ sudo systemctl stop docker-hivelab-app-{DEP}.service
  ```


## Mapping APP and API containers to public domains
To map the APP and API containers to public domains (e.g. www.hivelab.org and api.hivelab.org),
add apache VirtualHost directives. This VirtualHost directive can be in a new f
ile (e.g. /etc/httpd/conf.d/hivelab.conf).

  ```
  <VirtualHost *:443>
    ServerName www.hivelab.org
    ProxyPass / http://127.0.0.1:{APP_PORT}/
    ProxyPassReverse / http://127.0.0.1:{APP_PORT}/
  </VirtualHost>

  ```

where {APP_PORT} and {API_PORT} are your port for the APP and API ports 
in conf/config.json file. You need to restart apache after this changes using 
the following command:

   ```
   $ sudo apachectl restart 
   ```


## Editing or adding new static global pages
The files corresponding to static global pages are under /app/public/html/, and all you
need to do is edit or add new file. When you create a new file, make sure it is named
page.$pageId.html where $pageId is a one word ID for your page. For example, if you 
want to create a new page for GFKB, you can create page.gfkb.html and this page
will be accessible at https://hivelab.biochemistry.gwu.edu/gfkb 

Note that all the files for static pages should have the tag \<hivelabtag\> in their
first line. 

## Editing or adding to the menu
The menu is controlled by the JSON file /app/src/components/global/config.json, and 
one can edit this JSON file to add/edit to the menu structure.

## Pushing changes to website
To push your changes, you'll have to stop and remove the docker image, then rebuild from the repo. Follow these steps:
1. Check which docker images are running:
`docker ps -a`
2. Stop running docker instances (using service file present in server):
`sudo systemctl stop docker-hivelab-app-{DEP}.service`
4. Remove container:
`docker rm <container name>`
5. Remove image:
`docker rmi <image id>`

From here, you can continue with Robel's pipeline above at the point of [building the container](https://github.com/GW-HIVE/hivelab#creating-and-starting-docker-container-for-the-app), and the three commands to start it up:
```
sudo systemctl daemon-reload 
sudo systemctl enable docker-hivelab-app-{DEP}.service
sudo systemctl start docker-hivelab-app-{DEP}.service
```








