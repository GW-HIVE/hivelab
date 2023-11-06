# Pulling New Hivelab Webpage Changes

These steps are for updating the new changes to the repository on a server where the [full deployment steps](/documentation/clean_deployment.md) have been already been done before. 

- [Docker System Status](#docker-system-status)
- [Stop and Remove Existing Container](#stop-and-remove-existing-docker-container)
- [Git Pull](#pull-new-changes-from-upstream)
- [Creating the App Docker Container](#creating-the-app-docker-container)
- [Starting the App Container](#starting-the-docker-container)

## Docker System Status 

Check that docker is running on the server with the following command. 

```
systemctl status docker
```

In the output, you should see `Active: active (running)` if docker is running.  

If docker is not running, start it using the following command.

```
systemctl start docker
```

## Stop and Remove Existing Docker Container 

Check the currently running docker containers using: 

```
docker ps
```

Identify the current hivelab docker container, it should be named something along the lines of `docker-hivelab-app-{DEP}` where `{DEP}` is the deployment server you are on (i.e. `tst` or `prd`). 

Since you are updating the repository on a server that already had the initial setup process done, the systemd service unit file should already exist at `/usr/lib/systemd/system/` and should be named something like `docker-hivelab-app-{DEP}.service`. 

Stop the docker container using the following command:

```
sudo systemctl stop docker-hivelab-app-{DEP}.service
```

Remove the stopped container and corresponding image using:

```
docker rm <CONTAINER_NAME>
docker rmi <IMAGE_ID>
```
The <CONTAINER_NAME> and <IMAGE_ID> information is in the `docker ps` output. 

## Pull New Changes from Upstream

Pull in your new changes to the `hivelab` repository. The repo is located in `/data/shared/repos/hivelab`. Use these commands:

```
cd /data/shread/repos/hivelab
git pull
```

The first command will move your current working directory to the git repo. The second command will pull in your new changes (make sure your new changes have been merged into the master branch already). 

## Creating the App Docker Container 

Move to the `app/` directory and run the python `create_app_container.py` script to build the docker container. 

```
cd app/
python3 create_app_container.py -s {DEP}
docker ps -a
```

The first command will move you into the `app/` directory. The second command will build the docker container. Replace `{DEP}` with the deployment you are starting (i.e. `tst` or `prd`). The last command will list all docker containers. The container you just built should be listed but not running yet. 

## Reloading the Docker Container

First, reload the systemd manager configuration using:

```
sudo systemctl daemon-reload
```

Next, enable the service: 

```
sudo systemctl enable docker-hivelab-app-{DEP}.service
```

Lastly, start the service to start the docker container:

```
sudo systemctl start docker-hivelab-app-{DEP}.service
```