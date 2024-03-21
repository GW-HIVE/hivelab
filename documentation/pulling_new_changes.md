# Pulling New Hivelab Webpage Changes

These steps are for updating the new changes to the repository on a server where the [full deployment steps](/documentation/clean_deployment.md) have been already been done before. 

- [Stop and Remove Existing Container](#stop-and-remove-existing-docker-container)
- [Git Pull](#pull-new-changes-from-upstream)
- [Creating the App Docker Container](#creating-the-app-docker-container)
- [Starting the App Container](#starting-the-docker-container)
    - [Using the Service File (recommended)](#using-the-service-file-recommended)
    - [Manually Start the Container (not recommended)](#manually-start-the-container-not-recommended)

## Stop and Remove Existing Docker Container 

You can *most likely* skip this section. The `create_app_container.py` script uses the `-f` flag during the `docker rm` step to force the stoppage and removal of the existing container automatically. However, if you would rather/or for whatever reason have to do this manually, follow the steps below:

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

Note: You might run into permission issues with the Python subprocess `npm run build` command. If this is the case, just run `sudo npm run build` from the `app/` director yourself before running the `create_app_container` script. 

## Reloading the Docker Container

Since you are on a machine that already has the hivelab repo setup, the service file should already exist for this docker container, meaning it should startup automatically. However, if for whatever reason the container does not start automatically you have a couple options:

### Using the Service File (recommended)

Enable the service file: 

```
sudo systemctl enable docker-hivelab-app-{DEP}.service
```

Start the service to start the docker container:

```
sudo systemctl start docker-hivelab-app-{DEP}.service
```

### Manually Start the Container (not recommended)

Start the container:

```
docker start running_hivelab_app_{DEP}
```
