# Join ODS
## Open Design School edition

Gestionale per nuove istituzioni

## Install

Clone repository:
        
        git clone https://github.com/lascuolaopensource/join-ods.git
        cd join-ods

### Set variables

Rename `env-example` to `.env` in main folder, `join-frontend` and `join-admin-frontend`:

        mv env-example .env
        mv join-frontend/env-example join-frontend/.env
        mv join-admin-frontend/env-example join-admin-frontend/.env

Set addresses, ports, keys and other values changing variables in those files. Be sure to match 'em in `docker-compose.yml` too.

### Build
        
Then take everything up with:

        docker-compose up
        
### Check
Then you can check your public-frontend and admin-frontend visiting the domains set in your `docker-compose.yml` file.
