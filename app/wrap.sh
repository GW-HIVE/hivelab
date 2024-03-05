sudo systemctl stop docker-hivelab-app-tst.service
python3 create_app_container.py -s tst
sudo systemctl start docker-hivelab-app-tst.service

