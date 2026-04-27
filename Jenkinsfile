stage('Start New Container') {
    steps {
        bat '''
        echo ===============================
        echo CLEAN OLD CONTAINER
        echo ===============================
        docker ps -a | findstr food-app-green && docker rm -f food-app-green || echo No old container

        echo ===============================
        echo FREE PORT 8086 (if occupied)
        echo ===============================
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8086') do taskkill /PID %%a /F || echo Port free

        echo ===============================
        echo PULL LATEST IMAGE
        echo ===============================
        docker pull nikhilabba12/cloud-food-menu-app:%BUILD_TAG%

        echo ===============================
        echo RUN NEW CONTAINER
        echo ===============================
        docker run -d -p 8086:5000 --name food-app-green nikhilabba12/cloud-food-menu-app:%BUILD_TAG%

        echo ===============================
        echo VERIFY CONTAINER RUNNING
        echo ===============================
        timeout /t 5 >nul
        docker ps | findstr food-app-green || exit 1
        '''
    }
}