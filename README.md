# Mars Project

## Contents
* Dashboard library
* Display Dashboard
* Customer list maintain
* Pre-alert setup system
* Invoice process system

## Role_permission map

`'Locked': [],`

`'User': ['INVOICE_PROCESS', 'PRE_ALERT', 'CUSTOMER_MAINTAIN'],`

`'Superuser': ['INVOICE_PROCESS', 'PRE_ALERT', 'CUSTOMER_MAINTAIN', 'DASHBOARD'],`

`'Administrator': ['INVOICE_PROCESS', 'PRE_ALERT', 'CUSTOMER_MAINTAIN', 'DASHBOARD', 'ADMINISTER']`

## Migrate DB
* python manage.py db init
* python manage.py db migrate
* python manage.py db upgrade
