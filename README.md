## just some phantomjs scripts for auto screencapture for personal use.

### there are 3 scripts

1. for capture supermicro server IPMI sensors status

        # phantomjs status.js http://<IMPI_IP> username password

2. ahsay backup reports auto PDF render

        # phantomjs gen_backup_reports.js http://<URL_OF_OBS> username password YYYY-MM-DD

3. unitrands virtual backup auto screen capture for backup history

        # phantomjs uvb.js http://<UVB>/accounts/login/ username password
